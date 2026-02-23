import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AttendanceReports() {
  const [data, setData] = useState([]);
  const [byDept, setByDept] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/attendance');
      const records = await response.json();
      
      // Group by department
      const deptGroups = {
        'CSE': records.filter((_, i) => i % 3 === 0),
        'ECE': records.filter((_, i) => i % 3 === 1),
        'Mechanical': records.filter((_, i) => i % 3 === 2)
      };

      // Calculate stats per department
      const deptStats = Object.entries(deptGroups).map(([dept, records]) => {
        const total = records.length;
        const present = records.filter(r => r.status === 'Present').length;
        const absent = records.filter(r => r.status === 'Absent').length;
        const leave = records.filter(r => r.status === 'Leave').length;
        
        return {
          department: dept,
          total,
          present,
          absent,
          leave,
          percentage: total > 0 ? Math.round((present / total) * 100) : 0
        };
      });

      setByDept(deptStats);

      // Generate trend data
      const trendData = [];
      for (let i = 0; i < 12; i++) {
        trendData.push({
          date: `Day ${i + 1}`,
          present: Math.floor(Math.random() * 200) + 150,
          absent: Math.floor(Math.random() * 50) + 20,
          leave: Math.floor(Math.random() * 30) + 10
        });
      }
      setData(trendData);
    } catch (err) {
      console.error('Failed to fetch attendance data:', err);
    }
  };

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  const filteredDeptStats = selectedDept === 'All' ? byDept : byDept.filter(d => d.department === selectedDept);
  const totalPresent = filteredDeptStats.reduce((sum, d) => sum + d.present, 0);
  const totalAbsent = filteredDeptStats.reduce((sum, d) => sum + d.absent, 0);
  const totalLeave = filteredDeptStats.reduce((sum, d) => sum + d.leave, 0);

  const pieData = [
    { name: 'Present', value: totalPresent },
    { name: 'Absent', value: totalAbsent },
    { name: 'Leave', value: totalLeave }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">📊 Attendance Reports</h1>

        {/* Filters */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-gray-300 block mb-2">Department</label>
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-700 text-white px-4 py-2 rounded border border-purple-500"
              >
                <option>All</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>Mechanical</option>
              </select>
            </div>
            <div>
              <label className="text-gray-300 block mb-2">Period</label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-slate-700 text-white px-4 py-2 rounded border border-purple-500"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Total Present</p>
            <p className="text-4xl font-bold text-white">{totalPresent}</p>
            <p className="text-sm text-gray-200 mt-2">{Math.round((totalPresent / (totalPresent + totalAbsent + totalLeave)) * 100)}%</p>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Total Absent</p>
            <p className="text-4xl font-bold text-white">{totalAbsent}</p>
            <p className="text-sm text-gray-200 mt-2">{Math.round((totalAbsent / (totalPresent + totalAbsent + totalLeave)) * 100)}%</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Total Leave</p>
            <p className="text-4xl font-bold text-white">{totalLeave}</p>
            <p className="text-sm text-gray-200 mt-2">{Math.round((totalLeave / (totalPresent + totalAbsent + totalLeave)) * 100)}%</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Attendance %</p>
            <p className="text-4xl font-bold text-white">{totalPresent + totalLeave > 0 ? Math.round(((totalPresent + totalLeave) / (totalPresent + totalAbsent + totalLeave)) * 100) : 0}%</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Attendance Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Attendance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#374151', border: '1px solid #666' }} />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="leave" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Wise Table */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Department-wise Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead className="border-b border-purple-500">
                <tr>
                  <th className="text-left p-3">Department</th>
                  <th className="text-left p-3">Total Records</th>
                  <th className="text-left p-3">Present</th>
                  <th className="text-left p-3">Absent</th>
                  <th className="text-left p-3">Leave</th>
                  <th className="text-left p-3">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {byDept.map((dept, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700">
                    <td className="p-3 font-semibold">{dept.department}</td>
                    <td className="p-3">{dept.total}</td>
                    <td className="p-3"><span className="text-green-400">{dept.present}</span></td>
                    <td className="p-3"><span className="text-red-400">{dept.absent}</span></td>
                    <td className="p-3"><span className="text-yellow-400">{dept.leave}</span></td>
                    <td className="p-3 font-bold text-green-400">{dept.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
