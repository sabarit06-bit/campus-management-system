import React, { useState, useEffect } from 'react';

function ComplaintSystem({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'academic'
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('https://campus-management-system-production.up.railway.app/api/complaints')
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!formData.subject.trim() || !formData.description.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('https://campus-management-system-production.up.railway.app/api/complaints', {
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
        setComplaints([...complaints, data]);
        setFormData({ subject: '', description: '', category: 'academic' });
        setShowForm(false);
        alert('Complaint filed successfully.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'administration', label: 'Administration' },
    { value: 'facilities', label: 'Facilities' }
  ];

  const userComplaints = complaints.filter(c => c.userId === (user?.regNo || user?.email?.split('@')[0]));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Grievance and Complaint System</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {showForm ? 'Cancel' : '+ File Complaint'}
          </button>
        </div>

        {/* Complaint Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">File Complaint</h2>
            <div className="space-y-4">
              <label className="text-white text-sm">
                Category:
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-white text-sm">
                Subject:
                <input
                  type="text"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  placeholder="Brief subject of complaint"
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </label>
              <label className="text-white text-sm">
                Description:
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of your complaint"
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-28"
                />
              </label>
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Submit Complaint
              </button>
            </div>
          </div>
        )}

        {/* Complaints List */}
        <div className="space-y-4">
          {userComplaints.length > 0 ? (
            userComplaints.map(complaint => (
              <div key={complaint.id} className={`bg-white/10 backdrop-blur border-l-4 rounded-lg p-6 ${
                complaint.status === 'open' ? 'border-yellow-500 border-l-yellow-500' :
                complaint.status === 'resolved' ? 'border-green-500 border-l-green-500' :
                'border-red-500 border-l-red-500'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{complaint.subject}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    complaint.status === 'open' ? 'bg-yellow-600/30 text-yellow-300' :
                    complaint.status === 'resolved' ? 'bg-green-600/30 text-green-300' :
                    'bg-red-600/30 text-red-300'
                  }`}>
                    {complaint.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-300 mb-3">{complaint.description}</p>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Category: {complaint.category}</span>
                  <span>Filed: {complaint.filedAt}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-12 text-center">
              <p className="text-gray-400">No complaints filed yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintSystem;
