import { useEffect, useState } from 'react';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfileData = async () => {
    try {
      const stored = localStorage.getItem('campusUser');
      const currentUser = stored ? JSON.parse(stored) : null;
      const regNo = currentUser?.regNo || currentUser?.email?.split('@')[0] || (currentUser?.uid ? currentUser.uid.replace(/^mock_/, '') : null);

      if (!regNo) {
        setError('No logged-in student identifier found');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:4000/api/students/lookup/${encodeURIComponent(regNo)}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Student profile not found in database');
        } else {
          setError('Failed to fetch profile: ' + response.statusText);
        }
        return;
      }

      const foundStudent = await response.json();
      setStudent(foundStudent);
    } catch (err) {
      setError('Failed to fetch profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">👤 Student Profile</h1>

        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-400 text-center">{error}</div>
        ) : student ? (
          <>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-lg shadow-xl mb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-purple-600">
                  {student.name ? student.name.charAt(0) : 'S'}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white">{student.name || '—'}</h2>
                  <p className="text-purple-100 text-lg mt-2">Registration: {student.regNo || student.id || '—'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">📚 Academic Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Department</p>
                    <p className="text-white font-semibold">{student.department || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Year/Semester</p>
                    <p className="text-white font-semibold">Year {student.year || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Student ID</p>
                    <p className="text-white font-semibold">{student.id || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
                <h3 className="text-lg font-semibold text-indigo-400 mb-4">📞 Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold">{student.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-semibold">{student.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white font-semibold">{student.address || (student.department ? `Campus Hostel - ${student.department} Block` : '—')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
              <h3 className="text-lg font-semibold text-green-400 mb-4">ℹ️ Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700 p-4 rounded">
                  <p className="text-gray-400 text-sm mb-1">Fee Status</p>
                  <p className="text-green-400 font-bold text-lg">{student.feeStatus || 'Unknown'}</p>
                </div>
                <div className="bg-slate-700 p-4 rounded">
                  <p className="text-gray-400 text-sm mb-1">Enrollment Date</p>
                  <p className="text-white font-semibold">{student.enrollmentDate || '—'}</p>
                </div>
                <div className="bg-slate-700 p-4 rounded">
                  <p className="text-gray-400 text-sm mb-1">Academic Status</p>
                  <p className="text-green-400 font-bold text-lg">{student.academicStatus || 'Unknown'}</p>
                </div>
                <div className="bg-slate-700 p-4 rounded">
                  <p className="text-gray-400 text-sm mb-1">Hostel Status</p>
                  <p className="text-white font-semibold">{student.hostelStatus || '—'}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">📄 Important Documents</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2 transition">
                  📥 Download Admit Card
                </button>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center gap-2 transition">
                  📥 Download Fee Receipt
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded flex items-center gap-2 transition">
                  📥 Download Academic Calendar
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
