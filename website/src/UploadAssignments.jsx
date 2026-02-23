import React, { useState, useEffect } from 'react';

export default function UploadAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignRes, subjectRes] = await Promise.all([
        fetch('http://localhost:4000/api/assignments', { headers: { 'x-user-role': 'teacher' } }),
        fetch('http://localhost:4000/api/subjects', { headers: { 'x-user-role': 'teacher' } })
      ]);
      const assignData = await assignRes.json();
      const subjectData = await subjectRes.json();
      setAssignments(assignData);
      setSubjects(subjectData);
      if (subjectData.length > 0 && !formData.subjectId) {
        setFormData(prev => ({ ...prev, subjectId: subjectData[0].id }));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setMessage('Error loading data');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.title || !formData.subjectId) {
      setMessage('Title and Subject are required');
      return;
    }

    try {
      if (editingId) {
        // Update existing
        await fetch(`http://localhost:4000/api/assignments/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': 'teacher'
          },
          body: JSON.stringify(formData)
        });
        setMessage('✓ Assignment updated successfully!');
      } else {
        // Create new
        await fetch('http://localhost:4000/api/assignments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': 'teacher'
          },
          body: JSON.stringify(formData)
        });
        setMessage('✓ Assignment created successfully!');
      }

      setFormData({ title: '', description: '', subjectId: subjects[0]?.id || '', dueDate: '' });
      setEditingId(null);
      setShowForm(false);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error:', err);
      setMessage('Error saving assignment');
    }
  };

  const handleEdit = (assignment) => {
    setFormData(assignment);
    setEditingId(assignment.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await fetch(`http://localhost:4000/api/assignments/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': 'teacher' }
      });
      setMessage('✓ Assignment deleted successfully!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error:', err);
      setMessage('Error deleting assignment');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', description: '', subjectId: subjects[0]?.id || '', dueDate: '' });
  };

  if (loading) {
    return <div className="text-white p-8 text-center">Loading assignments...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📎 Manage Assignments</h1>
            <p className="text-cyan-200">Upload and manage class assignments</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-cyan-600 text-white rounded font-semibold hover:bg-cyan-700 transition"
            >
              ➕ New Assignment
            </button>
          )}
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✓') ? 'bg-green-500/20 border border-green-500 text-green-300' : 'bg-red-500/20 border border-red-500 text-red-300'}`}>
            {message}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? '✏️ Edit Assignment' : '📝 Create New Assignment'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white font-semibold block mb-2">📌 Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Assignment title"
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2">📚 Subject</label>
                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                  required
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white font-semibold block mb-2">📝 Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Assignment details and instructions"
                  rows="4"
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2">📅 Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded font-semibold hover:bg-cyan-700 transition"
                >
                  {editingId ? '💾 Update Assignment' : '➕ Create Assignment'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Assignments List */}
        {assignments.length === 0 ? (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-white text-lg">No assignments yet</p>
            <p className="text-gray-400 text-sm mt-2">Create your first assignment to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map(assignment => {
              const subject = subjects.find(s => s.id === assignment.subjectId);
              const dueDate = assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date';
              return (
                <div key={assignment.id} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{assignment.title}</h3>
                      <p className="text-cyan-200 text-sm mt-1">
                        📚 {subject?.name} ({subject?.code}) • 📅 Due: {dueDate}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  {assignment.description && (
                    <p className="text-gray-300 mt-3">{assignment.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
