// API Configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://campus-management-system-production.up.railway.app';

export const API_ENDPOINTS = {
  // Students
  STUDENTS: `${API_BASE_URL}/api/students`,
  STUDENT_LOGIN: `${API_BASE_URL}/api/students/login`,
  STUDENT_LOOKUP: (regNo) => `${API_BASE_URL}/api/students/lookup/${encodeURIComponent(regNo)}`,
  
  // Teachers
  TEACHERS: `${API_BASE_URL}/api/teachers`,
  TEACHER_LOGIN: `${API_BASE_URL}/api/teachers/login`,
  
  // Attendance
  ATTENDANCE: `${API_BASE_URL}/api/attendance`,
  ATTENDANCE_STUDENT: (regNo) => `${API_BASE_URL}/api/attendance/${encodeURIComponent(regNo)}`,
  
  // Marks
  MARKS: `${API_BASE_URL}/api/marks`,
  MARKS_STUDENT: (regNo) => `${API_BASE_URL}/api/marks/student/${encodeURIComponent(regNo)}`,
  
  // Subjects
  SUBJECTS: `${API_BASE_URL}/api/subjects`,
  
  // Stats
  STATS: `${API_BASE_URL}/api/stats/count`,
  
  // Admin
  SEED: `${API_BASE_URL}/api/admin/seed`,
  
  // Classes
  CLASSES: `${API_BASE_URL}/api/classes`,
  CLASSES_TEACHER: (teacherId) => `${API_BASE_URL}/api/classes/teacher/${teacherId}`,
  CLASSES_STUDENT: (regNo) => `${API_BASE_URL}/api/classes/student/${regNo}`,
  
  // Timetable
  TIMETABLE_STUDENT: (regNo) => `${API_BASE_URL}/api/timetable/student/${regNo}`,
  
  // Other endpoints
  MODULES: `${API_BASE_URL}/api/modules`,
  DEPARTMENTS: `${API_BASE_URL}/api/departments`,
  ASSIGNMENTS: `${API_BASE_URL}/api/assignments`,
  EVENTS: `${API_BASE_URL}/api/events`,
  FORUM: `${API_BASE_URL}/api/forum/topics`,
  EXAMS: `${API_BASE_URL}/api/exams`,
  CERTIFICATES: (regNo) => `${API_BASE_URL}/api/certificates/${regNo}`,
  COMPLAINTS: `${API_BASE_URL}/api/complaints`,
  PLACEMENTS: `${API_BASE_URL}/api/placements`,
  LIBRARY_BOOKS: `${API_BASE_URL}/api/library/books`,
  LEAVES: `${API_BASE_URL}/api/leaves`,
  FEEDBACK: `${API_BASE_URL}/api/feedback`,
  MESSAGES: `${API_BASE_URL}/api/messages`,
  NOTIFICATIONS: (regNo) => `${API_BASE_URL}/api/notifications/student/${regNo}`
};

export default API_BASE_URL;
