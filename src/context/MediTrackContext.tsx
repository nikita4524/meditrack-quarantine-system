import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, User, FacilityConfig, TemperatureRecord, DoctorVisit, UserRole, AuditLog } from '../types';
import { DEMO_USERS, INITIAL_PATIENTS } from '../utils/mockData';
import { DEFAULT_CONFIG, getTodayDateString, getCurrentTimeString, calculateFeverFreeDays } from '../utils/rules';

interface MediTrackContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (emailOrUser: string, password?: string) => { success: boolean; message: string; defaultTab?: string };
  registerUser: (userData: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    title?: string;
  }) => { success: boolean; message: string; defaultTab?: string };
  logout: () => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  switchUser: (role: UserRole) => void;
  patients: Patient[];
  config: FacilityConfig;
  updateConfig: (newConfig: Partial<FacilityConfig>, headDoctorApproved?: boolean) => { success: boolean; message: string };
  
  // Patient CRUD
  registerPatient: (patientData: {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    admissionDate: string;
    roomNumber: string;
    diagnosisSummary?: string;
  }) => { success: boolean; message: string };
  
  updatePatientNotes: (patientId: string, summary: string) => void;
  markPatientDeceased: (patientId: string, reason: string) => { success: boolean; message: string };
  
  // Nurse actions
  recordTemperature: (data: {
    patientId: string;
    temperature: number;
    date: string;
    time: string;
    notes?: string;
  }) => { success: boolean; message: string };
  
  // Doctor actions
  recordDoctorVisit: (data: {
    patientId: string;
    date: string;
    time: string;
    diagnosis: string;
    treatmentNotes: string;
    isEmergencyOverride?: boolean;
    overrideReason?: string;
  }) => { success: boolean; message: string };
  
  confirmDoctorDischargeEligibility: (patientId: string, notes: string) => { success: boolean; message: string };
  revokeDoctorDischargeEligibility: (patientId: string, reason: string) => { success: boolean; message: string };
  
  // Admin actions
  finalizeDischarge: (patientId: string, dischargeNotes: string) => { success: boolean; message: string };
  
  // Reset demo data
  resetAllData: () => void;
  
  // Audit Logs
  auditLogs: AuditLog[];
}

const STORAGE_KEY_PATIENTS = 'meditrack_patients_v1';
const STORAGE_KEY_CONFIG = 'meditrack_config_v1';
const STORAGE_KEY_ROLE = 'meditrack_current_role_v1';
const STORAGE_KEY_LOGS = 'meditrack_logs_v1';
const STORAGE_KEY_AUTH = 'meditrack_auth_user_v1';
const STORAGE_KEY_DEMO_MODE = 'meditrack_demo_mode_v1';
const STORAGE_KEY_CUSTOM_USERS = 'meditrack_custom_users_v1';

const MediTrackContext = createContext<MediTrackContextType | undefined>(undefined);

export const MediTrackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Combine with standard DEMO_USERS, avoiding duplicates
        const combined = [...DEMO_USERS];
        parsed.forEach((pu: User) => {
          if (!combined.some((u) => u.email.toLowerCase() === pu.email.toLowerCase())) {
            combined.push(pu);
          }
        });
        return combined;
      } catch (e) {
        console.error('Failed to parse custom users', e);
      }
    }
    return DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        return parsed;
      } catch (e) {
        console.error('Failed to parse auth user', e);
      }
    }
    return null;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_DEMO_MODE) === 'true';
  });

  const [config, setConfig] = useState<FacilityConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse config from storage', e);
      }
    }
    return DEFAULT_CONFIG;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PATIENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse patients from storage', e);
      }
    }
    return INITIAL_PATIENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse logs from storage', e);
      }
    }
    return [
      {
        id: 'INIT-1',
        timestamp: new Date().toISOString(),
        userId: 'SYS-00',
        userName: 'System Initialization',
        userRole: 'ADMIN',
        action: 'SYSTEM_BOOT',
        details: 'MediTrack Quarantine and Treatment System online.',
      },
    ];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    // Persist custom registered users
    const customOnly = users.filter((u) => !DEMO_USERS.some((du) => du.id === u.id));
    localStorage.setItem(STORAGE_KEY_CUSTOM_USERS, JSON.stringify(customOnly));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEY_ROLE, currentUser.role);
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
      localStorage.removeItem(STORAGE_KEY_ROLE);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DEMO_MODE, isDemoMode ? 'true' : 'false');
  }, [isDemoMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'ANONYMOUS',
      userName: currentUser?.name || 'Unauthenticated User',
      userRole: currentUser?.role || 'ADMIN',
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const login = (emailOrUser: string, password?: string) => {
    const trimmedInput = emailOrUser.trim().toLowerCase();
    const targetUser = users.find(
      (u) =>
        u.email.toLowerCase() === trimmedInput ||
        u.role.toLowerCase() === trimmedInput ||
        u.id.toLowerCase() === trimmedInput
    );

    if (!targetUser) {
      return { success: false, message: 'Invalid credentials. User account not found in MediTrack directory.' };
    }

    if (password && targetUser.password && targetUser.password !== password) {
      return { success: false, message: 'Invalid password. Please verify your clinical login credentials.' };
    }

    setCurrentUser(targetUser);
    
    // Map default tab by role
    let defaultTab = 'ADMIN_DASHBOARD';
    if (targetUser.role === 'NURSE') defaultTab = 'NURSE_TEMPERATURES';
    if (targetUser.role === 'DOCTOR') defaultTab = 'DOCTOR_EXAMINATIONS';

    addAuditLog('USER_LOGIN', `User ${targetUser.name} (${targetUser.role}) authenticated successfully.`);

    return {
      success: true,
      message: `Welcome, ${targetUser.name}`,
      defaultTab,
    };
  };

  const registerUser = (userData: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    title?: string;
  }) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const defaultTitle = 
      userData.title?.trim() ||
      (userData.role === 'ADMIN' ? 'Quarantine Facility Administrator' : userData.role === 'DOCTOR' ? 'Attending Physician' : 'Quarantine Ward Nurse');

    const defaultAvatar = 
      userData.role === 'ADMIN'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : userData.role === 'DOCTOR'
        ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1594824813576-2f0857500c01?w=150&auto=format&fit=crop&q=80';

    const newUser: User = {
      id: `${userData.role.slice(0, 3)}-${100 + users.length + 1}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      password: userData.password || 'Pass@123',
      role: userData.role,
      title: defaultTitle,
      avatar: defaultAvatar,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    let defaultTab = 'ADMIN_DASHBOARD';
    if (newUser.role === 'NURSE') defaultTab = 'NURSE_TEMPERATURES';
    if (newUser.role === 'DOCTOR') defaultTab = 'DOCTOR_EXAMINATIONS';

    addAuditLog('USER_REGISTERED', `New clinical account created for ${newUser.name} (${newUser.role}).`);

    return {
      success: true,
      message: `Account created successfully! Welcome, ${newUser.name}.`,
      defaultTab,
    };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('USER_LOGOUT', `User ${currentUser.name} (${currentUser.role}) logged out.`);
    }
    setCurrentUser(null);
  };

  const switchUser = (role: UserRole) => {
    const user = DEMO_USERS.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      addAuditLog('ROLE_SWITCH', `Switched active session to ${user.name} (${user.role})`);
    }
  };

  const updateConfig = (newConfig: Partial<FacilityConfig>, headDoctorApproved?: boolean) => {
    // Fever threshold config requires head doctor approval
    if (newConfig.feverThreshold !== undefined && newConfig.feverThreshold !== config.feverThreshold) {
      if (!headDoctorApproved && (!currentUser || currentUser.role !== 'DOCTOR')) {
        return {
          success: false,
          message: 'Fever threshold configuration requires Chief Medical Officer (Head Doctor) approval.',
        };
      }
    }

    const updated = { ...config, ...newConfig };
    setConfig(updated);
    addAuditLog('CONFIG_UPDATED', `Facility parameters updated: Fever Threshold=${updated.feverThreshold}°C, Capacity=${updated.totalCapacity}`);
    return { success: true, message: 'Facility parameters successfully updated.' };
  };

  // Register Patient (Admin only)
  const registerPatient = (patientData: {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    admissionDate: string;
    roomNumber: string;
    diagnosisSummary?: string;
  }) => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return { success: false, message: 'Permission Denied: Only Admin can admit patients and assign rooms.' };
    }

    // Capacity Check
    const admittedCount = patients.filter((p) => p.status === 'ADMITTED').length;
    if (admittedCount >= config.totalCapacity) {
      return {
        success: false,
        message: `Admission Denied: Quarantine facility is at maximum capacity (${config.totalCapacity}/${config.totalCapacity} rooms occupied).`,
      };
    }

    // Room Conflict Check
    const roomOccupied = patients.some(
      (p) => p.status === 'ADMITTED' && p.roomNumber.toUpperCase() === patientData.roomNumber.toUpperCase()
    );
    if (roomOccupied) {
      return {
        success: false,
        message: `Conflict Error: Room ${patientData.roomNumber} is currently occupied by an active patient.`,
      };
    }

    // Generate unique Patient ID
    const nextNum = 1000 + patients.length + 1;
    const newId = `PT-${nextNum}`;

    const newPatient: Patient = {
      id: newId,
      name: patientData.name.trim(),
      age: patientData.age,
      gender: patientData.gender,
      admissionDate: patientData.admissionDate || getTodayDateString(),
      roomNumber: patientData.roomNumber.trim().toUpperCase(),
      status: 'ADMITTED',
      diagnosisSummary: patientData.diagnosisSummary?.trim() || 'Suspected viral infection under quarantine observation.',
      temperatureRecords: [],
      doctorVisits: [],
      dischargeApproval: {
        doctorApproved: false,
        adminApproved: false,
      },
      auditLogs: [
        {
          id: `PLOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: 'ADMITTED',
          details: `Admitted into room ${patientData.roomNumber.trim().toUpperCase()}`,
        },
      ],
    };

    setPatients((prev) => [newPatient, ...prev]);
    addAuditLog('PATIENT_REGISTRATION', `Admitted patient ${newPatient.name} (${newPatient.id}) into ${newPatient.roomNumber}`);

    return {
      success: true,
      message: `Patient ${newPatient.name} successfully admitted into room ${newPatient.roomNumber} with ID ${newPatient.id}.`,
    };
  };

  const updatePatientNotes = (patientId: string, summary: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, diagnosisSummary: summary } : p))
    );
  };

  const markPatientDeceased = (patientId: string, reason: string) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'DOCTOR')) {
      return { success: false, message: 'Permission denied: Only Admin or Doctor can record patient outcome.' };
    }

    const target = patients.find((p) => p.id === patientId);
    if (!target) return { success: false, message: 'Patient not found' };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'DECEASED',
            statusDate: getTodayDateString(),
            auditLogs: [
              ...p.auditLogs,
              {
                id: `LOG-DEC-${Date.now()}`,
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                userName: currentUser.name,
                userRole: currentUser.role,
                action: 'DECEASED_OUTCOME_RECORDED',
                details: `Outcome recorded as deceased: ${reason}`,
              },
            ],
          };
        }
        return p;
      })
    );

    addAuditLog('PATIENT_DECEASED', `Recorded deceased status for patient ${target.name} (${target.id}). Reason: ${reason}`);
    return { success: true, message: `Patient status updated to deceased. Room ${target.roomNumber} is released.` };
  };

  // Nurse: Record Daily Temperature
  const recordTemperature = (data: {
    patientId: string;
    temperature: number;
    date: string;
    time: string;
    notes?: string;
  }) => {
    if (!currentUser || (currentUser.role !== 'NURSE' && currentUser.role !== 'ADMIN')) {
      return { success: false, message: 'Permission Denied: Only Nurses (or Admins) can record clinical temperatures.' };
    }

    const patient = patients.find((p) => p.id === data.patientId);
    if (!patient) {
      return { success: false, message: 'Patient not found.' };
    }

    if (patient.status !== 'ADMITTED') {
      return { success: false, message: `Cannot log vitals: Patient status is ${patient.status}.` };
    }

    // Input validation
    if (isNaN(data.temperature) || data.temperature < 32 || data.temperature > 44) {
      return { success: false, message: 'Validation Error: Temperature must be a realistic physiological value (32.0°C - 44.0°C).' };
    }

    // Rule: Only one temperature entry per patient per calendar day
    const alreadyLoggedToday = patient.temperatureRecords.some((r) => r.date === data.date);
    if (alreadyLoggedToday) {
      return {
        success: false,
        message: `Duplicate Entry Prevented: Patient ${patient.name} (${patient.id}) already has a temperature logged for ${data.date}. Policy permits only 1 canonical record per calendar day.`,
      };
    }

    const newRecord: TemperatureRecord = {
      id: `TR-${patient.id}-${Date.now()}`,
      patientId: patient.id,
      date: data.date,
      time: data.time || getCurrentTimeString(),
      temperature: Number(data.temperature.toFixed(1)),
      nurseId: currentUser.id,
      nurseName: currentUser.name,
      notes: data.notes?.trim(),
      recordedAt: new Date().toISOString(),
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === data.patientId) {
          const updatedRecords = [...p.temperatureRecords, newRecord];
          return {
            ...p,
            temperatureRecords: updatedRecords,
            auditLogs: [
              ...p.auditLogs,
              {
                id: `LOG-TR-${Date.now()}`,
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                userName: currentUser.name,
                userRole: currentUser.role,
                action: 'TEMPERATURE_RECORDED',
                details: `Logged ${newRecord.temperature}°C on ${newRecord.date} at ${newRecord.time}`,
              },
            ],
          };
        }
        return p;
      })
    );

    addAuditLog('TEMPERATURE_LOGGED', `Recorded ${newRecord.temperature}°C for patient ${patient.name} (${patient.id}) by ${currentUser.name}`);
    return {
      success: true,
      message: `Temperature of ${newRecord.temperature}°C recorded successfully for ${patient.name} (${patient.roomNumber}).`,
    };
  };

  // Doctor: Record Examination Visit
  const recordDoctorVisit = (data: {
    patientId: string;
    date: string;
    time: string;
    diagnosis: string;
    treatmentNotes: string;
    isEmergencyOverride?: boolean;
    overrideReason?: string;
  }) => {
    if (!currentUser || currentUser.role !== 'DOCTOR') {
      return { success: false, message: 'Permission Denied: Only credentialed Doctors can record examination notes.' };
    }

    const patient = patients.find((p) => p.id === data.patientId);
    if (!patient) return { success: false, message: 'Patient not found.' };

    if (patient.status !== 'ADMITTED') {
      return { success: false, message: `Cannot examine: Patient status is ${patient.status}.` };
    }

    // Business Rule: Warning/Block if routine visit before temperature recorded for the day
    const hasTempToday = patient.temperatureRecords.some((r) => r.date === data.date);
    if (!hasTempToday && !data.isEmergencyOverride) {
      return {
        success: false,
        message: 'Pre-requisite Alert: Daily morning temperature has not yet been recorded for today by nursing staff. To proceed without vitals, emergency clinical override with justification is required.',
      };
    }

    if (data.isEmergencyOverride && (!data.overrideReason || data.overrideReason.trim().length < 5)) {
      return {
        success: false,
        message: 'Clinical Protocol: Emergency override requires a documented medical reason of at least 5 characters.',
      };
    }

    const newVisit: DoctorVisit = {
      id: `DV-${patient.id}-${Date.now()}`,
      patientId: patient.id,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      date: data.date,
      time: data.time || getCurrentTimeString(),
      diagnosis: data.diagnosis.trim(),
      treatmentNotes: data.treatmentNotes.trim(),
      isEmergencyOverride: !!data.isEmergencyOverride,
      overrideReason: data.overrideReason?.trim(),
      recordedAt: new Date().toISOString(),
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === data.patientId) {
          return {
            ...p,
            doctorVisits: [...p.doctorVisits, newVisit],
            auditLogs: [
              ...p.auditLogs,
              {
                id: `LOG-DV-${Date.now()}`,
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                userName: currentUser.name,
                userRole: currentUser.role,
                action: 'DOCTOR_EXAMINATION_COMPLETED',
                details: `Doctor visit completed by ${currentUser.name}.${newVisit.isEmergencyOverride ? ` Emergency Override: ${newVisit.overrideReason}` : ''}`,
              },
            ],
          };
        }
        return p;
      })
    );

    addAuditLog('DOCTOR_VISIT', `Examination logged for ${patient.name} (${patient.id}) by ${currentUser.name}`);
    return {
      success: true,
      message: `Examination record saved for ${patient.name}.`,
    };
  };

  // Doctor: Confirm Discharge Eligibility
  const confirmDoctorDischargeEligibility = (patientId: string, notes: string) => {
    if (!currentUser || currentUser.role !== 'DOCTOR') {
      return { success: false, message: 'Permission Denied: Only Doctors can confirm medical discharge eligibility.' };
    }

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return { success: false, message: 'Patient not found.' };

    const feverStatus = calculateFeverFreeDays(patient, config.feverThreshold, config.consecutiveFeverFreeDaysRequired);
    if (!feverStatus.isEligibleForDoctorConfirmation) {
      return {
        success: false,
        message: `Medical Criteria Unmet: Patient has ${feverStatus.consecutiveDays}/${config.consecutiveFeverFreeDaysRequired} consecutive fever-free days. 3 full consecutive afebrile days are strictly mandatory.`,
      };
    }

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            dischargeApproval: {
              ...p.dischargeApproval,
              doctorApproved: true,
              doctorId: currentUser.id,
              doctorName: currentUser.name,
              doctorApprovedAt: new Date().toISOString(),
              doctorNotes: notes.trim() || 'Patient meets all clinical criteria: 3 full fever-free days and stable pulmonary vitals. Cleared for discharge.',
            },
            auditLogs: [
              ...p.auditLogs,
              {
                id: `LOG-DOC-APPR-${Date.now()}`,
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                userName: currentUser.name,
                userRole: currentUser.role,
                action: 'DOCTOR_DISCHARGE_CONFIRMED',
                details: `Clinical clearance granted for discharge. Notes: ${notes}`,
              },
            ],
          };
        }
        return p;
      })
    );

    addAuditLog('DISCHARGE_ELIGIBILITY_CONFIRMED', `Doctor ${currentUser.name} confirmed discharge eligibility for ${patient.name}`);
    return { success: true, message: `Medical clearance granted for ${patient.name}. Patient is now queued for Admin final discharge.` };
  };

  const revokeDoctorDischargeEligibility = (patientId: string, reason: string) => {
    if (!currentUser || currentUser.role !== 'DOCTOR') {
      return { success: false, message: 'Permission Denied: Only Doctors can revoke clearance.' };
    }

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            dischargeApproval: {
              ...p.dischargeApproval,
              doctorApproved: false,
              doctorId: undefined,
              doctorName: undefined,
              doctorApprovedAt: undefined,
              doctorNotes: undefined,
            },
            auditLogs: [
              ...p.auditLogs,
              {
                id: `LOG-DOC-REV-${Date.now()}`,
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                userName: currentUser.name,
                userRole: currentUser.role,
                action: 'DOCTOR_DISCHARGE_REVOKED',
                details: `Discharge eligibility revoked. Reason: ${reason}`,
              },
            ],
          };
        }
        return p;
      })
    );

    addAuditLog('DISCHARGE_REVOKED', `Doctor ${currentUser.name} revoked discharge eligibility for patient ${patientId}`);
    return { success: true, message: 'Discharge eligibility revoked. Patient returns to quarantine observation.' };
  };

  // Admin: Finalize Discharge
  const finalizeDischarge = (patientId: string, dischargeNotes: string) => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return { success: false, message: 'Permission Denied: Only Administrative authority can finalize discharge and release rooms.' };
    }

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return { success: false, message: 'Patient not found.' };

    // Prevent discharge without doctor approval and 3-day criterion
    const feverStatus = calculateFeverFreeDays(patient, config.feverThreshold, config.consecutiveFeverFreeDaysRequired);
    if (!feverStatus.isEligibleForDoctorConfirmation) {
      return {
        success: false,
        message: `Policy Violation: Patient does not meet the 3 full consecutive fever-free days criterion (${feverStatus.consecutiveDays}/3). Cannot discharge.`,
      };
    }

    if (!patient.dischargeApproval.doctorApproved) {
      return {
        success: false,
        message: 'Policy Violation: Patient has not received signed medical clearance from an assigned Doctor. Final discharge cannot be approved.',
      };
    }

    const releasedRoom = patient.roomNumber;

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'DISCHARGED',
            statusDate: getTodayDateString(),
            dischargeApproval: {
              ...p.dischargeApproval,
              adminApproved: true,
              adminId: currentUser.id,
              adminName: currentUser.name,
              adminApprovedAt: new Date().toISOString(),
              dischargeNotes: dischargeNotes.trim() || 'Discharge protocol completed. Quarantine exit certificate delivered.',
            },
            auditLogs: [
              ...p.auditLogs,
              {
                id: `LOG-ADM-DIS-${Date.now()}`,
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                userName: currentUser.name,
                userRole: currentUser.role,
                action: 'ADMIN_DISCHARGE_FINALIZED',
                details: `Final discharge approved. Isolation Room ${releasedRoom} marked sanitized & available.`,
              },
            ],
          };
        }
        return p;
      })
    );

    addAuditLog('FINAL_DISCHARGE_COMPLETED', `Admin ${currentUser.name} discharged patient ${patient.name} (${patient.id}). Room ${releasedRoom} released.`);
    return {
      success: true,
      message: `Patient ${patient.name} (${patient.id}) successfully discharged! Room ${releasedRoom} has been released to available capacity.`,
    };
  };

  // Reset to default demo data
  const resetAllData = () => {
    setPatients(INITIAL_PATIENTS);
    setConfig(DEFAULT_CONFIG);
    setCurrentUser(DEMO_USERS[0]);
    localStorage.removeItem(STORAGE_KEY_PATIENTS);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    localStorage.removeItem(STORAGE_KEY_ROLE);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    setAuditLogs([
      {
        id: `LOG-RESET-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: 'SYS-RESET',
        userName: 'System Administrator',
        userRole: 'ADMIN',
        action: 'DATA_RESET',
        details: 'Quarantine and treatment database reset to standard demonstration state.',
      },
    ]);
  };

  return (
    <MediTrackContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        registerUser,
        logout,
        isDemoMode,
        setIsDemoMode,
        switchUser,
        patients,
        config,
        updateConfig,
        registerPatient,
        updatePatientNotes,
        markPatientDeceased,
        recordTemperature,
        recordDoctorVisit,
        confirmDoctorDischargeEligibility,
        revokeDoctorDischargeEligibility,
        finalizeDischarge,
        resetAllData,
        auditLogs,
      }}
    >
      {children}
    </MediTrackContext.Provider>
  );
};

export const useMediTrack = () => {
  const context = useContext(MediTrackContext);
  if (!context) {
    throw new Error('useMediTrack must be used within a MediTrackProvider');
  }
  return context;
};

