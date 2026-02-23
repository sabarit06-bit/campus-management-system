import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StudentMarksGrades() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get regNo from localStorage (stored by App.jsx during login)
  const storedUser = JSON.parse(localStorage.getItem('campusUser') || '{}');
  const studentRegNo = storedUser.regNo || 'unknown';

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/marks/student/${encodeURIComponent(studentRegNo)}`);
      const data = await response.json();
      setMarks(data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch marks: ' + err.message);
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': case 'A': return 'bg-green-600 text-white';
      case 'B': return 'bg-blue-600 text-white';
      case 'C': return 'bg-yellow-600 text-white';
      case 'D': return 'bg-orange-600 text-white';
      case 'F': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const chartData = marks.map(m => ({
    subject: m.subjectName || 'N/A',
    internal: m.internalMarks || 0,
    semester: m.semesterMarks || 0
  }));

  const totalInternal = marks.reduce((sum, m) => sum + (m.internalMarks || 0), 0);
  const totalSemester = marks.reduce((sum, m) => sum + (m.semesterMarks || 0), 0);
  const avgGrade = marks.length > 0 ? marks[0].grade : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">📈 Marks & Grades</h1>

        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-400 text-center">{error}</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-xl">
                <p className="text-gray-200 mb-2">Internal Marks (Total)</p>
                <p className="text-3xl font-bold text-white">{totalInternal}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg shadow-xl">
                <p className="text-gray-200 mb-2">Semester Marks (Total)</p>
                <p className="text-3xl font-bold text-white">{totalSemester}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-lg shadow-xl">
                <p className="text-gray-200 mb-2">Overall Grade</p>
                <p className="text-3xl font-bold text-white">{avgGrade}</p>
              </div>
            </div>

            {/* Bar Chart */}
            {marks.length > 0 ? (
              <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Marks Comparison</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="subject" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#374151', border: '1px solid #666' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="internal" fill="#3b82f6" name="Internal Marks" />
                    <Bar dataKey="semester" fill="#8b5cf6" name="Semester Marks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : null}

            {/* Detailed Table */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold text-white mb-4">📋 Subject-wise Marks</h2>
              {marks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead className="border-b border-purple-500">
                      <tr>
                        <th className="text-left p-3">Subject</th>
                        <th className="text-left p-3">Internal Marks</th>
                        <th className="text-left p-3">Semester Marks</th>
                        <th className="text-left p-3">Total</th>
                        <th className="text-left p-3">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marks.map((mark, idx) => (
                        <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700">
                          <td className="p-3">{mark.subjectName}</td>
                          <td className="p-3">{mark.internalMarks || 0}/50</td>
                          <td className="p-3">{mark.semesterMarks || 0}/50</td>
                          <td className="p-3 font-semibold">{mark.totalMarks || 0}/100</td>
                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getGradeColor(mark.grade)}`}>
                              {mark.grade || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-300">No marks recorded yet</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
