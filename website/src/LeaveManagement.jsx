import React, { useState, useEffect } from 'react';

function LeaveManagement({ user }) {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: 'sick',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetch('https://campus-management-system-production.up.railway.app/api/leaves')
      .then(res => res.json())
      .then(data => setLeaves(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('https://campus-management-system-production.up.railway.app/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.regNo || user?.email?.split('@')[0],
          userRole: user?.role || 'student',
          ...formData
        })
      });
      if (res.ok) {
        const data = await res.json();
        setLeaves([...leaves, data]);
        setFormData({ leaveType: 'sick', startDate: '', endDate: '', reason: '' });
        alert('Leave request submitted.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const userLeaves = leaves.filter(l => l.userId === (user?.regNo || user?.email?.split('@')[0]));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Leave Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="md:col-span-1 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Apply Leave</h2>
            <div className="space-y-3">
              <label className="text-white text-sm">
                Type:
                <select
                  value={formData.leaveType}
                  onChange={e => setFormData({...formData, leaveType: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="emergency">Emergency Leave</option>
                </select>
              </label>
              <label className="text-white text-sm">
                Start Date:
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </label>
              <label className="text-white text-sm">
                End Date:
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </label>
              <label className="text-white text-sm">
                Reason:
                <textarea
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  placeholder="Brief reason for leave"
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-20"
                />
              </label>
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Submit Request
              </button>
            </div>
          </div>

          {/* Leave History */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">My Leave Requests</h2>
            {userLeaves.length > 0 ? (
              <div className="space-y-3">
                {userLeaves.map(leave => (
                  <div key={leave.id} className="bg-white/5 p-4 rounded-lg border-l-4 border-cyan-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-white capitalize">{leave.leaveType} Leave</div>
                        <div className="text-sm text-gray-300">{leave.startDate} to {leave.endDate}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        leave.status === 'approved' ? 'bg-green-600/30 text-green-300' :
                        leave.status === 'rejected' ? 'bg-red-600/30 text-red-300' :
                        'bg-yellow-600/30 text-yellow-300'
                      }`}>
                        {leave.status?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">Reason: {leave.reason}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No leave requests yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveManagement;
