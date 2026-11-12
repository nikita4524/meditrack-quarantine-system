import { Patient, TemperatureRecord, FacilityConfig } from '../types';

export const DEFAULT_CONFIG: FacilityConfig = {
  totalCapacity: 74,
  feverThreshold: 37.5, // Celsius
  mortalityAlertBenchmark: 15, // percent
  recoverySuccessBenchmark: 85, // percent
  consecutiveFeverFreeDaysRequired: 3,
};

/**
 * Returns today's date in local YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns current local time in HH:mm format
 */
export const getCurrentTimeString = (): string => {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
};

/**
 * Generate room numbers from R-101 to R-174
 */
export const ALL_ROOM_NUMBERS: string[] = Array.from({ length: 74 }, (_, i) => {
  const roomNum = 101 + i;
  return `R-${roomNum}`;
});

/**
 * Check if a temperature reading counts as a fever
 */
export const isFever = (temp: number, threshold: number): boolean => {
  return temp >= threshold;
};

/**
 * Checks if patient has a temperature recorded for a specific calendar date (defaults to today)
 */
export const hasTemperatureRecordedForDate = (patient: Patient, dateStr = getTodayDateString()): boolean => {
  return patient.temperatureRecords.some((r) => r.date === dateStr);
};

/**
 * Checks if patient had a doctor visit today
 */
export const hasDoctorVisitedToday = (patient: Patient, dateStr = getTodayDateString()): boolean => {
  return patient.doctorVisits.some((v) => v.date === dateStr);
};

/**
 * Calculate consecutive fever-free calendar days up to the most recent record or today.
 * Business Rules:
 * - A patient is eligible for discharge after 3 FULL CONSECUTIVE DAYS WITHOUT FEVER.
 * - Fever resets the consecutive fever-free count.
 * - Missing temperature data must not count as a fever-free day.
 * - Calculate complete fever-free days correctly.
 * - Show progress such as 0/3, 1/3, 2/3, 3/3.
 */
export interface FeverFreeStatus {
  consecutiveDays: number;
  maxRequired: number;
  isEligibleForDoctorConfirmation: boolean;
  historySummary: { date: string; temp: number; isFever: boolean }[];
  lastCheckedDate?: string;
  hasFeverToday?: boolean;
}

export const calculateFeverFreeDays = (
  patient: Patient,
  feverThreshold: number = DEFAULT_CONFIG.feverThreshold,
  requiredDays: number = DEFAULT_CONFIG.consecutiveFeverFreeDaysRequired
): FeverFreeStatus => {
  // Sort records ascending by date
  const records = [...patient.temperatureRecords].sort((a, b) => a.date.localeCompare(b.date));

  if (records.length === 0) {
    return {
      consecutiveDays: 0,
      maxRequired: requiredDays,
      isEligibleForDoctorConfirmation: false,
      historySummary: [],
    };
  }

  // Deduplicate by calendar day (one per day rule, taking the canonical recorded record)
  const recordsByDay = new Map<string, TemperatureRecord>();
  records.forEach((r) => {
    recordsByDay.set(r.date, r);
  });

  const sortedDays = Array.from(recordsByDay.keys()).sort();
  const historySummary = sortedDays.map((d) => {
    const rec = recordsByDay.get(d)!;
    return {
      date: d,
      temp: rec.temperature,
      isFever: isFever(rec.temperature, feverThreshold),
    };
  });

  // Calculate consecutive consecutive days backwards from the latest day
  // BUT we must also ensure strict calendar day continuity: day[i] must be day[i-1] + 1 day
  let count = 0;
  
  if (sortedDays.length > 0) {
    // Iterate from newest day backwards
    let prevDate: Date | null = null;
    
    for (let i = sortedDays.length - 1; i >= 0; i--) {
      const dayStr = sortedDays[i];
      const rec = recordsByDay.get(dayStr)!;
      const currDate = new Date(`${dayStr}T00:00:00`);

      if (isFever(rec.temperature, feverThreshold)) {
        // Fever breaks the streak immediately
        break;
      }

      if (prevDate !== null) {
        // Check date continuity (must be exactly 1 day difference)
        const diffTime = prevDate.getTime() - currDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
        if (diffDays !== 1) {
          // Missing temperature data between consecutive days breaks the consecutive streak
          break;
        }
      }

      count++;
      prevDate = currDate;
    }
  }

  const cappedCount = Math.min(count, requiredDays);
  const isEligible = count >= requiredDays;
  const latestRecord = records[records.length - 1];

  return {
    consecutiveDays: cappedCount,
    maxRequired: requiredDays,
    isEligibleForDoctorConfirmation: isEligible,
    historySummary,
    lastCheckedDate: latestRecord?.date,
    hasFeverToday: latestRecord ? isFever(latestRecord.temperature, feverThreshold) : false,
  };
};

/**
 * Analytics Calculations:
 * Mortality Rate = (Total Deaths / Total Completed Outcomes) × 100
 * Success Rate = (Recovered Outcomes / Total Completed Outcomes) × 100
 * Exclude ongoing (ADMITTED) patients from completed outcome calculations.
 */
export interface AnalyticsData {
  totalCapacity: number;
  currentAdmitted: number;
  availableRooms: number;
  occupancyRate: number;
  
  pendingTempChecksToday: number;
  pendingDoctorVisitsToday: number;
  
  doctorDischargeEligibleCount: number; // 3/3 fever-free awaiting doctor review
  adminDischargePendingCount: number; // Doctor approved, awaiting admin discharge
  
  totalDischarged: number;
  totalDeaths: number;
  totalCompletedOutcomes: number;
  
  mortalityRate: number; // in %
  successRate: number; // in %
  isMortalityCritical: boolean; // mortality > 15%
  
  admissionsByDate: { date: string; admissions: number; discharges: number; deaths: number }[];
}

export const computeAnalytics = (patients: Patient[], config: FacilityConfig): AnalyticsData => {
  const admitted = patients.filter((p) => p.status === 'ADMITTED');
  const discharged = patients.filter((p) => p.status === 'DISCHARGED');
  const deaths = patients.filter((p) => p.status === 'DECEASED');
  
  const todayStr = getTodayDateString();
  
  const pendingTempChecksToday = admitted.filter((p) => !hasTemperatureRecordedForDate(p, todayStr)).length;
  const pendingDoctorVisitsToday = admitted.filter((p) => !hasDoctorVisitedToday(p, todayStr)).length;

  let doctorDischargeEligibleCount = 0;
  let adminDischargePendingCount = 0;

  admitted.forEach((p) => {
    const feverStatus = calculateFeverFreeDays(p, config.feverThreshold, config.consecutiveFeverFreeDaysRequired);
    if (feverStatus.isEligibleForDoctorConfirmation) {
      if (!p.dischargeApproval.doctorApproved) {
        doctorDischargeEligibleCount++;
      } else if (!p.dischargeApproval.adminApproved) {
        adminDischargePendingCount++;
      }
    }
  });

  const totalCompletedOutcomes = discharged.length + deaths.length;
  const mortalityRate = totalCompletedOutcomes > 0 
    ? Number(((deaths.length / totalCompletedOutcomes) * 100).toFixed(1)) 
    : 0;
  
  const successRate = totalCompletedOutcomes > 0 
    ? Number(((discharged.length / totalCompletedOutcomes) * 100).toFixed(1)) 
    : 0;

  const isMortalityCritical = mortalityRate > config.mortalityAlertBenchmark;

  // Aggregate admissions and outcomes over time
  const datesSet = new Set<string>();
  patients.forEach((p) => {
    if (p.admissionDate) datesSet.add(p.admissionDate);
    if (p.statusDate) datesSet.add(p.statusDate);
  });
  const sortedDates = Array.from(datesSet).sort();

  const admissionsByDate = sortedDates.map((date) => {
    const admCount = patients.filter((p) => p.admissionDate === date).length;
    const disCount = patients.filter((p) => p.status === 'DISCHARGED' && p.statusDate === date).length;
    const dthCount = patients.filter((p) => p.status === 'DECEASED' && p.statusDate === date).length;
    return {
      date,
      admissions: admCount,
      discharges: disCount,
      deaths: dthCount,
    };
  });

  return {
    totalCapacity: config.totalCapacity,
    currentAdmitted: admitted.length,
    availableRooms: Math.max(0, config.totalCapacity - admitted.length),
    occupancyRate: Number(((admitted.length / config.totalCapacity) * 100).toFixed(1)),
    
    pendingTempChecksToday,
    pendingDoctorVisitsToday,
    
    doctorDischargeEligibleCount,
    adminDischargePendingCount,
    
    totalDischarged: discharged.length,
    totalDeaths: deaths.length,
    totalCompletedOutcomes,
    
    mortalityRate,
    successRate,
    isMortalityCritical,
    admissionsByDate,
  };
};

