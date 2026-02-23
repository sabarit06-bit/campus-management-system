import React, { useState, useEffect } from 'react';

function ExamPortal({ user }) {
  const [exams, setExams] = useState([]);
  const [enrolledExams, setEnrolledExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const regNo = user?.regNo || (user?.email && user.email.split('@')[0]);

  useEffect(() => {
    fetch('http://localhost:4000/api/exams')
      .then(res => res.json())
      .then(data => {
        setExams(data);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const enrollExam = async (examId) => {
    try {
      const res = await fetch('http://localhost:4000/api/exams/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, examId })
      });
      if (res.ok) {
        const data = await res.json();
        setEnrolledExams([...enrolledExams, data]);
        alert('Exam enrollment successful.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Exam Portal</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Available Exams */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Available Exams</h2>
            <div className="space-y-4">
              {exams.map(exam => (
                <div key={exam.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="font-bold text-white">{exam.name}</div>
                  <div className="text-sm text-gray-300 mt-2">
                    <div>Subject: {exam.subject}</div>
                    <div>Date: {exam.date} at {exam.time}</div>
                    <div>Duration: {exam.duration} minutes</div>
                    <div className="mt-2">Syllabus: {exam.syllabus}</div>
                  </div>
                  <button
                    onClick={() => enrollExam(exam.id)}
                    className="mt-3 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition w-full font-semibold"
                  >
                    Enroll Exam
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Exams */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Enrolled Exams</h2>
            {enrolledExams.length > 0 ? (
              <div className="space-y-4">
                {enrolledExams.map(enrollment => {
                  const exam = exams.find(e => e.id === enrollment.examId);
                  return (
                    <div key={enrollment.id} className="bg-green-600/10 border-l-4 border-green-500 p-4 rounded-lg">
                      <div className="font-bold text-green-300">{exam?.name}</div>
                      <div className="text-sm text-gray-300 mt-2">
                        <div>Date: {exam?.date} at {exam?.time}</div>
                        <div>Duration: {exam?.duration} minutes</div>
                        <div className="mt-2 text-xs text-gray-400">Enrolled: {enrollment.enrolledAt}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400">No exams enrolled yet. Enroll from available exams.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamPortal;
