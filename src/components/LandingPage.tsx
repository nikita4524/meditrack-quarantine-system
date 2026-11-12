import React from 'react';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  BedDouble,
  Thermometer,
  CalendarCheck,
  FileCheck2,
  BarChart3,
  AlertTriangle,
  Users,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tight text-white">
                  Medi<span className="text-cyan-400">Track</span>
                </span>
                <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                  Quarantine OS
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 transition">
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className="hover:text-cyan-400 transition">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-cyan-400 transition">
                How It Works
              </button>
              <button onClick={() => scrollToSection('roles')} className="hover:text-cyan-400 transition">
                User Roles
              </button>
              <button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition">
                About
              </button>
            </nav>

            {/* Auth Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onLogin}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center space-x-2 transition"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 to-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-cyan-400">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Infection Containment & Clinical Governance</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Smarter Quarantine Management. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                  Better Patient Care.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                An integrated platform to manage patient admissions, monitor daily vitals, coordinate clinical examinations and streamline discharge workflows.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-bold bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/30 flex items-center justify-center space-x-2.5 transition transform hover:-translate-y-0.5"
                >
                  <span>Get Started / Demo Access</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => scrollToSection('features')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-base font-bold bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center space-x-2 transition"
                >
                  <span>Explore Features</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>3-Day Afebrile Rule Engine</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Role-Based Access (RBAC)</span>
                </span>
                <span className="flex items-center space-x-1.5 hidden sm:flex">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Audit Compliant</span>
                </span>
              </div>
            </div>

            {/* Right Column: Hero Medical Application Mockup / Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-slate-950/80 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="ml-2 text-xs font-mono text-slate-400">meditrack.quarantine.local</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300">
                    WARD ACTIVE
                  </span>
                </div>

                {/* Dashboard Snapshot Widget */}
                <div className="mt-5 space-y-4">
                  {/* Bed Status */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Facility Occupancy</div>
                      <div className="text-2xl font-black text-white mt-0.5">8 / 74 Beds</div>
                      <div className="text-[11px] text-emerald-400 mt-1 font-semibold">66 Negative-Pressure Rooms Available</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                      <BedDouble className="w-6 h-6" />
                    </div>
                  </div>

                  {/* 3-Day Rule Active Patient Preview */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Room R-104 &bull; Aisha Al-Mansoor</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700">
                        3/3 Afebrile
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Fever-Free Days Streak</span>
                        <span className="text-emerald-400 font-bold">100% Eligible</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-full rounded-full"></div>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Doctor Clearance:</span>
                      <span className="text-indigo-400 font-semibold">Queued for Review</span>
                    </div>
                  </div>

                  {/* Operational Metrics Strip */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Mortality Benchmark</div>
                      <div className="text-lg font-black text-white mt-0.5">&le; 15.0%</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">Compliant Safe</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Recovery Target</div>
                      <div className="text-lg font-black text-white mt-0.5">&ge; 85.0%</div>
                      <div className="text-[10px] text-cyan-400 font-semibold">Protocol Target</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Statistics Section */}
      <section className="py-12 bg-slate-950 border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              System Configuration & Architectural Parameters
            </span>
            <p className="text-xs text-slate-500 mt-2">
              The metrics below represent statutory facility operating rules and capacity limits, not variable hospital tallies.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-4xl sm:text-5xl font-black text-white">74</div>
              <div className="text-xs sm:text-sm font-bold text-slate-300 mt-2">Isolation Beds</div>
              <div className="text-[11px] text-slate-500 mt-1">Total Fixed Capacity</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-4xl sm:text-5xl font-black text-cyan-400">3</div>
              <div className="text-xs sm:text-sm font-bold text-slate-300 mt-2">Consecutive Afebrile Days</div>
              <div className="text-[11px] text-slate-500 mt-1">Discharge Prerequisite</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-4xl sm:text-5xl font-black text-amber-400">15%</div>
              <div className="text-xs sm:text-sm font-bold text-slate-300 mt-2">Mortality Benchmark</div>
              <div className="text-[11px] text-slate-500 mt-1">Critical Alert Ceiling</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-4xl sm:text-5xl font-black text-emerald-400">3</div>
              <div className="text-xs sm:text-sm font-bold text-slate-300 mt-2">Dedicated User Roles</div>
              <div className="text-[11px] text-slate-500 mt-1">Admin, Nurse & Doctor</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Clinical Integrity Built Into Every Interaction
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              MediTrack automates viral quarantine triage, prevents room assignment conflicts, and enforces medical clearance before patient discharge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <BedDouble className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Admission & Room Allocation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assign negative-pressure isolation rooms (R-101 to R-174) with automated capacity collision checks and unique patient ID generation.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Thermometer className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Daily Temperature Monitoring</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enforces canonical 1-per-calendar-day temperature recording per patient. Physiological range checks prevent data entry mistakes.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Doctor Examination & Treatment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive physician rounds with vital trend charts. Routine visits require morning vitals, with emergency clinical override safeguards.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">3-Day Fever-Free Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated afebrile streak calculation (0/3 to 3/3). Any temperature &ge;37.5&deg;C or missing record day resets the counter to zero.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-teal-600/20 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Two-Stage Discharge Gate</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Doctor signs clinical clearance after 3 consecutive afebrile days; Admin executes final discharge to automatically release the isolation room.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Mortality & Recovery Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculated strictly against completed outcomes (active patients excluded). Compares actual performance against 15% mortality benchmarks.
              </p>
            </div>

            {/* Card 7 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Role-Based Access Control</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict separation of clinical roles. Nurses cannot discharge patients; doctors cannot perform administrative bed allocations.
              </p>
            </div>

            {/* Card 8 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Automated Clinical Alerts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time warnings for pending temperatures, unexamined patients, mortality threshold breaches, and facility full capacity locks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800">
              Protocol Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How the Quarantine Containment Workflow Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              A 5-step clinical orchestration path ensuring zero premature discharges and complete auditability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md">
                1
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Patient Admission</h4>
              <p className="text-xs text-slate-400">Admin registers patient and assigns a vacant isolation room.</p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md">
                2
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Nurse Records Temp</h4>
              <p className="text-xs text-slate-400">Daily canonical vitals logged; checks for &lt;37.5&deg;C afebrile status.</p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md">
                3
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Doctor Exam</h4>
              <p className="text-xs text-slate-400">Physician conducts clinical rounds and reviews temperature progression.</p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md">
                4
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Medical Clearance</h4>
              <p className="text-xs text-slate-400">Granted by Doctor only after 3 full consecutive afebrile days.</p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-cyan-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md">
                5
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Final Admin Discharge</h4>
              <p className="text-xs text-slate-400">Admin approves final exit certificate and automatically frees the bed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. User Roles Section */}
      <section id="roles" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800">
              Role-Based Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tailored Workspaces for Every Quarantine Stakeholder
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Eliminates confusion and protects containment rules by enforcing strict responsibility boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Admin Role Card */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Admin Persona</h3>
                <div className="text-xs text-blue-400 font-semibold mb-4">Sarah Connor, RN MHA &bull; Facility Director</div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Maintains overarching quarantine governance. Monitors ward census, admits patients, manages room allocations up to 74 beds, approves final discharges, and tracks facility mortality benchmarks.
                </p>
                <ul className="text-xs text-slate-300 space-y-2.5">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Bed Allocation & 74-Bed Lock</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Final Administrative Discharge</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Mortality Benchmark Surveillance</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onLogin}
                className="mt-8 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 hover:border-blue-500 transition"
              >
                Sign In as Admin
              </button>
            </div>

            {/* Nurse Role Card */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6">
                  <HeartPulse className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nurse Persona</h3>
                <div className="text-xs text-emerald-400 font-semibold mb-4">David Patel, BSN &bull; Senior Triage Nurse</div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Conducts daily patient vitals rounds. Records canonical morning temperatures, observes clinical changes, and monitors daily afebrile progression streaks.
                </p>
                <ul className="text-xs text-slate-300 space-y-2.5">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1-Per-Day Canonical Temperature Entry</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pending Check Vitals Roster</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Duplicate Entry Prevention</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onLogin}
                className="mt-8 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500 transition"
              >
                Sign In as Nurse
              </button>
            </div>

            {/* Doctor Role Card */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Doctor Persona</h3>
                <div className="text-xs text-indigo-400 font-semibold mb-4">Dr. Evelyn Reed, MD FIDSA &bull; Chief Specialist</div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Performs daily medical examinations, analyzes temperature trend graphs, logs diagnoses, executes emergency overrides when vitals are delayed, and signs 3-day discharge eligibility.
                </p>
                <ul className="text-xs text-slate-300 space-y-2.5">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Clinical Examination & Prescriptions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Emergency Clinical Override</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>3-Day Afebrile Medical Clearance</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onLogin}
                className="mt-8 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500 transition"
              >
                Sign In as Doctor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer & About Section */}
      <footer id="about" className="bg-slate-950 border-t border-slate-800 pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="font-black text-xl text-white">Medi<span className="text-cyan-400">Track</span></span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                MediTrack – Virus Quarantine & Treatment Management System. A high-reliability clinical containment SaaS application engineered to improve patient monitoring, coordinate nurse and doctor activities, manage timely discharges, and track facility performance.
              </p>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-cyan-300">

              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="font-bold text-white text-sm">Navigation</h4>
              <ul className="space-y-2">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white">Home</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white">How It Works</button></li>
                <li><button onClick={() => scrollToSection('roles')} className="hover:text-white">User Roles</button></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="font-bold text-white text-sm">Clinical Rules</h4>
              <ul className="space-y-2">
                <li><span>74-Bed Max Limit</span></li>
                <li><span>1 Vitals Check / Day</span></li>
                <li><span>3 Days &lt;37.5&deg;C Afebrile</span></li>
                <li><span>15% Mortality Benchmark</span></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="font-bold text-white text-sm">Access Portal</h4>
              <p className="text-slate-400 text-xs">
                Launch the application or test with preloaded credentials for Admin, Nurse, and Doctor roles.
              </p>
              <button
                onClick={onGetStarted}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition"
              >
                Launch Application
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <div>&copy; {new Date().getFullYear()} MediTrack Systems. Technical Product Manager Evaluation.</div>
            <div>Built with React 19, TypeScript, Vite, Tailwind CSS, Recharts & Lucide Icons.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

