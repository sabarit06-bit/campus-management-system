import { useState, useEffect } from 'react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    regNo: '',
    name: '',
    role: 'Student',
    status: 'Active',
    email: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [studentsRes, teachersRes] = await Promise.all([
          fetch('http://localhost:4000/api/students'),
          fetch('http://localhost:4000/api/teachers')
        ]);
        
        const students = await studentsRes.json();
        const teachers = await teachersRes.json();
        
        const combinedUsers = [
          ...students.map(s => ({
            id: s.id,
            regNo: s.regNo,
            name: s.name,
            role: 'Student',
            status: 'Active',
            email: s.email || 'N/A',
            joinDate: new Date().toLocaleDateString('en-GB')
          })),
          ...teachers.map(t => ({
            id: 100 + t.id,
            regNo: t.regNo,
            name: t.name,
            role: 'Teacher',
            status: 'Active',
            email: t.email || 'N/A',
            joinDate: new Date().toLocaleDateString('en-GB')
          }))
        ];
        
        setUsers(combinedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ ...user });
  };

  const handleSaveEdit = () => {
    setUsers(users.map(u => u.id === editingId ? editForm : u));
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddUser = () => {
    if (newUser.regNo && newUser.name && newUser.email) {
      setUsers([...users, {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...newUser,
        joinDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
      }]);
      setNewUser({ regNo: '', name: '', role: 'Student', status: 'Active', email: '' });
      setShowAddForm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDeleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleRolePermissions = (role) => {
    const permissions = {
      Admin: ['View All', 'Edit All', 'Delete Users', 'System Settings', 'Reports', 'Batch Operations'],
      Teacher: ['View Classes', 'Mark Attendance', 'Enter Marks', 'Upload Assignments', 'View Reports'],
      Student: ['View Profile', 'View Attendance', 'View Marks', 'View Timetable', 'Co-Curricular']
    };
    return permissions[role] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">👥 User Management</h1>

        {loading && (
          <div className="mb-6 p-4 bg-blue-600/30 border border-blue-500 rounded-lg text-blue-400 font-semibold">
            ⏳ Loading users from database...
          </div>
        )}

        {saved && (
          <div className="mb-6 p-4 bg-green-600/30 border border-green-500 rounded-lg text-green-400 font-semibold">
            ✓ Changes saved successfully!
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600 p-6 rounded-lg shadow-lg">
            <p className="text-blue-100 mb-2">Total Users</p>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-green-600 p-6 rounded-lg shadow-lg">
            <p className="text-green-100 mb-2">Active Users</p>
            <p className="text-3xl font-bold text-white">{users.filter(u => u.status === 'Active').length}</p>
          </div>
          <div className="bg-orange-600 p-6 rounded-lg shadow-lg">
            <p className="text-orange-100 mb-2">Inactive Users</p>
            <p className="text-3xl font-bold text-white">{users.filter(u => u.status === 'Inactive').length}</p>
          </div>
          <div className="bg-purple-600 p-6 rounded-lg shadow-lg">
            <p className="text-purple-100 mb-2">By Role</p>
            <p className="text-sm text-white">
              👤{users.filter(u => u.role === 'Student').length} | 👨‍🏫{users.filter(u => u.role === 'Teacher').length} | ⚙️{users.filter(u => u.role === 'Admin').length}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">Search Users</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, Registration #, Email..."
                className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-2">Filter by Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
              >
                ➕ Add New User
              </button>
            </div>
          </div>

          {/* Add User Form */}
          {showAddForm && (
            <div className="mt-4 p-4 bg-slate-700 rounded border border-green-500">
              <h3 className="text-white font-bold mb-4">Add New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input
                  type="text"
                  placeholder="Registration #"
                  value={newUser.regNo}
                  onChange={(e) => setNewUser({ ...newUser, regNo: e.target.value })}
                  className="bg-slate-600 text-white px-3 py-2 rounded border border-gray-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="bg-slate-600 text-white px-3 py-2 rounded border border-gray-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-slate-600 text-white px-3 py-2 rounded border border-gray-500 focus:outline-none"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="bg-slate-600 text-white px-3 py-2 rounded border border-gray-500 focus:outline-none"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
                <button
                  onClick={handleAddUser}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
                >
                  Save User
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl overflow-x-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Showing {filteredUsers.length} Users</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-500">
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Reg #</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Join Date</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                  {editingId === user.id ? (
                    <>
                      <td className="px-4 py-3">{user.regNo}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-slate-700 text-white px-2 py-1 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full bg-slate-700 text-white px-2 py-1 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="bg-slate-700 text-white px-2 py-1 rounded"
                        >
                          <option value="Student">Student</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="bg-slate-700 text-white px-2 py-1 rounded"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-4 py-3"><span className="text-gray-400">{user.joinDate}</span></td>
                      <td className="px-4 py-3">
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-gray-300">{user.regNo}</td>
                      <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-gray-300">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${
                          user.role === 'Admin' ? 'bg-red-600' :
                          user.role === 'Teacher' ? 'bg-blue-600' :
                          'bg-green-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${
                          user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{user.joinDate}</td>
                      <td className="px-4 py-3 space-x-2 flex">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Role Permissions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {['Admin', 'Teacher', 'Student'].map(role => (
            <div key={role} className="bg-slate-800 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">{
                role === 'Admin' ? '⚙️' :
                role === 'Teacher' ? '👨‍🏫' :
                '👤'
              } {role} Permissions</h3>
              <ul className="space-y-2">
                {handleRolePermissions(role).map((perm, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-300">
                    <span className="text-purple-400">✓</span> {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
