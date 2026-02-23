import { useState, useEffect } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('unread');
  const [searchTerm, setSearchTerm] = useState('');

  const user = JSON.parse(localStorage.getItem('campusUser') || '{}');
  const regNo = user.regNo;

  useEffect(() => {
    if (regNo) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [regNo]);

  const fetchNotifications = () => {
    fetch(`http://localhost:4000/api/notifications/student/${regNo}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching notifications:', err);
        setLoading(false);
      });
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'announcement': return '📢';
      case 'alert': return '⚠️';
      case 'message': return '💬';
      default: return '🔔';
    }
  };

  const getTypeBg = (type) => {
    switch(type) {
      case 'announcement': return 'bg-blue-900/50 border-blue-500';
      case 'alert': return 'bg-red-900/50 border-red-500';
      case 'message': return 'bg-green-900/50 border-green-500';
      default: return 'bg-gray-900/50 border-gray-500';
    }
  };

  const getPriorityBg = (priority) => {
    return priority === 'high' ? 'bg-red-600' : priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600';
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesRead = filterRead === 'all' || (filterRead === 'unread' ? !notif.read : notif.read);
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesRead && matchesSearch;
  });

  const handleMarkAsRead = (id) => {
    fetch(`http://localhost:4000/api/notifications/${id}/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: regNo })
    })
      .then(() => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      })
      .catch(err => console.error('Error marking as read:', err));
  };

  const handleMarkAsUnread = (id) => {
    fetch(`http://localhost:4000/api/notifications/${id}/mark-unread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: regNo })
    })
      .then(() => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: false } : n));
      })
      .catch(err => console.error('Error marking as unread:', err));
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    Promise.all(
      unreadNotifications.map(notif =>
        fetch(`http://localhost:4000/api/notifications/${notif.id}/mark-read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: regNo })
        })
      )
    )
      .then(() => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      })
      .catch(err => console.error('Error marking all as read:', err));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading notifications...</div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">🔔 Notifications Center</h1>
        <p className="text-gray-300 mb-8">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600 p-4 rounded-lg shadow-lg">
            <p className="text-blue-100 text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{notifications.length}</p>
          </div>
          <div className="bg-red-600 p-4 rounded-lg shadow-lg">
            <p className="text-red-100 text-sm">Unread</p>
            <p className="text-2xl font-bold text-white">{unreadCount}</p>
          </div>
          <div className="bg-purple-600 p-4 rounded-lg shadow-lg">
            <p className="text-purple-100 text-sm">High Priority</p>
            <p className="text-2xl font-bold text-white">{notifications.filter(n => n.priority === 'high').length}</p>
          </div>
          <div className="bg-green-600 p-4 rounded-lg shadow-lg">
            <p className="text-green-100 text-sm">Read</p>
            <p className="text-2xl font-bold text-white">{notifications.filter(n => n.read).length}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">Search Notifications</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or message..."
                className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-2">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="all">All Types</option>
                <option value="announcement">📢 Announcements</option>
                <option value="alert">⚠️ Alerts</option>
                <option value="message">💬 Messages</option>
              </select>
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-2">Filter by Status</label>
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="all">All</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleMarkAllAsRead}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                ✓ Mark All Read
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                className={`${getTypeBg(notif.type)} border-2 rounded-lg p-6 transition-all hover:shadow-lg ${
                  !notif.read ? 'shadow-md shadow-purple-500/50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-3xl">{getTypeIcon(notif.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{notif.title}</h3>
                        <span className={`px-3 py-1 rounded text-xs font-semibold text-white ${getPriorityBg(notif.priority)}`}>
                          {notif.priority.toUpperCase()}
                        </span>
                        {!notif.read && (
                          <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">NEW</span>
                        )}
                      </div>
                      <p className="text-gray-200 mb-3">{notif.message}</p>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span>📅 {new Date(notif.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <span>👤 {notif.sender}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    {notif.read && (
                      <button
                        onClick={() => handleMarkAsUnread(notif.id)}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition"
                        title="Mark as unread"
                      >
                        ↺
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-800 border-2 border-slate-600 rounded-lg p-8 text-center">
              <p className="text-gray-300 text-lg">No notifications found</p>
              <p className="text-gray-500 text-sm mt-2">You're all set! Check back later for updates.</p>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-white mb-3">💡 Notification Tips</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>✓ High priority notifications require immediate attention</li>
            <li>✓ Mark notifications as read once you've reviewed them</li>
            <li>✓ Search to quickly find specific notifications</li>
            <li>✓ Use filters to organize your notifications by type and status</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
