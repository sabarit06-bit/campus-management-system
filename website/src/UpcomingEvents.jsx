import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/events');
        const data = await res.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = filterType === 'all' ? events : events.filter(e => e.type === filterType);
  
  const eventTypes = [
    { key: 'all', label: 'All Events', icon: '📢' },
    { key: 'seminar', label: 'Seminars', icon: '🎤' },
    { key: 'workshop', label: 'Workshops', icon: '🛠️' },
    { key: 'festival', label: 'Festivals', icon: '🎉' },
    { key: 'competition', label: 'Competitions', icon: '🏆' },
    { key: 'sports', label: 'Sports', icon: '⚽' }
  ];

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">📢 Upcoming Events</h1>
          <p className="text-cyan-200">Stay updated with all campus events and activities</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {eventTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setFilterType(type.key)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterType === type.key
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-white/10 backdrop-blur border border-white/20 text-cyan-300 hover:bg-white/20'
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full bg-white/10 backdrop-blur border border-white/20 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4 opacity-50">📭</div>
              <p className="text-gray-300 text-lg">No events found</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 hover:shadow-lg transition cursor-pointer group" onClick={() => setSelectedEvent(event)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{event.image}</div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500">
                    {event.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition">{event.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{formatDate(event.date)} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👤</span>
                    <span>Posted by {event.postedByName}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{selectedEvent.image}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{selectedEvent.title}</h2>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500">
                      {selectedEvent.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">📝 Description</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">📅 Date</div>
                    <div className="text-cyan-300 font-semibold text-lg">{formatDate(selectedEvent.date)}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">⏰ Time</div>
                    <div className="text-cyan-300 font-semibold text-lg">{selectedEvent.time}</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">📍 Location</div>
                  <div className="text-cyan-300 font-semibold text-lg">{selectedEvent.location}</div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">👤 Posted by</div>
                  <div className="text-cyan-300 font-semibold">{selectedEvent.postedByName}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {new Date(selectedEvent.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                    Mark as Interested
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Event Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{events.length}</div>
              <div className="text-gray-300 text-sm">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{events.filter(e => e.type === 'seminar').length}</div>
              <div className="text-gray-300 text-sm">Seminars</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{events.filter(e => e.type === 'workshop').length}</div>
              <div className="text-gray-300 text-sm">Workshops</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{events.filter(e => e.type === 'competition').length}</div>
              <div className="text-gray-300 text-sm">Competitions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{events.filter(e => e.type === 'sports').length}</div>
              <div className="text-gray-300 text-sm">Sports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
