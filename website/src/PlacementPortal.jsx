import React, { useState, useEffect } from 'react';

function PlacementPortal({ user }) {
  const [placements, setPlacements] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const regNo = user?.regNo || (user?.email && user.email.split('@')[0]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:4000/api/placements').then(r => r.json()),
      regNo ? fetch(`http://localhost:4000/api/placements/applications/${regNo}`).then(r => r.json()) : Promise.resolve([])
    ])
    .then(([placementsData, applicationsData]) => {
      setPlacements(placementsData);
      setApplications(applicationsData);
      setLoading(false);
    })
    .catch(err => { console.error(err); setLoading(false); });
  }, [regNo]);

  const applyJob = async (placementId) => {
    try {
      const res = await fetch('http://localhost:4000/api/placements/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, placementId })
      });
      if (res.ok) {
        const data = await res.json();
        setApplications([...applications, data]);
        alert('Application submitted successfully.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Placement Portal</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">Stats</div>
            <div className="text-2xl font-bold text-cyan-300">{placements.length}</div>
            <p className="text-gray-300 text-sm">Active Drives</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">Applied</div>
            <div className="text-2xl font-bold text-green-300">{applications.length}</div>
            <p className="text-gray-300 text-sm">Applications Sent</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">Top</div>
            <div className="text-2xl font-bold text-yellow-300">N/A</div>
            <p className="text-gray-300 text-sm">Highest Package</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Available Drives */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Active Placement Drives</h2>
            <div className="space-y-4">
              {placements.map(placement => {
                const hasApplied = applications.some(app => app.placementId === placement.id);
                return (
                  <div key={placement.id} className="bg-white/5 p-4 rounded-lg">
                    <div className="font-bold text-white">{placement.companyName}</div>
                    <div className="text-sm text-gray-300 mt-2">
                      <div>Position: {placement.role}</div>
                      <div>Salary: {placement.salary}</div>
                      <div>Location: {placement.location}</div>
                      <div>Deadline: {placement.deadline}</div>
                    </div>
                    <button
                      onClick={() => applyJob(placement.id)}
                      disabled={hasApplied}
                      className={`mt-3 w-full px-4 py-2 rounded font-semibold transition ${
                        hasApplied 
                          ? 'bg-gray-500 text-white cursor-not-allowed'
                          : 'bg-cyan-600 text-white hover:bg-cyan-700'
                      }`}
                    >
                      {hasApplied ? '✅ Applied' : 'Apply Now'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Applications */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">My Applications</h2>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(app => {
                  const placement = placements.find(p => p.id === app.placementId);
                  return (
                    <div key={app.id} className="bg-green-600/10 border-l-4 border-green-500 p-4 rounded-lg">
                      <div className="font-bold text-green-300">{placement?.companyName}</div>
                      <div className="text-sm text-gray-300 mt-2">
                        <div>Position: {placement?.role}</div>
                        <div>Offered: {placement?.salary}</div>
                        <div className="text-xs text-gray-400 mt-2">Applied: {app.appliedAt}</div>
                      </div>
                      <span className="inline-block mt-3 px-3 py-1 bg-green-600/30 text-green-300 rounded-full text-sm font-semibold">
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400">No applications yet. Apply for placements above.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlacementPortal;
