          <li><Link className="text-cyan-300 underline" to="/admin/department-subjects">Link Departments & Subjects</Link></li>
import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Students", value: "0", icon: "👥", color: "from-blue-500 to-cyan-500" },
    { label: "Total Teachers", value: "0", icon: "🎓", color: "from-purple-500 to-pink-500" },
    { label: "Active Departments", value: "0", icon: "🏢", color: "from-orange-500 to-red-500" },
    { label: "Total Subjects", value: "0", icon: "📚", color: "from-green-500 to-emerald-500" }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/stats/count');
        const data = await response.json();
        setStats([
          { label: "Total Students", value: String(data.students), icon: "👥", color: "from-blue-500 to-cyan-500" },
          { label: "Total Teachers", value: String(data.teachers), icon: "🎓", color: "from-purple-500 to-pink-500" },
          { label: "Active Departments", value: String(data.classes), icon: "🏢", color: "from-orange-500 to-red-500" },
          { label: "Total Subjects", value: String(data.subjects), icon: "📚", color: "from-green-500 to-emerald-500" }
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const modules = [
    { name: "Students", icon: "👥", path: "/admin/students", color: "bg-blue-500/20 border-blue-500" },
    { name: "Teachers", icon: "🎓", path: "/admin/teachers", color: "bg-purple-500/20 border-purple-500" },
    { name: "Departments", icon: "🏢", path: "/admin/departments", color: "bg-orange-500/20 border-orange-500" },
    { name: "Subjects", icon: "📚", path: "/admin/subjects", color: "bg-green-500/20 border-green-500" },
    { name: "Link Dept & Subjects", icon: "🔗", path: "/admin/department-subjects", color: "bg-indigo-500/20 border-indigo-500" },
    { name: "Attendance Reports", icon: "📊", path: "/admin/attendance-reports", color: "bg-red-500/20 border-red-500" },
    { name: "Marks Reports", icon: "📈", path: "/admin/marks-reports", color: "bg-cyan-500/20 border-cyan-500" },
    { name: "Analytics", icon: "📉", path: "/admin/analytics", color: "bg-pink-500/20 border-pink-500" },
    { name: "Events", icon: "📢", path: "/admin/events", color: "bg-lime-500/20 border-lime-500" },
    { name: "Data Manager", icon: "DM", path: "/admin/data-manager", color: "bg-slate-500/20 border-slate-500" },
    { name: "Batch Operations", icon: "📦", path: "/admin/batch-operations", color: "bg-yellow-500/20 border-yellow-500" },
    { name: "System Settings", icon: "⚙️", path: "/admin/settings", color: "bg-teal-500/20 border-teal-500" },
    { name: "User Management", icon: "👨‍💼", path: "/admin/user-management", color: "bg-rose-500/20 border-rose-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">👨‍💼 Admin Dashboard</h1>
          <p className="text-cyan-200">Manage your campus system efficiently</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${stat.color} p-6 rounded-lg text-white shadow-lg`}>
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Management Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Management Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, idx) => (
              <Link key={idx} to={mod.path} className={`${mod.color} border-2 rounded-lg p-6 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 cursor-pointer`}>
                <div className="text-3xl mb-3">{mod.icon}</div>
                <div className="font-semibold text-white text-lg">{mod.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">📋 Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/students" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Add New Student</Link>
            <Link to="/admin/teachers" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Add New Teacher</Link>
            <Link to="/admin/departments" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition">Create Department</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherDashboard({ user }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teacherId = user?.regNo || (user?.email && user.email.split('@')[0]) || (user?.uid && user.uid.replace(/^mock_/, ''));
    if (!teacherId) {
      console.warn('Teacher ID not found on user:', user);
      setClasses([]);
      setLoading(false);
      return;
    }

    fetch(`http://localhost:4000/api/classes/teacher/${teacherId}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setClasses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching classes:', err);
        setClasses([]);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white p-8 flex items-center justify-center">Loading classes...</div>;

  const tasks = [
    { task: "Submit Attendance Report", due: "Today", priority: "high", icon: "✅" },
    { task: "Grade Assignments", due: "Tomorrow", priority: "medium", icon: "📝" },
    { task: "Plan Curriculum", due: "This Week", priority: "medium", icon: "📅" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">🎓 Teacher Dashboard</h1>
          <p className="text-cyan-200">Welcome back! Here's your teaching overview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Classes Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">📚 My Classes</h2>
            <div className="space-y-4">
              {classes.map((cls, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 hover:shadow-lg hover:shadow-cyan-500/30 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl mb-2">{cls.icon}</div>
                      <h3 className="text-xl font-semibold text-white">{cls.name}</h3>
                      <p className="text-cyan-200">{cls.subject}</p>
                      <p className="text-sm text-gray-300 mt-2">👥 {cls.students?.length || 0} Students</p>
                    </div>
                    <Link to={`/teacher/classes`} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition text-sm">
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">⚡ Quick Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/teacher/attendance" className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-lg text-white hover:shadow-lg transition">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-semibold">Mark Attendance</div>
                </Link>
                <Link to="/teacher/marks" className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-lg text-white hover:shadow-lg transition">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="font-semibold">Enter Marks</div>
                </Link>
                <Link to="/teacher/assignments" className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-lg text-white hover:shadow-lg transition">
                  <div className="text-3xl mb-2">📎</div>
                  <div className="font-semibold">Upload Materials</div>
                </Link>
                <Link to="/teacher/activities" className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-lg text-white hover:shadow-lg transition">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="font-semibold">Manage Activities</div>
                </Link>
                <Link to="/teacher/events" className="bg-gradient-to-br from-lime-500 to-yellow-500 p-6 rounded-lg text-white hover:shadow-lg transition">
                  <div className="text-3xl mb-2">📢</div>
                  <div className="font-semibold">Post Events</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Tasks Sidebar */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">📋 Pending Tasks</h2>
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${task.priority === 'high' ? 'bg-red-500/10 border-red-500' : 'bg-yellow-500/10 border-yellow-500'}`}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{task.icon}</div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{task.task}</p>
                      <p className="text-gray-300 text-xs">{task.due}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">📈 Teaching Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Active Classes:</span>
                  <span className="text-cyan-300 font-semibold">3</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Total Students:</span>
                  <span className="text-cyan-300 font-semibold">95</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Assignments Set:</span>
                  <span className="text-cyan-300 font-semibold">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [timetableSubjects, setTimetableSubjects] = useState([]);
  const [attendance, setAttendance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const stored = localStorage.getItem('campusUser');
        const currentUser = stored ? JSON.parse(stored) : null;
        const regNo = currentUser?.regNo || currentUser?.email?.split('@')[0] || (currentUser?.uid ? currentUser.uid.replace(/^mock_/, '') : null);

        if (!regNo) {
          setLoading(false);
          return;
        }

        // Fetch enrolled classes (official courses)
        const classesRes = await fetch(`http://localhost:4000/api/classes/student/${regNo}`);
        const studentClasses = await classesRes.json();
        
        // Fetch timetable slots
        const timetableRes = await fetch(`http://localhost:4000/api/timetable/student/${regNo}`);
        const timetableSlots = await timetableRes.json();

        // Get unique subjects from timetable
        const uniqueSubjects = [...new Set(timetableSlots.map(slot => slot.subject))];
        setTimetableSubjects(uniqueSubjects);

        // Attendance should be computed from real records when available
        setAttendance(0);
        
        // Map to expected format 
        const formattedCourses = studentClasses.map((cls) => ({
          name: cls.name,
          code: cls.code || cls.subject,
          teacher: cls.teacherName || 'Unknown',
          progress: 0,
          icon: cls.icon || '📚'
        }));
        
        setCourses(formattedCourses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setCourses([]);
        setAttendance(0);
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const academicInfo = [
    { label: "Attendance %", value: attendance ? `${attendance}%` : 'N/A', icon: "✅", color: "text-green-400" },
    { label: "GPA", value: 'N/A', icon: "⭐", color: "text-yellow-400" },
    { label: "Subjects", value: timetableSubjects.length, icon: "📚", color: "text-blue-400" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading student dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">👨‍🎓 Student Dashboard</h1>
          <p className="text-cyan-200">Your academic journey at a glance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {academicInfo.map((info, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
              <div className={`text-4xl mb-2 ${info.color}`}>{info.icon}</div>
              <div className="text-2xl font-bold text-white">{info.value}</div>
              <div className="text-gray-300 text-sm">{info.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Timetable Subjects */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">📚 Timetable Subjects</h2>
            {timetableSubjects.length === 0 ? (
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4 opacity-50">📚</div>
                <p className="text-gray-300 text-lg">No subjects in timetable</p>
                <p className="text-gray-400 text-sm mt-2">Check your timetable schedule</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timetableSubjects.map((subject, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 hover:shadow-lg transition">
                    <div className="text-2xl mb-2">📖</div>
                    <h3 className="text-lg font-semibold text-white">{subject}</h3>
                    <Link to="/student/timetable" className="text-cyan-300 text-sm hover:underline mt-3 inline-block">View in Timetable →</Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Quick Links */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">⚡ Quick Access</h2>
              <button
                type="button"
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="px-3 py-1.5 bg-white/10 border border-white/20 text-white rounded hover:bg-white/20 transition text-sm"
              >
                {showQuickMenu ? 'Hide Menu' : 'Menu'}
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <Link to="/student/profile" className="block bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-lg text-white hover:shadow-lg transition">
                <div className="text-2xl mb-1">👤</div>
                <div className="font-semibold text-sm">My Profile</div>
              </Link>
              <Link to="/student/attendance-percentage" className="block bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-lg text-white hover:shadow-lg transition">
                <div className="text-2xl mb-1">📊</div>
                <div className="font-semibold text-sm">Attendance</div>
              </Link>
              <Link to="/student/marks" className="block bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-lg text-white hover:shadow-lg transition">
                <div className="text-2xl mb-1">📈</div>
                <div className="font-semibold text-sm">Marks & Grades</div>
              </Link>
              <Link to="/student/timetable" className="block bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-lg text-white hover:shadow-lg transition">
                <div className="text-2xl mb-1">📅</div>
                <div className="font-semibold text-sm">Timetable</div>
              </Link>
              <Link to="/student/co-curricular" className="block bg-gradient-to-br from-indigo-500 to-blue-500 p-4 rounded-lg text-white hover:shadow-lg transition">
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-semibold text-sm">Co-Curricular</div>
              </Link>
              <Link to="/student/notifications" className="block bg-gradient-to-br from-red-500 to-pink-500 p-4 rounded-lg text-white hover:shadow-lg transition">
                <div className="text-2xl mb-1">🔔</div>
                <div className="font-semibold text-sm">Notifications</div>
              </Link>
              <Link to="/student/calendar" className="block bg-gradient-to-br from-cyan-500 to-blue-500 p-4 rounded-lg text-white hover:shadow-lg transition">
                <div className="text-2xl mb-1">📅</div>
                <div className="font-semibold text-sm">Academic Calendar</div>
              </Link>
              <Link to="/student/events" className="block bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-lg text-white hover:shadow-lg transition">
                <div className="text-2xl mb-1">📢</div>
                <div className="font-semibold text-sm">Upcoming Events</div>
              </Link>
            </div>
            {showQuickMenu && (
              <div className="space-y-2 mb-8 bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-xs text-gray-300 uppercase tracking-wide mb-2">More Options</div>
                <Link to="/student/messages" className="block px-3 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                  Messages
                </Link>
                <Link to="/student/forum" className="block px-3 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                  Forum
                </Link>
                <Link to="/student/assignment-submission" className="block px-3 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                  Assignment Submission
                </Link>
                <Link to="/student/library" className="block px-3 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                  Library
                </Link>
                <Link to="/student/leaves" className="block px-3 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                  Leave Management
                </Link>
                <Link to="/student/exams" className="block px-3 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                  Exam Portal
                </Link>
                <Link to="/student/certificates" className="block px-3 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                  Certificates
                </Link>
                <Link to="/student/complaints" className="block px-3 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                  Complaints
                </Link>
                <Link to="/student/placements" className="block px-3 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                  Placements
                </Link>
                <Link to="/student/feedback" className="block px-3 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                  Feedback
                </Link>
              </div>
            )}

            {/* Upcoming Classes */}
            <h2 className="text-xl font-bold text-white mb-4">📅 Upcoming Classes</h2>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4">
              {timetableSubjects.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {timetableSubjects.slice(0, 4).map((subject, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                      <span className="text-cyan-200 font-semibold">{subject}</span>
                      <span className="text-gray-400">Today</span>
                    </div>
                  ))}
                  {timetableSubjects.length > 4 && (
                    <div className="text-gray-400 text-xs pt-2">+{timetableSubjects.length - 4} more subjects</div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2 opacity-50">📅</div>
                  <p className="text-gray-400 text-sm">No classes scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ role, user }) {
  if (role === "admin") {
    return <AdminDashboard />;
  }
  if (role === "teacher") {
    return <TeacherDashboard user={user} />;
  }
  // Default: student
  return <StudentDashboard user={user} />;
}

export default Dashboard;
