const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
const db = new Database(path.join(__dirname, 'data.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId TEXT NOT NULL,
    receiverId TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    read INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS forum_topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    replies INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subject TEXT,
    dueDate TEXT,
    createdAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS assignment_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignmentId INTEGER NOT NULL,
    regNo TEXT NOT NULL,
    fileName TEXT NOT NULL,
    fileUrl TEXT,
    submittedAt TEXT NOT NULL,
    graded INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS library_books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT,
    isbn TEXT,
    available INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS library_issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regNo TEXT NOT NULL,
    bookId INTEGER NOT NULL,
    issuedAt TEXT NOT NULL,
    dueDate TEXT,
    returned INTEGER DEFAULT 0,
    returnedAt TEXT
  );
  CREATE TABLE IF NOT EXISTS leaves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    leaveType TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    reason TEXT,
    status TEXT NOT NULL,
    userRole TEXT,
    appliedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subject TEXT,
    date TEXT,
    time TEXT,
    duration INTEGER,
    syllabus TEXT
  );
  CREATE TABLE IF NOT EXISTS exam_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regNo TEXT NOT NULL,
    examId INTEGER NOT NULL,
    enrolledAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regNo TEXT NOT NULL,
    certificateType TEXT NOT NULL,
    course TEXT NOT NULL,
    issueDate TEXT NOT NULL,
    status TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL,
    userRole TEXT,
    filedAt TEXT NOT NULL,
    resolution TEXT
  );
  CREATE TABLE IF NOT EXISTS placements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT NOT NULL,
    role TEXT NOT NULL,
    salary TEXT,
    location TEXT,
    deadline TEXT,
    postedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS placement_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regNo TEXT NOT NULL,
    placementId INTEGER NOT NULL,
    appliedAt TEXT NOT NULL,
    status TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    targetId TEXT NOT NULL,
    targetType TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comments TEXT,
    createdAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT,
    location TEXT NOT NULL,
    type TEXT,
    postedBy TEXT,
    postedByName TEXT,
    createdAt TEXT NOT NULL,
    image TEXT
  );
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    regNo TEXT NOT NULL,
    department TEXT NOT NULL,
    year INTEGER,
    phone TEXT,
    email TEXT,
    password TEXT DEFAULT 'pass@123'
  );
  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    regNo TEXT NOT NULL,
    department TEXT NOT NULL,
    specialization TEXT,
    dateOfJoining TEXT,
    phone TEXT,
    email TEXT,
    password TEXT DEFAULT 'pass@123'
  );
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    department TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    teacher TEXT NOT NULL,
    students TEXT,
    icon TEXT
  );  CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    subject TEXT NOT NULL,
    room TEXT,
    teacher TEXT,
    students TEXT
  );
  CREATE TABLE IF NOT EXISTS semesters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    year INTEGER,
    status TEXT DEFAULT 'upcoming',
    startDate TEXT,
    endDate TEXT
  );
  CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    semester TEXT,
    subject TEXT,
    date TEXT,
    time TEXT,
    duration INTEGER
  );
  CREATE TABLE IF NOT EXISTS holidays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT,
    startDate TEXT,
    endDate TEXT
  );
  CREATE TABLE IF NOT EXISTS important_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT,
    type TEXT
  );
  CREATE TABLE IF NOT EXISTS marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentRegNo TEXT NOT NULL,
    subjectName TEXT NOT NULL,
    internalMarks REAL,
    semesterMarks REAL,
    totalMarks REAL,
    grade TEXT,
    recordedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentRegNo TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    subject TEXT,
    recordedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

// Authentication middleware
const requireAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const requireTeacherOrAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (role !== 'admin' && role !== 'teacher') {
    return res.status(403).json({ error: 'Teacher or Admin access required' });
  }
  next();
};

const safeParseList = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// ============ CLASSES ============
app.get('/api/classes', (req, res) => {
  const rows = db.prepare('SELECT * FROM classes ORDER BY id DESC').all();
  const hydrated = rows.map(row => ({
    ...row,
    students: row.students ? safeParseList(row.students) : []
  }));
  res.json(hydrated);
});
app.get('/api/classes/teacher/:teacherId', (req, res) => {
  const rows = db.prepare('SELECT * FROM classes WHERE teacher = ? ORDER BY id DESC').all(req.params.teacherId);
  const hydrated = rows.map(row => ({
    ...row,
    students: row.students ? safeParseList(row.students) : []
  }));
  res.json(hydrated);
});
app.get('/api/classes/student/:studentId', (req, res) => {
  const rows = db.prepare('SELECT * FROM classes ORDER BY id DESC').all();
  const teachersIndex = new Map(
    db.prepare('SELECT regNo, name FROM teachers').all().map(t => [t.regNo, t.name])
  );
  const filtered = rows
    .map(row => ({
      ...row,
      students: row.students ? safeParseList(row.students) : []
    }))
    .filter(row => row.students.includes(req.params.studentId))
    .map(row => ({
      ...row,
      teacherName: teachersIndex.get(row.teacher) || 'Unknown',
      code: row.subject
    }));
  res.json(filtered);
});
app.post('/api/classes', requireAdmin, (req, res) => {
  const { name, subject, teacher, students, icon } = req.body;
  if (!name || !subject || !teacher) return res.status(400).json({ error: 'Name, Subject, and Teacher required' });
  const studentsList = Array.isArray(students) ? JSON.stringify(students) : JSON.stringify([]);
  const info = db.prepare(
    'INSERT INTO classes (name, subject, teacher, students, icon) VALUES (?, ?, ?, ?, ?)'
  ).run(name, subject, teacher, studentsList, icon || null);
  const cls = db.prepare('SELECT * FROM classes WHERE id = ?').get(info.lastInsertRowid);
  const hydrated = { ...cls, students: cls.students ? safeParseList(cls.students) : [] };
  res.status(201).json(hydrated);
});
app.put('/api/classes/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM classes WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Class not found' });
  const next = {
    name: req.body.name ?? existing.name,
    subject: req.body.subject ?? existing.subject,
    teacher: req.body.teacher ?? existing.teacher,
    students: Array.isArray(req.body.students) ? JSON.stringify(req.body.students) : existing.students,
    icon: req.body.icon ?? existing.icon
  };
  db.prepare('UPDATE classes SET name = ?, subject = ?, teacher = ?, students = ?, icon = ? WHERE id = ?')
    .run(next.name, next.subject, next.teacher, next.students, next.icon, id);
  const cls = db.prepare('SELECT * FROM classes WHERE id = ?').get(id);
  const hydrated = { ...cls, students: cls.students ? safeParseList(cls.students) : [] };
  res.json(hydrated);
});
app.delete('/api/classes/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM classes WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Class not found' });
  db.prepare('DELETE FROM classes WHERE id = ?').run(id);
  const hydrated = { ...existing, students: existing.students ? safeParseList(existing.students) : [] };
  res.json(hydrated);
});

// ============ STUDENTS ============
app.get('/api/students', (req, res) => {
  const rows = db.prepare('SELECT * FROM students ORDER BY id DESC').all();
  res.json(rows);
});
app.get('/api/students/lookup/:regNo', (req, res) => {
  const { regNo } = req.params;
  const student = db.prepare('SELECT * FROM students WHERE regNo = ? OR id = ?').get(regNo, regNo);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});
app.post('/api/students/login', (req, res) => {
  const { regNo, password } = req.body;
  if (!regNo || !password) return res.status(400).json({ error: 'Registration number and password required' });
  const student = db.prepare('SELECT * FROM students WHERE regNo = ? OR id = ?').get(regNo, regNo);
  if (!student) return res.status(401).json({ error: 'Invalid credentials' });
  if (student.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, student });
});
app.post('/api/students', requireAdmin, (req, res) => {
  const { name, regNo, department, year, phone, email, password } = req.body;
  if (!name || !regNo || !department) return res.status(400).json({ error: 'All fields required' });
  const info = db.prepare(
    'INSERT INTO students (name, regNo, department, year, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(name, regNo, department, year || null, phone || null, email || null, password || 'pass@123');
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(student);
});
app.put('/api/students/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Student not found' });
  const next = {
    name: req.body.name ?? existing.name,
    regNo: req.body.regNo ?? existing.regNo,
    department: req.body.department ?? existing.department,
    year: req.body.year ?? existing.year,
    phone: req.body.phone ?? existing.phone,
    email: req.body.email ?? existing.email
  };
  db.prepare('UPDATE students SET name = ?, regNo = ?, department = ?, year = ?, phone = ?, email = ? WHERE id = ?')
    .run(next.name, next.regNo, next.department, next.year, next.phone, next.email, id);
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  res.json(student);
});
app.delete('/api/students/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Student not found' });
  db.prepare('DELETE FROM students WHERE id = ?').run(id);
  res.json(existing);
});

// ============ TEACHERS ============
app.get('/api/teachers', (req, res) => {
  const rows = db.prepare('SELECT * FROM teachers ORDER BY id DESC').all();
  res.json(rows);
});
app.get('/api/teachers/lookup/:regNo', (req, res) => {
  const { regNo } = req.params;
  const teacher = db.prepare('SELECT * FROM teachers WHERE regNo = ? OR id = ?').get(regNo, regNo);
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
  res.json(teacher);
});
app.post('/api/teachers/login', (req, res) => {
  const { regNo, password } = req.body;
  if (!regNo || !password) return res.status(400).json({ error: 'Registration number and password required' });
  const teacher = db.prepare('SELECT * FROM teachers WHERE regNo = ? OR id = ?').get(regNo, regNo);
  if (!teacher) return res.status(401).json({ error: 'Invalid credentials' });
  if (teacher.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, teacher });
});
app.post('/api/teachers', requireAdmin, (req, res) => {
  const { name, regNo, department, specialization, dateOfJoining, phone, email, password } = req.body;
  if (!name || !regNo || !department) return res.status(400).json({ error: 'All fields required' });
  const info = db.prepare(
    'INSERT INTO teachers (name, regNo, department, specialization, dateOfJoining, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(name, regNo, department, specialization || null, dateOfJoining || null, phone || null, email || null, password || 'pass@123');
  const teacher = db.prepare('SELECT * FROM teachers WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(teacher);
});
app.put('/api/teachers/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM teachers WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Teacher not found' });
  const next = {
    name: req.body.name ?? existing.name,
    regNo: req.body.regNo ?? existing.regNo,
    department: req.body.department ?? existing.department,
    specialization: req.body.specialization ?? existing.specialization,
    dateOfJoining: req.body.dateOfJoining ?? existing.dateOfJoining,
    phone: req.body.phone ?? existing.phone,
    email: req.body.email ?? existing.email
  };
  db.prepare('UPDATE teachers SET name = ?, regNo = ?, department = ?, specialization = ?, dateOfJoining = ?, phone = ?, email = ? WHERE id = ?')
    .run(next.name, next.regNo, next.department, next.specialization, next.dateOfJoining, next.phone, next.email, id);
  const teacher = db.prepare('SELECT * FROM teachers WHERE id = ?').get(id);
  res.json(teacher);
});
app.delete('/api/teachers/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM teachers WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Teacher not found' });
  db.prepare('DELETE FROM teachers WHERE id = ?').run(id);
  res.json(existing);
});

// ============ DEPARTMENTS ============
let departments = [];

app.get('/api/departments', (req, res) => res.json(departments));
app.post('/api/departments', requireAdmin, (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) return res.status(400).json({ error: 'All fields required' });
  const dept = { id: 'dept' + (departments.length + 1), name, code };
  departments.push(dept);
  res.status(201).json(dept);
});
app.put('/api/departments/:id', requireAdmin, (req, res) => {
  const idx = departments.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Department not found' });
  departments[idx] = { ...departments[idx], ...req.body };
  res.json(departments[idx]);
});
app.delete('/api/departments/:id', requireAdmin, (req, res) => {
  const idx = departments.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Department not found' });
  const removed = departments.splice(idx, 1);
  res.json(removed[0]);
});

// ============ SUBJECTS ============
app.get('/api/subjects', (req, res) => {
  const rows = db.prepare('SELECT * FROM subjects ORDER BY id DESC').all();
  res.json(rows);
});
app.post('/api/subjects', requireAdmin, (req, res) => {
  const { name, code, department } = req.body;
  if (!name || !code || !department) return res.status(400).json({ error: 'All fields required' });
  const info = db.prepare(
    'INSERT INTO subjects (name, code, department) VALUES (?, ?, ?)'
  ).run(name, code, department);
  const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(subject);
});
app.put('/api/subjects/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM subjects WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Subject not found' });
  const next = {
    name: req.body.name ?? existing.name,
    code: req.body.code ?? existing.code,
    department: req.body.department ?? existing.department
  };
  db.prepare('UPDATE subjects SET name = ?, code = ?, department = ? WHERE id = ?')
    .run(next.name, next.code, next.department, id);
  const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(id);
  res.json(subject);
});
app.delete('/api/subjects/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM subjects WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Subject not found' });
  db.prepare('DELETE FROM subjects WHERE id = ?').run(id);
  res.json(existing);
});

// ============ DEPARTMENT-SUBJECT LINKING ============
let departmentSubjects = [];

app.get('/api/department-subjects', (req, res) => res.json(departmentSubjects));
app.put('/api/department-subjects/:department', requireAdmin, (req, res) => {
  const { department } = req.params;
  const { subjects: subs } = req.body;
  if (!Array.isArray(subs)) return res.status(400).json({ error: 'Subjects must be an array' });
  let link = departmentSubjects.find(ds => ds.department === department);
  if (!link) {
    link = { department, subjects: subs };
    departmentSubjects.push(link);
  } else {
    link.subjects = subs;
  }
  res.json(link);
});

// ============ MODULES ============
let modules = [];

app.get('/api/modules', (req, res) => res.json(modules));
app.post('/api/modules', requireAdmin, (req, res) => {
  const { name, status } = req.body;
  if (!name) return res.status(400).json({ error: 'Module name required' });
  const module = { id: 'mod' + (modules.length + 1), name, status: status || 'active' };
  modules.push(module);
  res.status(201).json(module);
});
app.put('/api/modules/:id', requireAdmin, (req, res) => {
  const idx = modules.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Module not found' });
  modules[idx] = { ...modules[idx], ...req.body };
  res.json(modules[idx]);
});
app.delete('/api/modules/:id', requireAdmin, (req, res) => {
  const idx = modules.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Module not found' });
  const removed = modules.splice(idx, 1);
  res.json(removed[0]);
});

// ============ ATTENDANCE ============
app.get('/api/attendance', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM attendance ORDER BY date DESC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance', requireTeacherOrAdmin, (req, res) => {
  const { studentRegNo, date, status, subject } = req.body;
  if (!studentRegNo || !date || !status) return res.status(400).json({ error: 'All fields required' });
  try {
    const info = db.prepare(
      'INSERT INTO attendance (studentRegNo, date, status, subject) VALUES (?, ?, ?, ?)'
    ).run(studentRegNo, date, status, subject || null);
    const record = db.prepare('SELECT * FROM attendance WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance/:studentRegNo', (req, res) => {
  try {
    const records = db.prepare('SELECT * FROM attendance WHERE studentRegNo = ? ORDER BY date DESC').all(req.params.studentRegNo);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ MARKS ============
app.get('/api/marks', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM marks ORDER BY recordedAt DESC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/marks', requireTeacherOrAdmin, (req, res) => {
  const { studentRegNo, subjectName, internalMarks, semesterMarks, grade } = req.body;
  if (!studentRegNo || !subjectName) return res.status(400).json({ error: 'Student regNo and subject name required' });
  try {
    const total = (internalMarks || 0) + (semesterMarks || 0);
    const info = db.prepare(
      'INSERT INTO marks (studentRegNo, subjectName, internalMarks, semesterMarks, totalMarks, grade) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(studentRegNo, subjectName, internalMarks || null, semesterMarks || null, total, grade || null);
    const record = db.prepare('SELECT * FROM marks WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/marks/student/:studentRegNo', (req, res) => {
  try {
    const marks = db.prepare('SELECT * FROM marks WHERE studentRegNo = ? ORDER BY recordedAt DESC').all(req.params.studentRegNo);
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ASSIGNMENTS ============
app.get('/api/assignments', (req, res) => {
  const items = db.prepare('SELECT * FROM assignments ORDER BY id DESC').all();
  res.json(items);
});
app.post('/api/assignments', requireAdmin, (req, res) => {
  const { title, description, subjectId, dueDate } = req.body;
  if (!title || !subjectId) return res.status(400).json({ error: 'Title and Subject ID required' });
  const createdAt = new Date().toISOString();
  const info = db.prepare(
    'INSERT INTO assignments (title, subject, dueDate, createdAt) VALUES (?, ?, ?, ?)'
  ).run(title, subjectId, dueDate || null, createdAt);
  const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(assignment);
});
app.put('/api/assignments/:id', requireAdmin, (req, res) => {
  const assignmentId = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM assignments WHERE id = ?').get(assignmentId);
  if (!existing) return res.status(404).json({ error: 'Assignment not found' });
  const next = {
    title: req.body.title ?? existing.title,
    subject: req.body.subjectId ?? existing.subject,
    dueDate: req.body.dueDate ?? existing.dueDate
  };
  db.prepare('UPDATE assignments SET title = ?, subject = ?, dueDate = ? WHERE id = ?')
    .run(next.title, next.subject, next.dueDate, assignmentId);
  const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(assignmentId);
  res.json(assignment);
});
app.delete('/api/assignments/:id', requireAdmin, (req, res) => {
  const assignmentId = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM assignments WHERE id = ?').get(assignmentId);
  if (!existing) return res.status(404).json({ error: 'Assignment not found' });
  db.prepare('DELETE FROM assignments WHERE id = ?').run(assignmentId);
  res.json(existing);
});

// ============ TIMETABLE ============
app.get('/api/timetable/student/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const slots = db.prepare('SELECT * FROM timetable ORDER BY day, startTime').all();
  const studentSlots = slots.filter(slot => {
    const students = slot.students ? (slot.students.startsWith('[') ? JSON.parse(slot.students) : slot.students.split(',')) : [];
    return students.includes(studentId);
  });
  res.json(studentSlots);
});

app.get('/api/timetable', (req, res) => {
  const slots = db.prepare('SELECT * FROM timetable ORDER BY day, startTime').all();
  res.json(slots);
});

app.post('/api/timetable', requireAdmin, (req, res) => {
  const { day, startTime, endTime, subject, room, teacher, students } = req.body;
  if (!day || !startTime || !endTime || !subject) return res.status(400).json({ error: 'Day, startTime, endTime, and subject required' });
  const studentsList = Array.isArray(students) ? JSON.stringify(students) : JSON.stringify([]);
  const info = db.prepare(
    'INSERT INTO timetable (day, startTime, endTime, subject, room, teacher, students) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(day, startTime, endTime, subject, room || null, teacher || null, studentsList);
  const slot = db.prepare('SELECT * FROM timetable WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(slot);
});

app.delete('/api/timetable/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM timetable WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Timetable entry not found' });
  db.prepare('DELETE FROM timetable WHERE id = ?').run(id);
  res.json(existing);
});

// ============ CO-CURRICULAR ACTIVITIES ============
// Categories: NSS, NCC, Art, Sports, Dance
let cocurricularActivities = [];

app.get('/api/activities/student/:studentId', (req, res) => {
  const activities = cocurricularActivities.filter(a => a.studentId === req.params.studentId);
  res.json(activities);
});

// ============ NOTIFICATIONS ============
let notifications = [];

// Notification read tracking (separate table)
let notificationTracking = [];

app.get('/api/notifications/student/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  
  // Get general notifications (for all) + personal notifications (for this student)
  const relevantNotifications = notifications.filter(n => 
    n.recipientType === 'all' || (n.recipientType === 'student' && n.recipientId === studentId)
  );
  
  // Add read status from tracking table
  const enrichedNotifications = relevantNotifications.map(notif => {
    const tracking = notificationTracking.find(t => 
      t.studentId === studentId && t.notificationId === notif.id
    );
    return {
      ...notif,
      read: tracking ? tracking.read : false
    };
  });
  
  res.json(enrichedNotifications);
});

app.post('/api/notifications/:notificationId/mark-read', (req, res) => {
  const { notificationId } = req.params;
  const { studentId } = req.body;
  
  const existingIdx = notificationTracking.findIndex(t => 
    t.studentId === studentId && t.notificationId === notificationId
  );
  
  if (existingIdx !== -1) {
    notificationTracking[existingIdx].read = true;
  } else {
    notificationTracking.push({ studentId, notificationId, read: true });
  }
  
  res.json({ success: true });
});

app.post('/api/notifications/:notificationId/mark-unread', (req, res) => {
  const { notificationId } = req.params;
  const { studentId } = req.body;
  
  const existingIdx = notificationTracking.findIndex(t => 
    t.studentId === studentId && t.notificationId === notificationId
  );
  
  if (existingIdx !== -1) {
    notificationTracking[existingIdx].read = false;
  } else {
    notificationTracking.push({ studentId, notificationId, read: false });
  }
  
  res.json({ success: true });
});

// ============ ACADEMIC CALENDAR ============
app.get('/api/calendar', (req, res) => {
  const semesters = db.prepare('SELECT id, name, year, status, startDate, endDate FROM semesters ORDER BY year DESC, id DESC').all();
  const exams = db.prepare('SELECT id, name, semester, subject, date, time, duration FROM exams ORDER BY date').all();
  const holidays = db.prepare('SELECT id, title, type, startDate, endDate FROM holidays ORDER BY startDate').all();
  const importantDates = db.prepare('SELECT id, title, date, type FROM important_dates ORDER BY date').all();
  
  res.json({
    year: new Date().getFullYear(),
    semesters,
    exams,
    holidays,
    importantDates
  });
});

app.get('/api/calendar/semesters', (req, res) => {
  const semesters = db.prepare('SELECT * FROM semesters ORDER BY year DESC, id DESC').all();
  res.json(semesters);
});

app.get('/api/calendar/current-semester', (req, res) => {
  const currentSem = db.prepare('SELECT * FROM semesters WHERE status = ? ORDER BY year DESC LIMIT 1').get('ongoing');
  if (currentSem) {
    res.json(currentSem);
  } else {
    const firstSem = db.prepare('SELECT * FROM semesters ORDER BY year DESC, id DESC LIMIT 1').get();
    res.json(firstSem || {});
  }
});

app.get('/api/calendar/exams', (req, res) => {
  const exams = db.prepare('SELECT * FROM exams ORDER BY date').all();
  res.json(exams);
});

app.get('/api/calendar/exams/:semesterId', (req, res) => {
  const exams = db.prepare('SELECT * FROM exams WHERE semester = ? ORDER BY date').all(req.params.semesterId);
  res.json(exams);
});

app.get('/api/calendar/holidays', (req, res) => {
  const holidays = db.prepare('SELECT * FROM holidays ORDER BY startDate').all();
  res.json(holidays);
});

app.get('/api/calendar/important-dates', (req, res) => {
  const importantDates = db.prepare('SELECT * FROM important_dates ORDER BY date').all();
  res.json(importantDates);
});

app.post('/api/calendar/semesters', requireAdmin, (req, res) => {
  const { name, year, status, startDate, endDate } = req.body;
  if (!name) return res.status(400).json({ error: 'Semester name required' });
  const info = db.prepare(
    'INSERT INTO semesters (name, year, status, startDate, endDate) VALUES (?, ?, ?, ?, ?)'
  ).run(name, year || new Date().getFullYear(), status || 'upcoming', startDate || null, endDate || null);
  const sem = db.prepare('SELECT * FROM semesters WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(sem);
});

app.post('/api/calendar/holidays', requireAdmin, (req, res) => {
  const { title, type, startDate, endDate } = req.body;
  if (!title || !startDate) return res.status(400).json({ error: 'Title and startDate required' });
  const info = db.prepare(
    'INSERT INTO holidays (title, type, startDate, endDate) VALUES (?, ?, ?, ?)'
  ).run(title, type || null, startDate, endDate || null);
  const holiday = db.prepare('SELECT * FROM holidays WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(holiday);
});

app.post('/api/calendar/important-dates', requireAdmin, (req, res) => {
  const { title, date, type } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'Title and date required' });
  const info = db.prepare(
    'INSERT INTO important_dates (title, date, type) VALUES (?, ?, ?)'
  ).run(title, date, type || null);
  const impDate = db.prepare('SELECT * FROM important_dates WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(impDate);
});

// ============ UPCOMING EVENTS ============
// Get all events (for students - read-only)
app.get('/api/events', (req, res) => {
  const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all();
  res.json(events);
});

// Get single event details
app.get('/api/events/:eventId', (req, res) => {
  const eventId = Number(req.params.eventId);
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

// Create event (admin/teacher only)
app.post('/api/events', (req, res) => {
  const { title, description, date, time, location, type, image, userRole, userId, userName } = req.body;
  
  if (!['admin', 'teacher'].includes(userRole)) {
    return res.status(403).json({ error: 'Only admin and teachers can post events' });
  }
  
  if (!title || !date || !location) {
    return res.status(400).json({ error: 'Title, date, and location are required' });
  }
  
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO events (title, description, date, time, location, type, postedBy, postedByName, createdAt, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    title,
    description || '',
    date,
    time || '09:00',
    location,
    type || 'event',
    userId || 'admin',
    userName || userRole,
    createdAt,
    image || ''
  );
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(event);
});

// Update event (admin/teacher only)
app.put('/api/events/:eventId', (req, res) => {
  const { userRole } = req.body;
  
  if (!['admin', 'teacher'].includes(userRole)) {
    return res.status(403).json({ error: 'Only admin and teachers can update events' });
  }
  
  const eventId = Number(req.params.eventId);
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
  if (!existing) return res.status(404).json({ error: 'Event not found' });

  const updates = { ...req.body };
  delete updates.userRole;
  delete updates.userId;
  delete updates.userName;
  delete updates.userEmail;

  const next = {
    title: updates.title ?? existing.title,
    description: updates.description ?? existing.description,
    date: updates.date ?? existing.date,
    time: updates.time ?? existing.time,
    location: updates.location ?? existing.location,
    type: updates.type ?? existing.type,
    postedBy: updates.postedBy ?? existing.postedBy,
    postedByName: updates.postedByName ?? existing.postedByName,
    image: updates.image ?? existing.image
  };

  db.prepare(`
    UPDATE events
    SET title = ?, description = ?, date = ?, time = ?, location = ?, type = ?, postedBy = ?, postedByName = ?, image = ?
    WHERE id = ?
  `).run(
    next.title,
    next.description,
    next.date,
    next.time,
    next.location,
    next.type,
    next.postedBy,
    next.postedByName,
    next.image,
    eventId
  );

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
  res.json(event);
});

// Delete event (admin only)
app.delete('/api/events/:eventId', (req, res) => {
  const userRole = req.body.userRole || req.headers['x-user-role'];
  
  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Only admin can delete events' });
  }
  
  const eventId = Number(req.params.eventId);
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
  if (!existing) return res.status(404).json({ error: 'Event not found' });
  db.prepare('DELETE FROM events WHERE id = ?').run(eventId);
  res.json(existing);
});

// ============ FEATURES & PRICING ============
app.get('/api/features', (req, res) => res.json([]));

// ============ CHAT/MESSAGING ============
app.get('/api/messages/:userId', (req, res) => {
  const { userId } = req.params;
  const userMessages = db.prepare(
    'SELECT * FROM messages WHERE senderId = ? OR receiverId = ? ORDER BY id ASC'
  ).all(userId, userId);
  res.json(userMessages);
});

app.post('/api/messages', (req, res) => {
  const { senderId, receiverId, message, timestamp } = req.body;
  if (!senderId || !receiverId || !message) return res.status(400).json({ error: 'Required fields missing' });
  const createdAt = timestamp || new Date().toISOString();
  const info = db.prepare(
    'INSERT INTO messages (senderId, receiverId, message, timestamp, read) VALUES (?, ?, ?, ?, ?)'
  ).run(senderId, receiverId, message, createdAt, 0);
  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(msg);
});

// ============ DISCUSSION FORUM ============
app.get('/api/forum/topics', (req, res) => {
  const topics = db.prepare('SELECT * FROM forum_topics ORDER BY id DESC').all();
  res.json(topics);
});

app.post('/api/forum/topics', (req, res) => {
  const { title, author, content } = req.body;
  if (!title || !author || !content) return res.status(400).json({ error: 'All fields required' });
  const createdAt = new Date().toISOString().split('T')[0];
  const info = db.prepare(
    'INSERT INTO forum_topics (title, author, content, replies, views, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, author, content, 0, 0, createdAt);
  const topic = db.prepare('SELECT * FROM forum_topics WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(topic);
});

// ============ ASSIGNMENT SUBMISSION ============

app.post('/api/assignments/:assignmentId/submit', (req, res) => {
  const { assignmentId } = req.params;
  const { regNo, fileName, fileUrl, submittedAt } = req.body;
  if (!regNo || !fileName) return res.status(400).json({ error: 'regNo and fileName required' });
  const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(Number(assignmentId));
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  const createdAt = submittedAt || new Date().toISOString();
  const info = db.prepare(
    'INSERT INTO assignment_submissions (assignmentId, regNo, fileName, fileUrl, submittedAt, graded) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(Number(assignmentId), regNo, fileName, fileUrl || null, createdAt, 0);
  const submission = db.prepare('SELECT * FROM assignment_submissions WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(submission);
});

// ============ LIBRARY MANAGEMENT ============
app.get('/api/library/books', (req, res) => {
  const books = db.prepare('SELECT * FROM library_books ORDER BY id DESC').all();
  res.json(books);
});

app.post('/api/library/issue', (req, res) => {
  const { regNo, bookId, dueDate } = req.body;
  if (!regNo || !bookId) return res.status(400).json({ error: 'regNo and bookId required' });
  const book = db.prepare('SELECT * FROM library_books WHERE id = ?').get(Number(bookId));
  if (!book || book.available <= 0) return res.status(400).json({ error: 'Book not available' });
  db.prepare('UPDATE library_books SET available = ? WHERE id = ?').run(book.available - 1, Number(bookId));
  const issuedAt = new Date().toISOString().split('T')[0];
  const info = db.prepare(
    'INSERT INTO library_issues (regNo, bookId, issuedAt, dueDate, returned) VALUES (?, ?, ?, ?, ?)'
  ).run(regNo, Number(bookId), issuedAt, dueDate || null, 0);
  const issue = db.prepare('SELECT * FROM library_issues WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(issue);
});

app.post('/api/library/return', (req, res) => {
  const { issueId } = req.body;
  const issue = db.prepare('SELECT * FROM library_issues WHERE id = ?').get(Number(issueId));
  if (!issue) return res.status(404).json({ error: 'Issue not found' });
  if (issue.returned) return res.json(issue);
  const book = db.prepare('SELECT * FROM library_books WHERE id = ?').get(issue.bookId);
  db.prepare('UPDATE library_books SET available = ? WHERE id = ?').run((book?.available || 0) + 1, issue.bookId);
  const returnedAt = new Date().toISOString().split('T')[0];
  db.prepare('UPDATE library_issues SET returned = 1, returnedAt = ? WHERE id = ?').run(returnedAt, Number(issueId));
  const updated = db.prepare('SELECT * FROM library_issues WHERE id = ?').get(Number(issueId));
  res.json(updated);
});

app.get('/api/library/issued-books/:regNo', (req, res) => {
  const { regNo } = req.params;
  const issued = db.prepare('SELECT * FROM library_issues WHERE regNo = ? AND returned = 0 ORDER BY id DESC').all(regNo);
  res.json(issued);
});

// ============ LEAVE MANAGEMENT ============
app.get('/api/leaves', (req, res) => {
  const items = db.prepare('SELECT * FROM leaves ORDER BY id DESC').all();
  res.json(items);
});

app.post('/api/leaves', (req, res) => {
  const { userId, leaveType, startDate, endDate, reason, userRole } = req.body;
  if (!userId || !leaveType || !startDate || !endDate) return res.status(400).json({ error: 'All fields required' });
  const appliedAt = new Date().toISOString().split('T')[0];
  const info = db.prepare(
    'INSERT INTO leaves (userId, leaveType, startDate, endDate, reason, status, userRole, appliedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(userId, leaveType, startDate, endDate, reason || '', 'pending', userRole || '', appliedAt);
  const leave = db.prepare('SELECT * FROM leaves WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(leave);
});

app.put('/api/leaves/:leaveId', (req, res) => {
  const { leaveId } = req.params;
  const { status } = req.body;
  const id = Number(leaveId);
  const leave = db.prepare('SELECT * FROM leaves WHERE id = ?').get(id);
  if (!leave) return res.status(404).json({ error: 'Leave not found' });
  db.prepare('UPDATE leaves SET status = ? WHERE id = ?').run(status, id);
  const updated = db.prepare('SELECT * FROM leaves WHERE id = ?').get(id);
  res.json(updated);
});

// ============ EXAM PORTAL ============
app.get('/api/exams', (req, res) => {
  const items = db.prepare('SELECT * FROM exams ORDER BY id DESC').all();
  res.json(items);
});

app.post('/api/exams/enroll', (req, res) => {
  const { regNo, examId } = req.body;
  if (!regNo || !examId) return res.status(400).json({ error: 'regNo and examId required' });
  const enrolledAt = new Date().toISOString().split('T')[0];
  const info = db.prepare(
    'INSERT INTO exam_enrollments (regNo, examId, enrolledAt) VALUES (?, ?, ?)'
  ).run(regNo, Number(examId), enrolledAt);
  const enrollment = db.prepare('SELECT * FROM exam_enrollments WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(enrollment);
});

// ============ PLACEMENTS ============
app.get('/api/placements', (req, res) => {
  const items = db.prepare('SELECT * FROM placements ORDER BY id DESC').all();
  res.json(items);
});

app.post('/api/placements/apply', (req, res) => {
  const { regNo, placementId } = req.body;
  if (!regNo || !placementId) return res.status(400).json({ error: 'regNo and placementId required' });
  const appliedAt = new Date().toISOString().split('T')[0];
  const info = db.prepare(
    'INSERT INTO placement_applications (regNo, placementId, appliedAt, status) VALUES (?, ?, ?, ?)'
  ).run(regNo, Number(placementId), appliedAt, 'applied');
  const application = db.prepare('SELECT * FROM placement_applications WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(application);
});

app.get('/api/placements/applications/:regNo', (req, res) => {
  const { regNo } = req.params;
  const apps = db.prepare('SELECT * FROM placement_applications WHERE regNo = ? ORDER BY id DESC').all(regNo);
  res.json(apps);
});

// ============ FEEDBACK SYSTEM ============
app.post('/api/feedback', (req, res) => {
  const { userId, targetId, targetType, rating, comments } = req.body;
  if (!userId || !targetId || !targetType || !rating) return res.status(400).json({ error: 'All fields required' });
  const createdAt = new Date().toISOString().split('T')[0];
  const info = db.prepare(
    'INSERT INTO feedback (userId, targetId, targetType, rating, comments, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(userId, targetId, targetType, rating, comments || '', createdAt);
  const fback = db.prepare('SELECT * FROM feedback WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(fback);
});

app.get('/api/feedback/:targetId/:targetType', (req, res) => {
  const { targetId, targetType } = req.params;
  const fb = db.prepare('SELECT * FROM feedback WHERE targetId = ? AND targetType = ? ORDER BY id DESC').all(targetId, targetType);
  res.json(fb);
});

// ============ ADMIN DATA SEED ============
const seedTables = {
  library_books: ['title', 'author', 'isbn', 'available', 'total'],
  exams: ['name', 'subject', 'date', 'time', 'duration', 'syllabus'],
  placements: ['companyName', 'role', 'salary', 'location', 'deadline', 'postedAt'],
  assignments: ['title', 'subject', 'dueDate', 'createdAt'],
  certificates: ['regNo', 'certificateType', 'course', 'issueDate', 'status'],
  events: ['title', 'description', 'date', 'time', 'location', 'type', 'postedBy', 'postedByName', 'createdAt', 'image'],
  forum_topics: ['title', 'author', 'content', 'replies', 'views', 'createdAt'],
  attendance: ['studentRegNo', 'date', 'status', 'subject'],
  marks: ['studentRegNo', 'subjectName', 'internalMarks', 'semesterMarks', 'grade'],
  students: ['name', 'regNo', 'department', 'year', 'phone', 'email', 'password'],
  teachers: ['name', 'regNo', 'department', 'specialization', 'dateOfJoining', 'phone', 'email', 'password'],
  subjects: ['name', 'code', 'department'],
  classes: ['name', 'subject', 'teacher', 'students', 'icon'],
  timetable: ['day', 'startTime', 'endTime', 'subject', 'room', 'teacher', 'students'],
  semesters: ['name', 'year', 'status', 'startDate', 'endDate'],
  holidays: ['title', 'type', 'startDate', 'endDate'],
  important_dates: ['title', 'date', 'type']
};

app.post('/api/admin/seed', requireAdmin, (req, res) => {
  const { table, rows } = req.body;
  if (!table || !rows) return res.status(400).json({ error: 'table and rows are required' });
  const columns = seedTables[table];
  if (!columns) return res.status(400).json({ error: 'Invalid table' });

  const list = Array.isArray(rows) ? rows : [rows];
  const placeholders = columns.map(() => '?').join(', ');
  const stmt = db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      const values = columns.map((col) => {
        let value = item[col];
        if ((table === 'classes' || table === 'timetable') && col === 'students' && Array.isArray(value)) {
          return JSON.stringify(value);
        }
        if ((table === 'students' || table === 'teachers') && col === 'password' && !value) {
          return 'pass@123';
        }
        return value !== undefined ? value : null;
      });
      stmt.run(values);
    }
  });

  insertMany(list);
  res.json({ inserted: list.length });
});

// ============ STATS/COUNT ENDPOINTS ============
app.get('/api/stats/count', (req, res) => {
  try {
    const studentsCount = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const teachersCount = db.prepare('SELECT COUNT(*) as count FROM teachers').get().count;
    const subjectsCount = db.prepare('SELECT COUNT(*) as count FROM subjects').get().count;
    const classesCount = db.prepare('SELECT COUNT(DISTINCT name) as count FROM classes').get().count;
    res.json({
      students: studentsCount,
      teachers: teachersCount,
      subjects: subjectsCount,
      classes: classesCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SETUP DEFAULT PASSWORDS ============
app.post('/api/admin/setup-passwords', requireAdmin, (req, res) => {
  try {
    db.prepare('UPDATE students SET password = ? WHERE password IS NULL OR password = ""').run('pass@123');
    db.prepare('UPDATE teachers SET password = ? WHERE password IS NULL OR password = ""').run('pass@123');
    const updatedStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const updatedTeachers = db.prepare('SELECT COUNT(*) as count FROM teachers').get().count;
    res.json({ message: `Set passwords for ${updatedStudents} students and ${updatedTeachers} teachers` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pricing', (req, res) => res.json([]));

// Start server

// Start server
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
