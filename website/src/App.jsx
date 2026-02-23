import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import components
import Modules from './Modules';
import ModuleDetail from './ModuleDetail';
import Dashboard from './Dashboard';
import ComingSoon from './ComingSoon';
import DepartmentManagement from './DepartmentManagement';
import StudentManagement from './StudentManagement';
import TeacherManagement from './TeacherManagement';
import SubjectManagement from './SubjectManagement';
import DepartmentSubjectLinking from './DepartmentSubjectLinking';
import MarkAttendance from './MarkAttendance';
import EnterMarks from './EnterMarks';
import ViewClasses from './ViewClasses';
import UploadAssignments from './UploadAssignments';
import StudentAttendancePercentage from './StudentAttendancePercentage';
import StudentMarksGrades from './StudentMarksGrades';
import StudentTimetable from './StudentTimetable';
import StudentProfile from './StudentProfile';
import StudentCoCurricular from './StudentCoCurricular';
import AcademicCalendar from './AcademicCalendar';
import UpcomingEvents from './UpcomingEvents';
import EventManagement from './EventManagement';
import AttendanceReports from './AttendanceReports';
import MarksReports from './MarksReports';
import AnalyticsDashboard from './AnalyticsDashboard';
import BatchOperations from './BatchOperations';
import SystemSettings from './SystemSettings';
import UserManagement from './UserManagement';
import Notifications from './Notifications';
import FeeManagement from './FeeManagement';
import TransportHostel from './TransportHostel';
import Messaging from './Messaging';
import Forum from './Forum';
import AssignmentSubmission from './AssignmentSubmission';
import LibraryManagement from './LibraryManagement';
import LeaveManagement from './LeaveManagement';
import ExamPortal from './ExamPortal';
import CertificateViewer from './CertificateViewer';
import ComplaintSystem from './ComplaintSystem';
import PlacementPortal from './PlacementPortal';
import FeedbackForm from './FeedbackForm';
import AlumniPortal from './AlumniPortal';
import AdminDataManager from './AdminDataManager';

// Placeholder feature components (for unused features only)
const AssignmentsSyllabus = () => <div className="text-white p-8">Upload Assignments & Syllabus (Placeholder)</div>;
const CurriculumActivities = () => <div className="text-white p-8">Manage Curriculum Activities (Placeholder)</div>;
const Community = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-4">👥 Campus Community</h1>
      <p className="text-cyan-200 mb-8">Connect with fellow students and faculty members</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-white mb-2">Discussion Forum</h3>
          <p className="text-gray-300 text-sm">Share ideas and ask questions</p>
        </div>
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">👨‍💼</div>
          <h3 className="text-xl font-bold text-white mb-2">People Directory</h3>
          <p className="text-gray-300 text-sm">Find and connect with peers</p>
        </div>
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="text-xl font-bold text-white mb-2">Photo Gallery</h3>
          <p className="text-gray-300 text-sm">Share moments and memories</p>
        </div>
      </div>
    </div>
  </div>
);
// StudentAttendancePercentage, StudentMarksGrades, StudentTimetable, StudentProfile, StudentCoCurricular imported above
// AttendanceReports, MarksReports, AnalyticsDashboard imported above

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function Navbar({ onLoginClick, user, onLogout }) {
  return (
    <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-6 text-white gap-4 md:gap-0" aria-label="Main Navigation">
      <div className="text-2xl font-bold tracking-tight">Future-Proof Campus</div>
      <ul className="flex gap-4 md:gap-8 text-lg font-medium" role="menubar">
        <li role="none"><Link to="/features" className="hover:text-cyan-400 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded" tabIndex={0} role="menuitem">Features</Link></li>
        <li role="none"><Link to="/modules" className="hover:text-cyan-400 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded" tabIndex={0} role="menuitem">Modules</Link></li>
        <li role="none"><Link to="/community" className="hover:text-cyan-400 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded" tabIndex={0} role="menuitem">Community</Link></li>
        <li role="none"><Link to="/about" className="hover:text-cyan-400 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded" tabIndex={0} role="menuitem">About Us</Link></li>
      </ul>
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-cyan-200 text-sm">{user.displayName || user.email}</span>
          <Link to="/dashboard" className="text-cyan-300 hover:text-cyan-400 transition">Dashboard</Link>
          <button className="border border-red-400 rounded-full px-4 py-1.5 text-red-300 hover:bg-red-400 hover:text-[#0f172a] transition font-semibold focus:outline-none focus:ring-2 focus:ring-red-400" onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <button className="border border-cyan-400 rounded-full px-5 py-1.5 text-cyan-300 hover:bg-cyan-400 hover:text-[#0f172a] transition font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400" aria-label="Login" onClick={onLoginClick}>Login</button>
      )}
    </nav>
  );
}

function Hero() {
  const [modules, setModules] = useState([]);
  useEffect(() => {
    fetch('https://campus-management-system-production.up.railway.app/api/modules')
      .then(res => res.json())
      .then(data => setModules(data));
  }, []);
  return (
    <main className="flex-1 flex flex-col justify-center items-start px-4 sm:px-8 md:px-24 py-8 md:py-12 w-full">
      <div className="max-w-2xl mb-12 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Future-Proof<br />Your Campus
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 w-full">
          <button className="px-6 py-3 rounded-full border border-cyan-400 text-cyan-300 font-semibold text-lg hover:bg-cyan-400 hover:text-[#0f172a] transition focus:outline-none focus:ring-2 focus:ring-cyan-400" aria-label="Explore Modules">
            <Link to="/modules">Explore Modules</Link>
          </button>
          <button className="px-6 py-3 rounded-full border border-purple-400 text-purple-300 font-semibold text-lg hover:bg-purple-400 hover:text-[#0f172a] transition focus:outline-none focus:ring-2 focus:ring-purple-400" aria-label="Request Demo">Request Demo</button>
        </div>
      </div>
      {/* Glassmorphism Dashboard Section */}
      <div className="relative w-full flex flex-col items-center mt-8">
        <div className="absolute z-0 w-[90vw] max-w-[420px] h-[180px] sm:h-[220px] md:h-[260px] bg-gradient-to-br from-cyan-400/30 to-purple-400/20 rounded-3xl blur-2xl"></div>
        <div className="relative z-10 flex flex-col gap-4 items-center w-full">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl p-4 sm:p-8 w-[90vw] max-w-[340px] flex flex-col gap-2">
            <span className="text-lg font-semibold text-white mb-2">Future-Proof Campus</span>
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-400/60 border-2 border-white"></div>
              <span className="text-white/80 text-sm">Person 1</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-full bg-purple-400/60 border-2 border-white"></div>
              <span className="text-white/80 text-sm">Superadmin</span>
            </div>
            <div className="mt-4">
              <div className="h-12 sm:h-16 w-full bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-lg flex items-center justify-center">
                <span className="text-white/70 text-xs">[Analytics Graph Placeholder]</span>
              </div>
            </div>
          </div>
          {/* Dashboard quick modules */}
          <div className="flex gap-4 mt-4">
            {modules.map(mod => (
              <div key={mod.id} className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm flex flex-col items-center">
                <span className="font-semibold">{mod.name}</span>
                <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${mod.status === 'active' ? 'bg-cyan-600' : 'bg-gray-500'} text-white`}>{mod.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// ...existing code...

function Features() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('https://campus-management-system-production.up.railway.app/api/features')
      .then(res => res.json())
      .then(data => { setFeatures(data); setLoading(false); })
      .catch(() => { setError('Failed to load features.'); setLoading(false); });
  }, []);
  if (loading) return <div className="text-white p-12 text-xl">Loading features...</div>;
  if (error) return <div className="text-red-400 p-12 text-xl">{error}</div>;
  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-6">Features</h2>
      <ul className="space-y-4">
        {features.map(f => (
          <li key={f.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="font-semibold text-lg">{f.name}</div>
            <div className="text-white/80 text-sm">{f.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('https://campus-management-system-production.up.railway.app/api/pricing')
      .then(res => res.json())
      .then(data => { setPlans(data); setLoading(false); })
      .catch(() => { setError('Failed to load pricing.'); setLoading(false); });
  }, []);
  if (loading) return <div className="text-white p-12 text-xl">Loading pricing...</div>;
  if (error) return <div className="text-red-400 p-12 text-xl">{error}</div>;
  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-6">Pricing</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map(plan => (
          <div key={plan.plan} className="bg-white/10 rounded-lg p-6 border border-white/20">
            <div className="font-bold text-xl mb-2">{plan.plan}</div>
            <div className="text-cyan-300 text-lg mb-2">{plan.price}</div>
            <ul className="list-disc ml-6 text-white/80">
              {plan.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
function About() {
  return <div className="text-white p-12 text-3xl">About Us Page (Coming Soon)</div>;
}

// Mock authentication - stored in JSON
const mockUsers = {
  // Admin
  'admin': { password: 'admin123', role: 'admin', name: 'Administrator', regNo: 'admin' }
};

function LoginModal({ open, onClose }) {
  const [userType, setUserType] = useState('student');
  const [regOrAdmin, setRegOrAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const credentials = regOrAdmin.trim();
      const pass = password.trim();
      
      if (!credentials) {
        setError('Please enter your registration number.');
        setLoading(false);
        return;
      }

      if (userType === 'admin') {
        if (!pass) {
          setError('Please enter your password.');
          setLoading(false);
          return;
        }

        const user = mockUsers[credentials];
        if (!user) {
          setError('Admin ID not found.');
          setLoading(false);
          return;
        }

        if (user.password !== pass) {
          setError('Incorrect password.');
          setLoading(false);
          return;
        }

        const fakeUser = {
          uid: 'admin_' + credentials,
          email: credentials + '@campus.local',
          displayName: user.name,
          role: user.role,
          regNo: user.regNo
        };

        localStorage.setItem('campusUser', JSON.stringify(fakeUser));
        console.log('✓ Login successful:', fakeUser.displayName);
        onClose();
        window.location.reload();
        return;
      }

      let record = null;
      let role = 'student';

      if (!pass) {
        setError('Please enter your password.');
        setLoading(false);
        return;
      }

      // Try student login first
      let studentRes = await fetch('https://campus-management-system-production.up.railway.app/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo: credentials, password: pass })
      });
      
      if (studentRes.ok) {
        const data = await studentRes.json();
        record = data.student;
        role = 'student';
      } else if (studentRes.status === 401) {
        // Invalid credentials for student, try teacher
        let teacherRes = await fetch('https://campus-management-system-production.up.railway.app/api/teachers/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regNo: credentials, password: pass })
        });
        
        if (teacherRes.ok) {
          const data = await teacherRes.json();
          record = data.teacher;
          role = 'teacher';
        } else if (teacherRes.status === 401) {
          setError('Invalid registration number or password.');
          setLoading(false);
          return;
        } else {
          setError('Failed to reach teacher records. Please try again.');
          setLoading(false);
          return;
        }
      } else if (studentRes.status === 400 || studentRes.status === 500) {
        setError('Failed to reach student records. Please try again.');
        setLoading(false);
        return;
      }

      const fakeUser = {
        uid: role + '_' + (record.regNo || credentials),
        email: record.email || (record.regNo || credentials) + '@campus.local',
        displayName: record.name || credentials,
        role,
        regNo: record.regNo || credentials
      };
      
      localStorage.setItem('campusUser', JSON.stringify(fakeUser));
      console.log('✓ Login successful:', fakeUser.displayName);
      onClose();
      window.location.reload(); // Reload to update user state
      
    } catch (err) {
      console.error('Login error:', err.message);
      setError('Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex gap-4 justify-center mb-2">
            <label>
              <input type="radio" name="userType" value="student" checked={userType==='student'} onChange={()=>setUserType('student')} /> Student/Teacher
            </label>
            <label>
              <input type="radio" name="userType" value="admin" checked={userType==='admin'} onChange={()=>setUserType('admin')} /> Admin
            </label>
          </div>
          
          <input
            type="text"
            placeholder={userType==='admin' ? 'Admin ID (e.g., admin)' : 'Registration Number (e.g., 213cg001)'}
            value={regOrAdmin}
            onChange={e=>setRegOrAdmin(e.target.value)}
            className="border rounded px-3 py-2"
            required
            autoFocus
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          
          <button type="submit" className="bg-cyan-600 text-white rounded py-2 font-semibold hover:bg-cyan-700 transition" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          <div><strong>Login Credentials</strong></div>
          <div className="mt-2 bg-gray-100 p-3 rounded text-left text-xs space-y-1">
            <div><strong>Admin:</strong> admin / admin123</div>
            <div><strong>Students/Teachers:</strong> regNo / pass@123</div>
            <div className="text-gray-500 text-xs mt-1">Examples: 231cg001, 231cg005, 2305, 2509</div>
          </div>
        </div>
      </div>
    </div>
  );
}


function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');

  useEffect(() => {
    // Check localStorage for mock user session
    const storedUser = localStorage.getItem('campusUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setRole(userData.role || 'user');
        console.log('✓ User session restored:', userData.displayName);
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('campusUser');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('campusUser');
    setUser(null);
    setRole('user');
    console.log('✓ Logged out');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#312e81] flex flex-col">
        <Navbar onLoginClick={()=>setLoginOpen(true)} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <Dashboard role={role} user={user} />
            </ProtectedRoute>
          } />
          <Route path="/features" element={
            <ProtectedRoute user={user}>
              <Features />
            </ProtectedRoute>
          } />
          <Route path="/modules" element={
            <ProtectedRoute user={user}>
              <Modules role={role} />
            </ProtectedRoute>
          } />
          <Route path="/modules/:moduleId" element={
            <ProtectedRoute user={user}>
              <ModuleDetail role={role} />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute user={user}>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          
          {/* Admin routes */}
          <Route path="/admin/students" element={
            <ProtectedRoute user={user}>
              <StudentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/teachers" element={
            <ProtectedRoute user={user}>
              <TeacherManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/departments" element={
            <ProtectedRoute user={user}>
              <DepartmentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/subjects" element={
            <ProtectedRoute user={user}>
              <SubjectManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/department-subjects" element={
            <ProtectedRoute user={user}>
              <DepartmentSubjectLinking />
            </ProtectedRoute>
          } />
          <Route path="/admin/attendance-reports" element={
            <ProtectedRoute user={user}>
              <AttendanceReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/marks-reports" element={
            <ProtectedRoute user={user}>
              <MarksReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute user={user}>
              <AnalyticsDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/batch-operations" element={
            <ProtectedRoute user={user}>
              <BatchOperations />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute user={user}>
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/user-management" element={
            <ProtectedRoute user={user}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <ProtectedRoute user={user}>
              <EventManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/data-manager" element={
            <ProtectedRoute user={user}>
              <AdminDataManager user={user} />
            </ProtectedRoute>
          } />

          {/* Teacher routes */}
          <Route path="/teacher/classes" element={
            <ProtectedRoute user={user}>
              <ViewClasses />
            </ProtectedRoute>
          } />
          <Route path="/teacher/attendance" element={
            <ProtectedRoute user={user}>
              <MarkAttendance />
            </ProtectedRoute>
          } />
          <Route path="/teacher/marks" element={
            <ProtectedRoute user={user}>
              <EnterMarks />
            </ProtectedRoute>
          } />
          <Route path="/teacher/assignments" element={
            <ProtectedRoute user={user}>
              <UploadAssignments />
            </ProtectedRoute>
          } />
          <Route path="/teacher/activities" element={
            <ProtectedRoute user={user}>
              <CurriculumActivities />
            </ProtectedRoute>
          } />
          <Route path="/teacher/events" element={
            <ProtectedRoute user={user}>
              <EventManagement />
            </ProtectedRoute>
          } />

          {/* Student routes */}
          <Route path="/student/profile" element={
            <ProtectedRoute user={user}>
              <StudentProfile />
            </ProtectedRoute>
          } />
          <Route path="/student/attendance-percentage" element={
            <ProtectedRoute user={user}>
              <StudentAttendancePercentage />
            </ProtectedRoute>
          } />
          <Route path="/student/marks" element={
            <ProtectedRoute user={user}>
              <StudentMarksGrades />
            </ProtectedRoute>
          } />
          <Route path="/student/timetable" element={
            <ProtectedRoute user={user}>
              <StudentTimetable />
            </ProtectedRoute>
          } />
          <Route path="/student/co-curricular" element={
            <ProtectedRoute user={user}>
              <StudentCoCurricular />
            </ProtectedRoute>
          } />
          <Route path="/student/calendar" element={
            <ProtectedRoute user={user}>
              <AcademicCalendar />
            </ProtectedRoute>
          } />
          <Route path="/student/events" element={
            <ProtectedRoute user={user}>
              <UpcomingEvents />
            </ProtectedRoute>
          } />
          <Route path="/student/messages" element={
            <ProtectedRoute user={user}>
              <Messaging user={user} />
            </ProtectedRoute>
          } />
          <Route path="/student/forum" element={
            <ProtectedRoute user={user}>
              <Forum user={user} />
            </ProtectedRoute>
          } />
          <Route path="/student/assignment-submission" element={
            <ProtectedRoute user={user}>
              <AssignmentSubmission user={user} />
            </ProtectedRoute>
          } />
          <Route path="/student/library" element={
            <ProtectedRoute user={user}>
              <LibraryManagement user={user} />
            </ProtectedRoute>
          } />
          <Route path="/student/leaves" element={
            <ProtectedRoute user={user}>
              <LeaveManagement user={user} />
            </ProtectedRoute>
          } />
          <Route path="/student/exams" element={
            <ProtectedRoute user={user}>
              <ExamPortal user={user} />
            </ProtectedRoute>
          } />
          <Route path="/student/certificates" element={
            <ProtectedRoute user={user}>
              <CertificateViewer user={user} />
            </ProtectedRoute>
          } />
          <Route path="/student/complaints" element={
            <ProtectedRoute user={user}>
              <ComplaintSystem user={user} />
            </ProtectedRoute>
          } />
          <Route path="/student/placements" element={
            <ProtectedRoute user={user}>
              <PlacementPortal user={user} />
            </ProtectedRoute>
          } />
          <Route path="/student/feedback" element={
            <ProtectedRoute user={user}>
              <FeedbackForm user={user} />
            </ProtectedRoute>
          } />
          <Route path="/student/alumni" element={
            <ProtectedRoute user={user}>
              <AlumniPortal />
            </ProtectedRoute>
          } />

          {/* Other Features routes (Option 5) */}
          <Route path="/student/notifications" element={
            <ProtectedRoute user={user}>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/student/fees" element={
            <ProtectedRoute user={user}>
              <FeeManagement />
            </ProtectedRoute>
          } />
          <Route path="/student/transport-hostel" element={
            <ProtectedRoute user={user}>
              <TransportHostel />
            </ProtectedRoute>
          } />
        </Routes>
        <LoginModal open={loginOpen} onClose={()=>setLoginOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
