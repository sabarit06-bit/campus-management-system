import React, { useState, useEffect } from 'react';

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '09:00',
    location: '',
    type: 'event',
    image: '📢'
  });

  const eventTypes = [
    { key: 'seminar', label: 'Seminar', icon: '🎤' },
    { key: 'workshop', label: 'Workshop', icon: '🛠️' },
    { key: 'festival', label: 'Festival', icon: '🎉' },
    { key: 'competition', label: 'Competition', icon: '🏆' },
    { key: 'sports', label: 'Sports', icon: '⚽' },
    { key: 'event', label: 'General Event', icon: '📢' }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('campusUser');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
    }
    fetchEvents();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.location) {
      alert('Please fill in title, date, and location');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:4000/api/events/${editingId}`
        : 'http://localhost:4000/api/events';

      const payload = {
        ...formData,
        userRole: user?.role || 'teacher',
        userId: user?.regNo || user?.uid,
        userName: user?.displayName || 'Unknown',
        userEmail: user?.email || 'unknown@campus.local'
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        alert('Error: ' + error.error);
        return;
      }

      await fetchEvents();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', date: '', time: '09:00', location: '', type: 'event', image: '📢' });
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Failed to save event: ' + err.message);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      image: event.image
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRole: user?.role || 'admin' })
      });

      if (!res.ok) {
        const error = await res.json();
        alert('Error: ' + error.error);
        return;
      }

      await fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const options = { weekday: 'short', day: 'numeric', month: 'short' };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📢 Event Management</h1>
            <p className="text-cyan-200">Create and manage upcoming campus events</p>
          </div>
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({ title: '', description: '', date: '', time: '09:00', location: '', type: 'event', image: '📢' });
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              + New Event
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Event' : 'Create New Event'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Tech Fest 2026"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Event Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {eventTypes.map(t => (
                      <option key={t.key} value={t.key}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Event details and information..."
                  rows="4"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Icon</label>
                  <select
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="📢">📢 Announcement</option>
                    <option value="🎤">🎤 Seminar</option>
                    <option value="🛠️">🛠️ Workshop</option>
                    <option value="🎉">🎉 Festival</option>
                    <option value="🏆">🏆 Competition</option>
                    <option value="⚽">⚽ Sports</option>
                    <option value="💼">💼 Professional</option>
                    <option value="🤖">🤖 Tech</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Main Auditorium, Lab 301"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  {editingId ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">All Events ({events.length})</h2>
          
          {events.length === 0 ? (
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 text-center">
              <div className="text-4xl mb-2 opacity-50">📭</div>
              <p className="text-gray-300">No events created yet</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">{event.image}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                        <span className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded">{event.type}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{event.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="text-gray-400">📅 {formatDate(event.date)}</div>
                      <div className="text-gray-400">⏰ {event.time}</div>
                      <div className="text-gray-400">📍 {event.location}</div>
                      <div className="text-gray-400">👤 {event.postedByName}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition text-sm font-semibold"
                    >
                      ✏️ Edit
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition text-sm font-semibold"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
