import React, { useEffect, useState } from 'react';

function Messaging({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentId = user?.regNo || user?.email?.split('@')[0];

  useEffect(() => {
    if (!currentId) return;

    Promise.all([
      fetch('http://localhost:4000/api/teachers').then(res => res.json()),
      fetch('http://localhost:4000/api/students').then(res => res.json())
    ])
      .then(([teachersData, studentsData]) => {
        const teacherContacts = (teachersData || []).map(t => ({
          id: t.regNo,
          name: t.name,
          role: 'Teacher'
        }));
        const studentContacts = (studentsData || []).map(s => ({
          id: s.regNo,
          name: s.name,
          role: 'Student'
        }));
        const allContacts = [...teacherContacts, ...studentContacts].filter(c => c.id !== currentId);
        setContacts(allContacts);
      })
      .catch(err => console.error(err));
  }, [currentId]);

  useEffect(() => {
    if (!selectedUser || !currentId) return;
    fetch(`http://localhost:4000/api/messages/${currentId}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error(err));
  }, [selectedUser, currentId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentId) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentId,
          receiverId: selectedUser,
          message: newMessage,
          timestamp: new Date().toISOString()
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data]);
        setNewMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const visibleMessages = messages.filter(m =>
    (m.senderId === currentId && m.receiverId === selectedUser) ||
    (m.senderId === selectedUser && m.receiverId === currentId)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[600px]">
          {/* Contacts */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4">
            <h2 className="text-lg font-bold text-white mb-4">Contacts</h2>
            {contacts.length === 0 ? (
              <p className="text-sm text-gray-400">No contacts available yet.</p>
            ) : (
              <div className="space-y-2">
                {contacts.map(contact => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => setSelectedUser(contact.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedUser === contact.id
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold">{contact.name}</div>
                    <div className="text-xs opacity-70">{contact.role} - {contact.id}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 flex flex-col">
            {selectedUser ? (
              <>
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {visibleMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === currentId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          msg.senderId === currentId ? 'bg-cyan-600 text-white' : 'bg-white/20 text-white'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition disabled:bg-gray-500"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a contact to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messaging;
