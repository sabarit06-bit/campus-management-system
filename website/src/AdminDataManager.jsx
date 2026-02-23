import React, { useState } from 'react';

const TABLE_SCHEMAS = {
  students: {
    label: 'Students',
    columns: ['name', 'regNo', 'department', 'year', 'phone', 'email'],
    sample: {
      name: 'Barath',
      regNo: '231cg001',
      department: 'CSE',
      year: '3',
      phone: '9876543210',
      email: 'barath@campus.local'
    }
  },
  teachers: {
    label: 'Teachers',
    columns: ['name', 'regNo', 'department', 'specialization', 'dateOfJoining', 'phone', 'email'],
    sample: {
      name: 'Dr. Karthik Iyer',
      regNo: 'TCH2018B012',
      department: 'CSE',
      specialization: 'Data Structures & Algorithms',
      dateOfJoining: '2018-06-12',
      phone: '9123456780',
      email: 'karthik.iyer@campus.local'
    }
  },
  subjects: {
    label: 'Subjects',
    columns: ['name', 'code', 'department'],
    sample: {
      name: 'Data Structures',
      code: 'CSE301',
      department: 'CSE'
    }
  },
  classes: {
    label: 'Classes',
    columns: ['name', 'subject', 'teacher', 'students', 'icon'],
    sample: {
      name: 'CSE 3rd Year - A',
      subject: 'CSE301',
      teacher: 'TCH2018B012',
      students: ['231cg001', '231cg002', '231cg003'],
      icon: '📘'
    }
  },
  timetable: {
    label: 'Timetable Slots',
    columns: ['day', 'startTime', 'endTime', 'subject', 'room', 'teacher', 'students'],
    sample: {
      day: 'Monday',
      startTime: '09:00 AM',
      endTime: '10:30 AM',
      subject: 'Data Structures',
      room: 'Lab-01',
      teacher: 'Dr. Karthik Iyer',
      students: ['231cg001', '231cg002', '231cg003']
    }
  },
  semesters: {
    label: 'Semesters',
    columns: ['name', 'year', 'status', 'startDate', 'endDate'],
    sample: {
      name: 'Semester 1 (Odd)',
      year: 2026,
      status: 'ongoing',
      startDate: '2026-01-05',
      endDate: '2026-04-30'
    }
  },
  holidays: {
    label: 'Holidays',
    columns: ['title', 'type', 'startDate', 'endDate'],
    sample: {
      title: 'Summer Break',
      type: 'vacation',
      startDate: '2026-05-01',
      endDate: '2026-07-31'
    }
  },
  important_dates: {
    label: 'Important Dates',
    columns: ['title', 'date', 'type'],
    sample: {
      title: 'Mid Term Exams',
      date: '2026-02-23',
      type: 'exam'
    }
  },
  library_books: {
    label: 'Library Books',
    columns: ['title', 'author', 'isbn', 'available', 'total'],
    example: [{ title: 'Clean Code', author: 'Robert Martin', isbn: '9780132350884', available: 3, total: 5 }]
  },
  exams: {
    label: 'Exams',
    columns: ['name', 'subject', 'date', 'time', 'duration', 'syllabus'],
    example: [{ name: 'Midterm - Data Structures', subject: 'DSA', date: '2026-03-10', time: '10:00', duration: 120, syllabus: 'Arrays, Stacks' }]
  },
  placements: {
    label: 'Placements',
    columns: ['companyName', 'role', 'salary', 'location', 'deadline', 'postedAt'],
    example: [{ companyName: 'Acme', role: 'Intern', salary: '3 LPA', location: 'Remote', deadline: '2026-03-30', postedAt: '2026-02-20' }]
  },
  assignments: {
    label: 'Assignments',
    columns: ['title', 'subject', 'dueDate', 'createdAt'],
    example: [{ title: 'DSA Project', subject: 'Data Structures', dueDate: '2026-02-28', createdAt: '2026-02-20' }]
  },
  certificates: {
    label: 'Certificates',
    columns: ['regNo', 'certificateType', 'course', 'issueDate', 'status'],
    example: [{ regNo: '213cg005', certificateType: 'Completion', course: 'Python Basics', issueDate: '2026-02-20', status: 'issued' }]
  },
  events: {
    label: 'Events',
    columns: ['title', 'description', 'date', 'time', 'location', 'type', 'postedBy', 'postedByName', 'createdAt', 'image'],
    example: [{ title: 'Tech Fest', description: 'Annual fest', date: '2026-03-10', time: '09:00', location: 'Main Auditorium', type: 'festival', postedBy: '2305', postedByName: 'Arun', createdAt: '2026-02-20', image: '' }]
  },
  forum_topics: {
    label: 'Forum Topics',
    columns: ['title', 'author', 'content', 'replies', 'views', 'createdAt'],
    example: [{ title: 'Study Tips', author: '213cg005', content: 'Share tips', replies: 0, views: 0, createdAt: '2026-02-20' }]
  }
};

function AdminDataManager({ user }) {
  const [table, setTable] = useState('students');
  const [formData, setFormData] = useState({});
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const schema = TABLE_SCHEMAS[table];

  const onTableChange = (next) => {
    setTable(next);
    setFormData({});
    setRecords([]);
    setStatus('');
  };

  const handleFieldChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value || undefined
    });
  };

  const handleAddRecord = () => {
    const required = ['name', 'regNo', 'department'].filter(f => schema.columns.includes(f));
    const missing = required.filter(f => !formData[f]);
    
    if (missing.length > 0) {
      setStatus(`Missing required fields: ${missing.join(', ')}`);
      return;
    }

    const newRecord = {};
    schema.columns.forEach(col => {
      newRecord[col] = formData[col] || null;
    });

    setRecords([...records, newRecord]);
    setFormData({});
    setStatus(`Added 1 record. Total: ${records.length + 1}.`);
  };

  const handleRemoveRecord = (idx) => {
    setRecords(records.filter((_, i) => i !== idx));
  };

  const handleSaveAll = async () => {
    if (records.length === 0) {
      setStatus('No records to save. Add at least one.');
      return;
    }

    const payload = { table, rows: records };
    setLoading(true);

    try {
      const res = await fetch('https://campus-management-system-production.up.railway.app/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user?.role || 'admin'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to seed data');
      }
      const data = await res.json();
      setStatus(`✓ Inserted ${data.inserted} record(s) into ${schema.label}.`);
      setRecords([]);
      setFormData({});
    } catch (err) {
      setStatus(`✗ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Data Manager</h1>
        <p className="text-cyan-200 mb-6">Add and save data directly (SQLite local database).</p>

        {/* Table Selection */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-6 mb-6">
          <label className="block text-white text-sm font-semibold mb-2">Select Table</label>
          <select
            value={table}
            onChange={(e) => onTableChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
          >
            {Object.keys(TABLE_SCHEMAS).map((key) => (
              <option key={key} value={key}>{TABLE_SCHEMAS[key].label}</option>
            ))}
          </select>
        </div>

        {/* Form for adding records */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Add {schema.label}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {schema.columns.map((col) => (
              <div key={col}>
                <label className="block text-gray-300 text-xs font-semibold mb-1 capitalize">{col}</label>
                <input
                  type={col === 'year' || col === 'available' || col === 'total' || col === 'duration' || col === 'replies' || col === 'views' ? 'number' : 'text'}
                  placeholder={`Enter ${col}`}
                  value={formData[col] || ''}
                  onChange={(e) => handleFieldChange(col, e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleAddRecord}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            + Add Record
          </button>
        </div>

        {/* Records list */}
        {records.length > 0 && (
          <div className="bg-white/10 border border-white/20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Records to Save ({records.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {records.map((rec, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded p-4 flex justify-between items-start">
                  <div className="flex-1 text-sm text-gray-300">
                    {Object.entries(rec)
                      .filter(([_, v]) => v !== null && v !== undefined)
                      .map(([k, v]) => (
                        <div key={k}><span className="font-semibold">{k}:</span> {String(v)}</div>
                      ))}
                  </div>
                  <button
                    onClick={() => handleRemoveRecord(idx)}
                    className="ml-4 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveAll}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition disabled:bg-gray-500"
            >
              {loading ? 'Saving...' : `Save All ${records.length} Record(s)`}
            </button>
          </div>
        )}

        {/* Status */}
        {status && (
          <div className={`p-4 rounded ${status.startsWith('✓') ? 'bg-green-600/20 border border-green-600 text-green-300' : 'bg-red-600/20 border border-red-600 text-red-300'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDataManager;
