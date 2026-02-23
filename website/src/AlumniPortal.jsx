import React from 'react';

function AlumniPortal() {
  const alumni = [];
  const events = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Alumni Portal</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-cyan-300">0</div>
            <p className="text-gray-300 text-sm">Active Alumni</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-300">0</div>
            <p className="text-gray-300 text-sm">Upcoming Events</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-yellow-300">0</div>
            <p className="text-gray-300 text-sm">Companies Represented</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 text-center">
          <p className="text-gray-300">No alumni data available yet. Add alumni records in the future.</p>
        </div>
      </div>
    </div>
  );
}

export default AlumniPortal;
