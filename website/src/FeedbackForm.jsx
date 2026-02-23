import React, { useState, useEffect } from 'react';

function FeedbackForm({ user }) {
  const [formData, setFormData] = useState({
    targetType: 'teacher',
    targetId: '',
    rating: 5,
    comments: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:4000/api/teachers').then(res => res.json()),
      fetch('http://localhost:4000/api/subjects').then(res => res.json())
    ])
      .then(([teachersData, subjectsData]) => {
        const teacherOptions = (teachersData || []).map(t => ({ id: t.regNo, name: t.name }));
        const courseOptions = (subjectsData || []).map(s => ({ id: s.id, name: s.name }));
        setTeachers(teacherOptions);
        setCourses(courseOptions);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!formData.targetId) {
      alert('Please select a target for feedback');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.regNo || user?.email?.split('@')[0],
          ...formData
        })
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ targetType: 'teacher', targetId: '', rating: 5, comments: '' });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const targetList = formData.targetType === 'teacher' ? teachers : courses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Feedback Form</h1>
        <p className="text-cyan-200 mb-8">Help us improve by sharing your valuable feedback</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Give Feedback</h2>
            
            <div className="space-y-4">
              {/* Target Type */}
              <label className="text-white text-sm">
                Feedback For:
                <select
                  value={formData.targetType}
                  onChange={e => setFormData({...formData, targetType: e.target.value, targetId: ''})}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="teacher">Teacher</option>
                  <option value="course">Course</option>
                </select>
              </label>

              {/* Target Selection */}
              <label className="text-white text-sm">
                {formData.targetType === 'teacher' ? 'Select Teacher:' : 'Select Course:'}
                <select
                  value={formData.targetId}
                  onChange={e => setFormData({...formData, targetId: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">Choose...</option>
                  {targetList.length === 0 ? (
                    <option value="" disabled>No data available</option>
                  ) : (
                    targetList.map(target => (
                      <option key={target.id} value={target.id}>{target.name}</option>
                    ))
                  )}
                </select>
              </label>

              {/* Rating */}
              <label className="text-white text-sm">
                Rating:
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => setFormData({...formData, rating: value})}
                      className={`px-3 py-1 rounded border ${formData.rating >= value ? 'border-yellow-400 text-yellow-300' : 'border-white/20 text-gray-300'} transition`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </label>

              {/* Comments */}
              <label className="text-white text-sm">
                Comments:
                <textarea
                  value={formData.comments}
                  onChange={e => setFormData({...formData, comments: e.target.value})}
                  placeholder="Share your detailed feedback..."
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-28"
                />
              </label>

              {submitted && (
                <div className="bg-green-600/30 border border-green-500 text-green-300 p-3 rounded">
                  Feedback submitted successfully. Thank you.
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold"
              >
                Submit Feedback
              </button>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Guidelines</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <span className="text-cyan-300 font-semibold">Rating Guide:</span>
                <ul className="mt-2 space-y-1 text-xs ml-2">
                  <li>1 - Poor</li>
                  <li>2 - Below Average</li>
                  <li>3 - Average</li>
                  <li>4 - Good</li>
                  <li>5 - Excellent</li>
                </ul>
              </div>

              <div className="pt-3 border-t border-white/20">
                <span className="text-cyan-300 font-semibold">Tips:</span>
                <ul className="mt-2 space-y-1 text-xs ml-2">
                  <li>- Be specific and constructive</li>
                  <li>- Focus on improvements</li>
                  <li>- Keep it professional</li>
                  <li>- Be honest and fair</li>
                </ul>
              </div>

              <div className="pt-3 border-t border-white/20">
                <span className="text-cyan-300 font-semibold">Privacy:</span>
                <p className="mt-2 text-xs">Your feedback is confidential and helps improve the learning experience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackForm;
