import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MarksReports() {
  const [marksData, setMarksData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [departmentPerf, setDepartmentPerf] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');

  useEffect(() => {
    fetchMarksData();
  }, []);

  const fetchMarksData = async () => {
    try {
      const response = await fetch('https://campus-management-system-production.up.railway.app/api/marks');
      const records = await response.json();

      // Generate subject-wise data
      const subjectStats = {};
      records.forEach(record => {
        const total = (record.internalMarks || 0) + (record.semesterMarks || 0);
        if (!subjectStats[record.subjectId]) {
          subjectStats[record.subjectId] = [];
        }
        subjectStats[record.subjectId].push(total);
      });

      const subjectData = Object.entries(subjectStats).map(([subject, marks]) => ({
        subject,
        average: Math.round(marks.reduce((a, b) => a + b, 0) / marks.length),
        highest: Math.max(...marks),
        lowest: Math.min(...marks),
        count: marks.length
      }));

      setMarksData(subjectData);

      // Grade distribution
      const gradeCount = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
      records.forEach(r => {
        if (r.grade) gradeCount[r.grade]++;
      });

      setGradeDistribution(
        Object.entries(gradeCount).map(([grade, count]) => ({
          grade,
          count,
          percentage: records.length > 0 ? Math.round((count / records.length) * 100) : 0
        }))
      );

      // Department performance (mock)
      setDepartmentPerf([
        { dept: 'CSE', avgMarks: 78, students: 45, percentage: 85 },
        { dept: 'ECE', avgMarks: 72, students: 38, percentage: 78 },
        { dept: 'Mechanical', avgMarks: 68, students: 42, percentage: 70 },
        { dept: 'Civil', avgMarks: 75, students: 35, percentage: 82 }
      ]);
    } catch (err) {
      console.error('Failed to fetch marks data:', err);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444'];

  const overallStats = {
    avgMarks: marksData.length > 0 ? Math.round(marksData.reduce((sum, s) => sum + s.average, 0) / marksData.length) : 0,
    highestMarks: marksData.length > 0 ? Math.max(...marksData.map(s => s.highest)) : 0,
    lowestMarks: marksData.length > 0 ? Math.min(...marksData.map(s => s.lowest)) : 0,
    totalStudents: marksData.reduce((sum, s) => sum + s.count, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">📈 Marks Reports & Analysis</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Average Marks</p>
            <p className="text-4xl font-bold text-white">{overallStats.avgMarks}</p>
            <p className="text-sm text-gray-200 mt-2">Out of 100</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Highest Marks</p>
            <p className="text-4xl font-bold text-white">{overallStats.highestMarks}</p>
            <p className="text-sm text-gray-200 mt-2">Highest score</p>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Lowest Marks</p>
            <p className="text-4xl font-bold text-white">{overallStats.lowestMarks}</p>
            <p className="text-sm text-gray-200 mt-2">Lowest score</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Total Students</p>
            <p className="text-4xl font-bold text-white">{overallStats.totalStudents}</p>
            <p className="text-sm text-gray-200 mt-2">Assessed</p>
          </div>
        </div>

        {/* Grade Distribution Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Grade Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Grade Table */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Grade Statistics</h2>
            <div className="space-y-2">
              {gradeDistribution.map((grade, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className={`text-lg font-bold px-3 py-1 rounded ${
                    grade.grade === 'A+' ? 'bg-green-600' :
                    grade.grade === 'A' ? 'bg-green-500' :
                    grade.grade === 'B' ? 'bg-blue-600' :
                    grade.grade === 'C' ? 'bg-yellow-600' :
                    grade.grade === 'D' ? 'bg-orange-600' :
                    'bg-red-600'
                  } text-white`}>
                    {grade.grade}
                  </span>
                  <div className="flex-1 mx-4 bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        grade.grade === 'A+' ? 'bg-green-600' :
                        grade.grade === 'A' ? 'bg-green-500' :
                        grade.grade === 'B' ? 'bg-blue-600' :
                        grade.grade === 'C' ? 'bg-yellow-600' :
                        grade.grade === 'D' ? 'bg-orange-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${grade.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-semibold">{grade.count} ({grade.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Performance Chart */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Subject-wise Performance</h2>
          {marksData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marksData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ backgroundColor: '#374151', border: '1px solid #666' }} />
                <Legend />
                <Bar dataKey="average" fill="#3b82f6" name="Average" />
                <Bar dataKey="highest" fill="#10b981" name="Highest" />
                <Bar dataKey="lowest" fill="#ef4444" name="Lowest" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-300">No marks data available</p>
          )}
        </div>

        {/* Department Performance */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Department Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead className="border-b border-purple-500">
                <tr>
                  <th className="text-left p-3">Department</th>
                  <th className="text-left p-3">Ave. Marks</th>
                  <th className="text-left p-3">Students</th>
                  <th className="text-left p-3">Pass %</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentPerf.map((dept, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700">
                    <td className="p-3 font-semibold">{dept.dept}</td>
                    <td className="p-3">{dept.avgMarks}/100</td>
                    <td className="p-3">{dept.students}</td>
                    <td className="p-3"><span className="text-green-400 font-bold">{dept.percentage}%</span></td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        dept.percentage >= 80 ? 'bg-green-600' :
                        dept.percentage >= 70 ? 'bg-yellow-600' :
                        'bg-red-600'
                      } text-white`}>
                        {dept.percentage >= 80 ? 'Excellent' : dept.percentage >= 70 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
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
