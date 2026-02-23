import React, { useState, useEffect } from 'react';

export default function AcademicCalendar() {
  const [calendar, setCalendar] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch('https://campus-management-system-production.up.railway.app/api/calendar');
        const data = await res.json();
        setCalendar(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching calendar:', err);
        setLoading(false);
      }
    };
    fetchCalendar();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading calendar...</div>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
        <div className="max-w-6xl mx-auto text-white text-center">
          <p>Failed to load calendar</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  const getExamTypeColor = (type) => {
    return type === 'midterm' ? 'text-blue-300' : 'text-orange-300';
  };

  const getHolidayTypeColor = (type) => {
    return type === 'national' ? 'text-red-300' : 'text-purple-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">📅 Academic Calendar</h1>
          <p className="text-cyan-200">Academic Year: {calendar.year}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {['overview', 'semesters', 'exams', 'holidays', 'dates'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-white/10 backdrop-blur border border-white/20 text-cyan-300 hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {calendar.semesters.map((sem) => (
                <div key={sem.id} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{sem.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      sem.status === 'ongoing' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {sem.status.charAt(0).toUpperCase() + sem.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Start Date:</span>
                      <span className="text-cyan-300 font-semibold">{formatDate(sem.startDate)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>End Date:</span>
                      <span className="text-cyan-300 font-semibold">{formatDate(sem.endDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">📊 Quick Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{calendar.exams.length}</div>
                  <div className="text-gray-300">Exams</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{calendar.holidays.length}</div>
                  <div className="text-gray-300">Holidays</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">{calendar.importantDates.length}</div>
                  <div className="text-gray-300">Important Dates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{calendar.semesters.length}</div>
                  <div className="text-gray-300">Semesters</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Semesters Tab */}
        {activeTab === 'semesters' && (
          <div className="space-y-4">
            {calendar.semesters.map((sem) => (
              <div key={sem.id} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{sem.name}</h3>
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    sem.status === 'ongoing' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500'
                  }`}>
                    {sem.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">📅 Start Date</div>
                    <div className="text-cyan-300 font-semibold text-lg">{formatDate(sem.startDate)}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">📅 End Date</div>
                    <div className="text-cyan-300 font-semibold text-lg">{formatDate(sem.endDate)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div className="space-y-4">
            {calendar.exams.map((exam) => (
              <div key={exam.id} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">🎓 {exam.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    exam.type === 'midterm' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500'
                      : 'bg-orange-500/20 text-orange-300 border border-orange-500'
                  }`}>
                    {exam.type === 'midterm' ? 'Mid-Term' : 'End-Term'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-gray-400 text-xs mb-1">START</div>
                    <div className="text-cyan-300 font-semibold">{formatDate(exam.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">END</div>
                    <div className="text-cyan-300 font-semibold">{formatDate(exam.endDate)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">SEMESTER</div>
                    <div className="text-cyan-300 font-semibold">{exam.semester.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Holidays Tab */}
        {activeTab === 'holidays' && (
          <div className="space-y-4">
            {calendar.holidays.map((holiday) => (
              <div key={holiday.id} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">🎉 {holiday.name}</h3>
                    <div className={`text-sm font-semibold mt-2 ${getHolidayTypeColor(holiday.type)}`}>
                      {holiday.type === 'national' ? '🇮🇳 National Holiday' : '🎭 Festival'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-300 font-semibold text-lg">{formatDate(holiday.date)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Important Dates Tab */}
        {activeTab === 'dates' && (
          <div className="space-y-4">
            {calendar.importantDates.map((date) => (
              <div key={date.id} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">⏰ {date.name}</h3>
                    <div className="text-gray-300 text-sm mt-2">
                      Semester: <span className="text-cyan-300 font-semibold">{date.semester.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-300 font-semibold text-lg">{formatDate(date.date)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Info */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">💡 Quick Info</h3>
          <div className="text-gray-300 space-y-2">
            <p>• Current Semester: <span className="text-cyan-300 font-semibold">Semester 2 (Dec 2, 2025 - Apr 30, 2026)</span></p>
            <p>• Next Exam: <span className="text-cyan-300 font-semibold">Semester 2 End-Term (Apr 10-28, 2026)</span></p>
            <p>• Upcoming Holiday: <span className="text-cyan-300 font-semibold">Holi (Mar 25, 2026)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
