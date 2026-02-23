import React, { useState, useEffect } from 'react';

export default function ViewClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://campus-management-system-production.up.railway.app/api/classes', {
        headers: { 'x-user-role': 'teacher' }
      });
      const data = await res.json();
      setClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setMessage('Error loading classes');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-white p-8 text-center">Loading classes...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">📚 My Classes</h1>
        <p className="text-cyan-200 mb-8">View and manage your assigned classes</p>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-300">
            {message}
          </div>
        )}

        {classes.length === 0 ? (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-white text-lg">No classes assigned yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {classes.map(cls => (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/50 rounded-lg p-6 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 transition"
              >
                <div className="text-4xl mb-3">📖</div>
                <h3 className="text-xl font-bold text-white mb-2">{cls.name}</h3>
                <p className="text-cyan-200 mb-3">{cls.subject}</p>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span>👥 {cls.students?.length || 0} Students</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Class Details Modal */}
        {selectedClass && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-lg p-8 w-full max-w-2xl border border-cyan-500/30">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedClass.name}</h2>
                  <p className="text-cyan-200">{selectedClass.subject}</p>
                </div>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="text-gray-300 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="bg-white/10 rounded p-4 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">📋 Class Information</h3>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Class ID:</strong> {selectedClass.id}</p>
                  <p><strong>Subject:</strong> {selectedClass.subject}</p>
                  <p><strong>Total Students:</strong> {selectedClass.students?.length || 0}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">👥 Enrolled Students</h3>
                {selectedClass.students && selectedClass.students.length > 0 ? (
                  <div className="bg-white/5 rounded p-4 max-h-64 overflow-y-auto">
                    <ul className="space-y-2">
                      {selectedClass.students.map((studentId, idx) => (
                        <li key={idx} className="text-gray-300 text-sm">
                          • {studentId}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No students enrolled</p>
                )}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setSelectedClass(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
