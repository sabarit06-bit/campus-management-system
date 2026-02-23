import React, { useEffect, useState } from "react";

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", department: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", department: "" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/teachers")
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load teachers.");
        setLoading(false);
      });
  }, []);

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify(addForm)
      });
      if (!res.ok) {
        const data = await res.json();
        setAddError(data.error || "Failed to add teacher.");
      } else {
        const newT = await res.json();
        setTeachers((prev) => [...prev, newT]);
        setShowAdd(false);
        setAddForm({ name: "", email: "", department: "" });
      }
    } catch {
      setAddError("Failed to add teacher.");
    }
    setAddLoading(false);
  };

  const handleEditClick = (t) => {
    setEditId(t.id);
    setEditForm({ name: t.name, email: t.email, department: t.department });
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditTeacher = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/teachers/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error || "Failed to update teacher.");
      } else {
        const updated = await res.json();
        setTeachers((prev) => prev.map((t) => (t.id === editId ? updated : t)));
        setEditId(null);
      }
    } catch {
      setEditError("Failed to update teacher.");
    }
    setEditLoading(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteError("");
  };

  const handleDeleteTeacher = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`http://localhost:4000/api/teachers/${deleteId}`, {
        method: "DELETE",
        headers: {
          "x-user-role": "admin"
        }
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete teacher.");
      } else {
        setTeachers((prev) => prev.filter((t) => t.id !== deleteId));
        setDeleteId(null);
      }
    } catch {
      setDeleteError("Failed to delete teacher.");
    }
    setDeleteLoading(false);
  };

  if (loading) return <div className="text-white p-8">Loading teachers...</div>;
  if (error) return <div className="text-red-400 p-8">{error}</div>;

  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-6">Manage Teachers</h2>
      <button className="mb-4 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded" onClick={() => setShowAdd(true)}>Add Teacher</button>
      <table className="min-w-full bg-white/10 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-cyan-900/60">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id} className="border-b border-white/20">
              <td className="px-4 py-2">{t.name}</td>
              <td className="px-4 py-2">{t.email}</td>
              <td className="px-4 py-2">{t.department}</td>
              <td className="px-4 py-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded mr-2" onClick={() => handleEditClick(t)}>Edit</button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" onClick={() => handleDeleteClick(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setShowAdd(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center">Add Teacher</h3>
            <form onSubmit={handleAddTeacher} className="flex flex-col gap-4">
              <input name="name" value={addForm.name} onChange={handleAddChange} placeholder="Name" className="border rounded px-3 py-2" required />
              <input name="email" value={addForm.email} onChange={handleAddChange} placeholder="Email" className="border rounded px-3 py-2" required />
              <input name="department" value={addForm.department} onChange={handleAddChange} placeholder="Department" className="border rounded px-3 py-2" required />
              {addError && <div className="text-red-600 text-sm">{addError}</div>}
              <button type="submit" className="bg-cyan-600 text-white rounded py-2 font-semibold hover:bg-cyan-700 transition" disabled={addLoading}>
                {addLoading ? "Adding..." : "Add Teacher"}
              </button>
            </form>
          </div>
        </div>
      )}
      {editId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setEditId(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center">Edit Teacher</h3>
            <form onSubmit={handleEditTeacher} className="flex flex-col gap-4">
              <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Name" className="border rounded px-3 py-2" required />
              <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" className="border rounded px-3 py-2" required />
              <input name="department" value={editForm.department} onChange={handleEditChange} placeholder="Department" className="border rounded px-3 py-2" required />
              {editError && <div className="text-red-600 text-sm">{editError}</div>}
              <button type="submit" className="bg-yellow-600 text-white rounded py-2 font-semibold hover:bg-yellow-700 transition" disabled={editLoading}>
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setDeleteId(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center">Delete Teacher</h3>
            <div className="mb-4 text-center">Are you sure you want to delete this teacher?</div>
            {deleteError && <div className="text-red-600 text-sm mb-2">{deleteError}</div>}
            <div className="flex gap-4 justify-center">
              <button className="bg-gray-300 text-black rounded px-4 py-2" onClick={() => setDeleteId(null)} disabled={deleteLoading}>Cancel</button>
              <button className="bg-red-600 text-white rounded px-4 py-2" onClick={handleDeleteTeacher} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherManagement;
