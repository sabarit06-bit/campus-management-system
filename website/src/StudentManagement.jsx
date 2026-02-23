import { useState, useEffect } from 'react';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", regNo: "", department: "", year: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", regNo: "", department: "", year: "" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load students.");
        setLoading(false);
      });
  }, []);

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify(addForm)
      });
      if (!res.ok) {
        const data = await res.json();
        setAddError(data.error || "Failed to add student.");
      } else {
        const newStu = await res.json();
        setStudents((prev) => [...prev, newStu]);
        setShowAdd(false);
        setAddForm({ name: "", regNo: "", department: "", year: "" });
      }
    } catch {
      setAddError("Failed to add student.");
    }
    setAddLoading(false);
  };

  const handleEditClick = (stu) => {
    setEditId(stu.id);
    setEditForm({ name: stu.name, regNo: stu.regNo, department: stu.department, year: stu.year });
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/students/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error || "Failed to update student.");
      } else {
        const updated = await res.json();
        setStudents((prev) => prev.map((s) => (s.id === editId ? updated : s)));
        setEditId(null);
      }
    } catch {
      setEditError("Failed to update student.");
    }
    setEditLoading(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteError("");
  };

  const handleDeleteStudent = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`http://localhost:4000/api/students/${deleteId}`, {
        method: "DELETE",
        headers: {
          "x-user-role": "admin"
        }
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete student.");
      } else {
        setStudents((prev) => prev.filter((s) => s.id !== deleteId));
        setDeleteId(null);
      }
    } catch {
      setDeleteError("Failed to delete student.");
    }
    setDeleteLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8 flex items-center justify-center"><div className="text-2xl">Loading students...</div></div>;
  if (error) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-red-400 p-8 flex items-center justify-center"><div className="text-2xl">{error}</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">👥 Student Management</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-600 p-6 rounded-lg shadow-lg">
            <p className="text-blue-100 text-sm">Total Students</p>
            <p className="text-3xl font-bold text-white">{students.length}</p>
          </div>
          <div className="bg-green-600 p-6 rounded-lg shadow-lg">
            <p className="text-green-100 text-sm">Active Records</p>
            <p className="text-3xl font-bold text-white">{students.filter(s => s.year).length}</p>
          </div>
          <div className="bg-purple-600 p-6 rounded-lg shadow-lg">
            <p className="text-purple-100 text-sm">Departments</p>
            <p className="text-3xl font-bold text-white">{new Set(students.map(s => s.department)).size}</p>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowAdd(true)}
          className="mb-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow-lg"
        >
          ➕ Add New Student
        </button>

        {/* Students Table */}
        <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700 border-b border-purple-500">
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Reg No</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Department</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Year</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((stu) => (
                    <tr key={stu.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                      <td className="px-6 py-4 text-white">{stu.name}</td>
                      <td className="px-6 py-4 text-gray-300">{stu.regNo}</td>
                      <td className="px-6 py-4 text-gray-300">{stu.department}</td>
                      <td className="px-6 py-4 text-gray-300">Year {stu.year}</td>
                      <td className="px-6 py-4">
                        <button
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm mr-2 transition"
                          onClick={() => handleEditClick(stu)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                          onClick={() => handleDeleteClick(stu.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      No students found. Click "Add New Student" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-8 w-full max-w-md shadow-2xl border border-purple-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Student</h3>
              <button
                className="text-gray-400 hover:text-white text-2xl"
                onClick={() => setShowAdd(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-300 text-sm block mb-2">Full Name</label>
                <input
                  name="name"
                  value={addForm.name}
                  onChange={handleAddChange}
                  placeholder="Enter student name"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-2">Registration Number</label>
                <input
                  name="regNo"
                  value={addForm.regNo}
                  onChange={handleAddChange}
                  placeholder="e.g., STU001"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-2">Department</label>
                <input
                  name="department"
                  value={addForm.department}
                  onChange={handleAddChange}
                  placeholder="e.g., Computer Science"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-2">Year</label>
                <input
                  name="year"
                  value={addForm.year}
                  onChange={handleAddChange}
                  placeholder="1-4"
                  type="number"
                  min="1"
                  max="4"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              {addError && <div className="text-red-400 text-sm p-3 bg-red-900/30 rounded">{addError}</div>}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 font-semibold transition disabled:opacity-50"
                disabled={addLoading}
              >
                {addLoading ? "Adding..." : "✓ Add Student"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-8 w-full max-w-md shadow-2xl border border-blue-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Edit Student</h3>
              <button
                className="text-gray-400 hover:text-white text-2xl"
                onClick={() => setEditId(null)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditStudent} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-300 text-sm block mb-2">Full Name</label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Enter student name"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-2">Registration Number</label>
                <input
                  name="regNo"
                  value={editForm.regNo}
                  onChange={handleEditChange}
                  placeholder="e.g., STU001"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-2">Department</label>
                <input
                  name="department"
                  value={editForm.department}
                  onChange={handleEditChange}
                  placeholder="e.g., Computer Science"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-2">Year</label>
                <input
                  name="year"
                  value={editForm.year}
                  onChange={handleEditChange}
                  placeholder="1-4"
                  type="number"
                  min="1"
                  max="4"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              {editError && <div className="text-red-400 text-sm p-3 bg-red-900/30 rounded">{editError}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-semibold transition disabled:opacity-50"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "✓ Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-8 w-full max-w-md shadow-2xl border border-red-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Delete Student</h3>
              <button
                className="text-gray-400 hover:text-white text-2xl"
                onClick={() => setDeleteId(null)}
              >
                ✕
              </button>
            </div>
            <div className="mb-6 text-gray-300">
              <p>Are you sure you want to delete this student?</p>
              <p className="text-sm text-gray-400 mt-2">This action cannot be undone.</p>
            </div>
            {deleteError && <div className="text-red-400 text-sm p-3 bg-red-900/30 rounded mb-4">{deleteError}</div>}
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold transition disabled:opacity-50"
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition disabled:opacity-50"
                onClick={handleDeleteStudent}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;
