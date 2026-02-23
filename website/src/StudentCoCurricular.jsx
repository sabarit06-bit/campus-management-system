import { useState, useEffect } from 'react';

export default function StudentCoCurricular() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'NSS', 'NCC', 'Art', 'Sports', 'Dance'];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('campusUser') || '{}');
    const regNo = user.regNo;

    if (regNo) {
      fetch(`http://localhost:4000/api/activities/student/${regNo}`)
        .then(res => res.json())
        .then(data => {
          setActivities(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching activities:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);
  const filteredActivities = filter === 'All' ? activities : activities.filter(a => a.category === filter);

  const getCategoryColor = (category) => {
    const colors = {
      'NSS': 'bg-green-600',
      'NCC': 'bg-blue-600',
      'Art': 'bg-purple-600',
      'Sports': 'bg-red-600',
      'Dance': 'bg-pink-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🏆 Co-Curricular Activities</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Total Activities</p>
            <p className="text-4xl font-bold text-white">{activities.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Total Points Earned</p>
            <p className="text-4xl font-bold text-white">{totalPoints}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-200 mb-2">Categories Participated</p>
            <p className="text-4xl font-bold text-white">{new Set(activities.map(a => a.category)).size}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === cat
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <div key={activity.id} className="bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition border-l-4 border-purple-500">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`${getCategoryColor(activity.category)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        {activity.category}
                      </span>
                      <h3 className="text-xl font-bold text-white">{activity.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-gray-400 text-sm mt-2">
                      <span>📅 {new Date(activity.date).toLocaleDateString()}</span>
                      <span>🎖️ {activity.award}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-6 py-3 rounded-lg text-center">
                    <p className="text-sm font-semibold">Points</p>
                    <p className="text-2xl font-bold">{activity.points}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No activities found in this category
            </div>
          )}
        </div>

        {/* Achievement Levels */}
        <div className="mt-12 bg-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">🎯 Achievement Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg text-center ${totalPoints >= 50 ? 'bg-green-600' : 'bg-slate-700'}`}>
              <p className="text-yellow-300 font-bold text-lg">⭐ Gold</p>
              <p className="text-white text-sm mt-2">50+ Points</p>
              <p className={totalPoints >= 50 ? 'text-white font-bold text-2xl' : 'text-gray-500'}>{totalPoints}/50</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${totalPoints >= 30 ? 'bg-gray-400' : 'bg-slate-700'}`}>
              <p className="text-gray-700 font-bold text-lg">⭐ Silver</p>
              <p className="text-white text-sm mt-2">30-49 Points</p>
              <p className={totalPoints >= 30 && totalPoints < 50 ? 'text-white font-bold text-2xl' : 'text-gray-500'}>{Math.min(totalPoints, 49)}/49</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${totalPoints >= 20 ? 'bg-orange-600' : 'bg-slate-700'}`}>
              <p className="text-yellow-100 font-bold text-lg">⭐ Bronze</p>
              <p className="text-white text-sm mt-2">20-29 Points</p>
              <p className={totalPoints >= 20 && totalPoints < 30 ? 'text-white font-bold text-2xl' : 'text-gray-500'}>{Math.min(totalPoints, 29)}/29</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${totalPoints > 0 ? 'bg-blue-600' : 'bg-slate-700'}`}>
              <p className="text-white font-bold text-lg">⭐ Participant</p>
              <p className="text-white text-sm mt-2">1-19 Points</p>
              <p className={totalPoints > 0 && totalPoints < 20 ? 'text-white font-bold text-2xl' : 'text-gray-500'}>{Math.min(totalPoints, 19)}/19</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
