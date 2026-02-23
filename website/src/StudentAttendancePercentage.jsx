import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function StudentAttendancePercentage() {
  const [attendance, setAttendance] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get regNo from localStorage (stored by App.jsx during login)
  const storedUser = JSON.parse(localStorage.getItem('campusUser') || '{}');
  const studentRegNo = storedUser.regNo || 'unknown';

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`https://campus-management-system-production.up.railway.app/api/attendance/${encodeURIComponent(studentRegNo)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const present = data.filter(a => a.status === 'Present').length;
        const total = data.length;
        const percent = Math.round((present / total) * 100);
        
        setAttendance(data);
        setPercentage(percent);
      } else {
        setPercentage(0);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch attendance: ' + err.message);
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Present', value: Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100) || 0 },
    { name: 'Absent', value: Math.round((attendance.filter(a => a.status === 'Absent').length / attendance.length) * 100) || 0 },
    { name: 'Leave', value: Math.round((attendance.filter(a => a.status === 'Leave').length / attendance.length) * 100) || 0 }
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">📊 Attendance Overview</h1>

        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-400 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overall Percentage */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold text-white mb-6">Overall Attendance</h2>
              <div className="flex items-center justify-center">
                <div className="text-6xl font-bold text-white">{percentage}%</div>
              </div>
              <p className="text-center text-gray-200 mt-4">
                {attendance.filter(a => a.status === 'Present').length} / {attendance.length} classes attended
              </p>
            </div>

            {/* Pie Chart */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold text-white mb-6">Attendance Breakdown</h2>
              {attendance.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-200">No attendance data available</p>
              )}
            </div>
          </div>
        )}

        {/* Recent Records */}
        {attendance.length > 0 && (
          <div className="mt-8 bg-slate-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">📋 Recent Attendance Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead className="border-b border-purple-500">
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.slice(0, 10).map((record, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700">
                      <td className="p-2">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="p-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          record.status === 'Present' ? 'bg-green-600 text-white' :
                          record.status === 'Absent' ? 'bg-red-600 text-white' :
                          'bg-yellow-600 text-white'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
