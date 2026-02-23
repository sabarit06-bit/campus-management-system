import React, { useState, useEffect } from 'react';

export default function EnterMarks() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentRes, subjectRes] = await Promise.all([
        fetch('http://localhost:4000/api/students', { headers: { 'x-user-role': 'teacher' } }),
        fetch('http://localhost:4000/api/subjects', { headers: { 'x-user-role': 'teacher' } })
      ]);
      const studentData = await studentRes.json();
      const subjectData = await subjectRes.json();
      setStudents(studentData);
      setSubjects(subjectData);
      if (subjectData.length > 0) {
        setSelectedSubject(subjectData[0].id);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setMessage('Error loading data');
    }
  };

  const handleMarksChange = (studentId, field, value) => {
    setMarks({
      ...marks,
      [studentId]: {
        ...marks[studentId],
        [field]: value
      }
    });
  };

  const calculateGrade = (internal, semester) => {
    const total = (parseInt(internal) || 0) + (parseInt(semester) || 0);
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B';
    if (total >= 60) return 'C';
    if (total >= 50) return 'D';
    return 'F';
  };

  const submitMarks = async () => {
    setLoading(true);
    setMessage('');
    
    // Validate subject is selected
    if (!selectedSubject) {
      setMessage('⚠️ Please select a subject first');
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    try {
      const selectedSubjectObj = subjects.find(s => s.id == selectedSubject);
      const subjectName = selectedSubjectObj?.name || '';
      
      for (const [studentId, marksData] of Object.entries(marks)) {
        if (marksData.internal || marksData.semester) {
          const student = students.find(s => s.id == studentId);
          const grade = calculateGrade(marksData.internal, marksData.semester);
          await fetch('http://localhost:4000/api/marks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-role': 'teacher'
            },
            body: JSON.stringify({
              studentRegNo: student.regNo,
              subjectName: subjectName,
              internalMarks: parseInt(marksData.internal) || 0,
              semesterMarks: parseInt(marksData.semester) || 0,
              grade
            })
          });
        }
      }
      setMessage('✓ Marks submitted successfully!');
      setMarks({});
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error submitting marks:', err);
      setMessage('Error submitting marks');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">📊 Enter Marks</h1>
        <p className="text-cyan-200 mb-8">Record internal and semester marks for students</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✓') ? 'bg-green-500/20 border border-green-500 text-green-300' : 'bg-red-500/20 border border-red-500 text-red-300'}`}>
            {message}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 mb-6">
          <div className="mb-6">
            <label className="text-white font-semibold block mb-2">📚 Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full md:w-96 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
            >
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-3 text-left text-cyan-300">Student Name</th>
                  <th className="px-4 py-3 text-left text-cyan-300">Reg. No</th>
                  <th className="px-4 py-3 text-center text-cyan-300">Internal (50)</th>
                  <th className="px-4 py-3 text-center text-cyan-300">Semester (50)</th>
                  <th className="px-4 py-3 text-center text-cyan-300">Total</th>
                  <th className="px-4 py-3 text-center text-cyan-300">Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const studentMarks = marks[student.id];
                  const internal = parseInt(studentMarks?.internal) || 0;
                  const semester = parseInt(studentMarks?.semester) || 0;
                  const total = internal + semester;
                  const grade = calculateGrade(internal, semester);
                  
                  return (
                    <tr key={student.id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-white">{student.name}</td>
                      <td className="px-4 py-3 text-gray-300">{student.regNo}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={studentMarks?.internal || ''}
                          onChange={(e) => handleMarksChange(student.id, 'internal', e.target.value)}
                          className="w-16 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={studentMarks?.semester || ''}
                          onChange={(e) => handleMarksChange(student.id, 'semester', e.target.value)}
                          className="w-16 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 text-center"
                        />
                      </td>
                      <td className="px-4 py-3 text-center text-cyan-300 font-semibold">{total}/100</td>
                      <td className={`px-4 py-3 text-center font-semibold rounded ${
                        grade === 'A+' ? 'text-green-300' : 
                        grade === 'A' ? 'text-cyan-300' :
                        grade === 'B' ? 'text-yellow-300' :
                        grade === 'C' ? 'text-orange-300' :
                        grade === 'D' ? 'text-red-300' : 'text-red-500'
                      }`}>{grade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={submitMarks}
              disabled={loading || !selectedSubject}
              className="px-6 py-2 bg-cyan-600 text-white rounded font-semibold hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : '💾 Submit Marks'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
