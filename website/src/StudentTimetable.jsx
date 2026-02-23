import { useState, useEffect } from 'react';

export default function StudentTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('campusUser') || '{}');
    const regNo = user.regNo;

    if (regNo) {
      fetch(`http://localhost:4000/api/timetable/student/${regNo}`)
        .then(res => res.json())
        .then(data => {
          setTimetable(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching timetable:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getColorForSubject = (subject) => {
    const colors = {
      'ITIL': 'bg-blue-600',
      'IOT': 'bg-purple-600',
      'CC': 'bg-indigo-600',
      'NLP': 'bg-yellow-600',
      'CRM': 'bg-orange-600',
      'Project': 'bg-red-600',
      'ServiceNow Lab': 'bg-slate-600',
      'IPR': 'bg-lime-600'
    };
    return colors[subject] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading timetable...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">📅 Weekly Timetable</h1>

        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.map(day => (
              <div key={day} className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-purple-400 pb-2">{day}</h3>
                <div className="space-y-3">
                  {timetable
                    .filter(t => t.day === day)
                    .map((session, idx) => (
                      <div key={idx} className={`${getColorForSubject(session.subject)} p-3 rounded text-white text-sm`}>
                        <p className="font-bold">{session.startTime}-{session.endTime}</p>
                        <p className="text-xs mt-1 font-semibold">{session.subject}</p>
                        <p className="text-xs opacity-90">{session.room}</p>
                        <p className="text-xs opacity-75">👤 {session.teacher}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-slate-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4">📝 Subject Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="text-gray-300"><span className="inline-block w-3 h-3 bg-blue-600 mr-2 rounded"></span>ITIL - IT Infrastructure Library</div>
            <div className="text-gray-300"><span className="inline-block w-3 h-3 bg-purple-600 mr-2 rounded"></span>IOT - Internet of Things</div>
            <div className="text-gray-300"><span className="inline-block w-3 h-3 bg-indigo-600 mr-2 rounded"></span>CC - Cloud Computing</div>
            <div className="text-gray-300"><span className="inline-block w-3 h-3 bg-yellow-600 mr-2 rounded"></span>NLP - Natural Language Processing</div>
            <div className="text-gray-300"><span className="inline-block w-3 h-3 bg-orange-600 mr-2 rounded"></span>CRM - Customer Relationship Management</div>
            <div className="text-gray-300"><span className="inline-block w-3 h-3 bg-red-600 mr-2 rounded"></span>Project - Project Work</div>
            <div className="text-gray-300"><span className="inline-block w-3 h-3 bg-slate-600 mr-2 rounded"></span>ServiceNow Lab - ServiceNow Platform</div>
            <div className="text-gray-300"><span className="inline-block w-3 h-3 bg-lime-600 mr-2 rounded"></span>IPR - Intellectual Property Rights</div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-600">
            <h4 className="text-md font-semibold text-white mb-2">👨‍🏫 Faculty</h4>
            <p className="text-gray-400 text-xs">PE • RS/MS • PD • VS • BS • AN • SV • MS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
