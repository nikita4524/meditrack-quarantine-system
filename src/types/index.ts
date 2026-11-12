export type UserRole = 'ADMIN' | 'NURSE' | 'DOCTOR';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  title: string;
  avatar?: string;
}

export type PatientStatus = 'ADMITTED' | 'DISCHARGED' | 'DECEASED';

export interface TemperatureRecord {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  temperature: number; // in Celsius
  nurseId: string;
  nurseName: string;
  notes?: string;
  recordedAt: string; // ISO string
}

export interface DoctorVisit {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  diagnosis: string;
  treatmentNotes: string;
  isEmergencyOverride?: boolean;
  overrideReason?: string;
  recordedAt: string;
}

export interface DischargeApproval {
  doctorApproved: boolean;
  doctorId?: string;
  doctorName?: string;
  doctorApprovedAt?: string;
  doctorNotes?: string;
  adminApproved: boolean;
  adminId?: string;
  adminName?: string;
  adminApprovedAt?: string;
  dischargeNotes?: string;
}

export interface Patient {
  id: string; // e.g. "PT-1001"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  admissionDate: string; // YYYY-MM-DD
  roomNumber: string; // e.g. "R-101" to "R-174"
  status: PatientStatus;
  statusDate?: string; // Date of discharge or death
  diagnosisSummary?: string;
  
  temperatureRecords: TemperatureRecord[];
  doctorVisits: DoctorVisit[];
  dischargeApproval: DischargeApproval;
  
  auditLogs: AuditLog[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
}

export interface FacilityConfig {
  totalCapacity: number; // 74
  feverThreshold: number; // Default 37.5 C or 38.0 C
  mortalityAlertBenchmark: number; // 15%
  recoverySuccessBenchmark: number; // 85%
  consecutiveFeverFreeDaysRequired: number; // 3
}

