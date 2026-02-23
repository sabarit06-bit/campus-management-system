import React, { useState, useEffect } from 'react';

export default function MarkAttendance() {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/students', {
        headers: { 'x-user-role': 'teacher' }
      });
      const data = await res.json();
      setStudents(data);
      const initialAttendance = {};
      data.forEach(student => {
        initialAttendance[student.regNo] = 'present';
      });
      setAttendance(initialAttendance);
    } catch (err) {
      console.error('Error fetching students:', err);
      setMessage('Error loading students');
    }
  };

  const handleAttendanceChange = (studentRegNo, status) => {
    setAttendance({ ...attendance, [studentRegNo]: status });
  };

  const submitAttendance = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      for (const [studentRegNo, status] of Object.entries(attendance)) {
        await fetch('http://localhost:4000/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': 'teacher'
          },
          body: JSON.stringify({ 
            studentRegNo, 
            date: selectedDate, 
            status: status.charAt(0).toUpperCase() + status.slice(1)
          })
        });
      }
      setMessage('✓ Attendance marked successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error marking attendance:', err);
      setMessage('Error marking attendance');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">📝 Mark Attendance</h1>
        <p className="text-cyan-200 mb-8">Record attendance for your students</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✓') ? 'bg-green-500/20 border border-green-500 text-green-300' : 'bg-red-500/20 border border-red-500 text-red-300'}`}>
            {message}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 mb-6">
          <div className="mb-6">
            <label className="text-white font-semibold block mb-2">📅 Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-3 text-left text-cyan-300">Student Name</th>
                  <th className="px-4 py-3 text-left text-cyan-300">Reg. Number</th>
                  <th className="px-4 py-3 text-left text-cyan-300">Department</th>
                  <th className="px-4 py-3 text-center text-cyan-300">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-white">{student.name}</td>
                    <td className="px-4 py-3 text-gray-300">{student.regNo}</td>
                    <td className="px-4 py-3 text-gray-300">{student.department}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleAttendanceChange(student.regNo, 'present')}
                          className={`px-3 py-1 rounded ${
                            attendance[student.regNo] === 'present'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          } transition`}
                        >
                          ✓ Present
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.regNo, 'absent')}
                          className={`px-3 py-1 rounded ${
                            attendance[student.regNo] === 'absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          } transition`}
                        >
                          ✕ Absent
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.regNo, 'leave')}
                          className={`px-3 py-1 rounded ${
                            attendance[student.regNo] === 'leave'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          } transition`}
                        >
                          🏥 Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={submitAttendance}
              disabled={loading}
              className="px-6 py-2 bg-cyan-600 text-white rounded font-semibold hover:bg-cyan-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : '💾 Submit Attendance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
