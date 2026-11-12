import React, { useState, useEffect } from 'react';
import { MediTrackProvider, useMediTrack } from './context/MediTrackContext';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { PatientManagement } from './components/PatientManagement';
import { NurseDashboard } from './components/NurseDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { DischargeCenter } from './components/DischargeCenter';
import { AnalyticsView } from './components/AnalyticsView';
import { AuditLogsView } from './components/AuditLogsView';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { PatientDetailModal } from './components/PatientDetailModal';
import { RegisterPatientModal } from './components/RegisterPatientModal';
import { SettingsModal } from './components/SettingsModal';
import { Patient } from './types';
import { computeAnalytics } from './utils/rules';

const AppContent: React.FC = () => {
  const { patients, config, currentUser, isAuthenticated, logout } = useMediTrack();
  const [currentTab, setCurrentTab] = useState<TabType>('ADMIN_DASHBOARD');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Landing Page vs Login screen state for unauthenticated visitors
  // Initial screen when opening application must be LANDING
  const [viewState, setViewState] = useState<'LANDING' | 'LOGIN'>(() => {
    // If user is already authenticated in session, don't show landing
    const savedAuth = localStorage.getItem('meditrack_auth_user_v1');
    return savedAuth ? 'LOGIN' : 'LANDING';
  });

  const analytics = computeAnalytics(patients, config);

  // Sync default starting dashboard according to user role when authenticated
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'ADMIN') {
        setCurrentTab((prev) => (prev === 'ADMIN_DASHBOARD' || prev === 'PATIENT_MANAGEMENT' || prev === 'AUDIT_LOGS' || prev === 'ANALYTICS' || prev === 'DISCHARGE_CENTER' ? prev : 'ADMIN_DASHBOARD'));
      } else if (currentUser.role === 'NURSE') {
        setCurrentTab('NURSE_TEMPERATURES');
      } else if (currentUser.role === 'DOCTOR') {
        setCurrentTab('DOCTOR_EXAMINATIONS');
      }
    }
  }, [currentUser?.role]);

  // When unauthenticated: Show either the Landing Page (first screen) or Login Screen
  if (!isAuthenticated || !currentUser) {
    if (viewState === 'LANDING') {
      return (
        <LandingPage
          onGetStarted={() => setViewState('LOGIN')}
          onLogin={() => setViewState('LOGIN')}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={(defaultTab) => {
          setCurrentTab(defaultTab as TabType);
        }}
        onBackToLanding={() => setViewState('LANDING')}
      />
    );
  }

  // Authenticated Application Shell
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={() => {
          logout();
          setViewState('LOGIN'); // Logout returns to Login Screen per spec
        }}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          pendingTempCount={analytics.pendingTempChecksToday}
          pendingExamCount={analytics.pendingDoctorVisitsToday}
          dischargeReadyCount={analytics.adminDischargePendingCount + analytics.doctorDischargeEligibleCount}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {currentTab === 'ADMIN_DASHBOARD' && (
            <AdminDashboard
              onNavigateTab={setCurrentTab}
              onOpenRegisterModal={() => setIsRegisterOpen(true)}
            />
          )}

          {currentTab === 'PATIENT_MANAGEMENT' && currentUser.role === 'ADMIN' && (
            <PatientManagement
              onOpenRegisterModal={() => setIsRegisterOpen(true)}
              onSelectPatient={setSelectedPatient}
            />
          )}

          {currentTab === 'NURSE_TEMPERATURES' && (currentUser.role === 'NURSE' || currentUser.role === 'ADMIN') && (
            <NurseDashboard onSelectPatient={setSelectedPatient} />
          )}

          {currentTab === 'DOCTOR_EXAMINATIONS' && (currentUser.role === 'DOCTOR' || currentUser.role === 'ADMIN') && (
            <DoctorDashboard onSelectPatient={setSelectedPatient} />
          )}

          {currentTab === 'DISCHARGE_CENTER' && (
            <DischargeCenter onSelectPatient={setSelectedPatient} />
          )}

          {currentTab === 'ANALYTICS' && (currentUser.role === 'ADMIN' || currentUser.role === 'DOCTOR') && (
            <AnalyticsView />
          )}

          {currentTab === 'AUDIT_LOGS' && currentUser.role === 'ADMIN' && (
            <AuditLogsView />
          )}
        </main>
      </div>

      {/* Modals */}
      <PatientDetailModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />

      <RegisterPatientModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MediTrackProvider>
      <AppContent />
    </MediTrackProvider>
  );
};

export default App;
