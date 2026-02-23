import React, { useState, useEffect } from 'react';

function Forum({ user }) {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetch('https://campus-management-system-production.up.railway.app/api/forum/topics')
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    try {
      const res = await fetch('https://campus-management-system-production.up.railway.app/api/forum/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          author: user?.regNo || user?.email?.split('@')[0],
          content: formData.content
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTopics([...topics, data]);
        setFormData({ title: '', content: '' });
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Discussion Forum</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
          >
            {showForm ? 'Cancel' : '+ New Topic'}
          </button>
        </div>

        {/* New Topic Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 mb-8">
            <input
              type="text"
              placeholder="Topic Title"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <textarea
              placeholder="What's on your mind?"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 mb-4 h-24 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Post Topic
            </button>
          </div>
        )}

        {/* Topics List */}
        <div className="space-y-4">
          {topics.map(topic => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/30 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white flex-1">{topic.title}</h3>
                <span className="text-xs bg-cyan-600/30 text-cyan-300 px-2 py-1 rounded">Views: {topic.views}</span>
              </div>
              <p className="text-gray-300 mb-3">{topic.content.substring(0, 100)}...</p>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>Author: {topic.author}</span>
                <span>Replies: {topic.replies}</span>
                <span>Date: {topic.createdAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Topic Detail Modal */}
        {selectedTopic && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e1b4b] border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedTopic.title}</h2>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-2xl text-white hover:text-red-400 transition"
                >
                  X
                </button>
              </div>
              <p className="text-gray-300 mb-4">{selectedTopic.content}</p>
              <div className="text-sm text-gray-400 mb-4">
                <span className="block">Posted by: {selectedTopic.author}</span>
                <span className="block">Date: {selectedTopic.createdAt}</span>
              </div>
              <div className="bg-white/5 border-t border-white/20 pt-4">
                <p className="text-gray-300">Replies: {selectedTopic.replies}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Forum;
