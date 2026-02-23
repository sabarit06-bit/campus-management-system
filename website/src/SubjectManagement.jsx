import React, { useEffect, useState } from "react";

function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", code: "", department: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", code: "", department: "" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/subjects")
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load subjects.");
        setLoading(false);
      });
  }, []);

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify(addForm)
      });
      if (!res.ok) {
        const data = await res.json();
        setAddError(data.error || "Failed to add subject.");
      } else {
        const newSub = await res.json();
        setSubjects((prev) => [...prev, newSub]);
        setShowAdd(false);
        setAddForm({ name: "", code: "", department: "" });
      }
    } catch {
      setAddError("Failed to add subject.");
    }
    setAddLoading(false);
  };

  const handleEditClick = (s) => {
    setEditId(s.id);
    setEditForm({ name: s.name, code: s.code, department: s.department });
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubject = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/subjects/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error || "Failed to update subject.");
      } else {
        const updated = await res.json();
        setSubjects((prev) => prev.map((s) => (s.id === editId ? updated : s)));
        setEditId(null);
      }
    } catch {
      setEditError("Failed to update subject.");
    }
    setEditLoading(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteError("");
  };

  const handleDeleteSubject = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`http://localhost:4000/api/subjects/${deleteId}`, {
        method: "DELETE",
        headers: {
          "x-user-role": "admin"
        }
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete subject.");
      } else {
        setSubjects((prev) => prev.filter((s) => s.id !== deleteId));
        setDeleteId(null);
      }
    } catch {
      setDeleteError("Failed to delete subject.");
    }
    setDeleteLoading(false);
  };

  if (loading) return <div className="text-white p-8">Loading subjects...</div>;
  if (error) return <div className="text-red-400 p-8">{error}</div>;

  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-6">Manage Subjects</h2>
      <button className="mb-4 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded" onClick={() => setShowAdd(true)}>Add Subject</button>
      <table className="min-w-full bg-white/10 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-cyan-900/60">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s) => (
            <tr key={s.id} className="border-b border-white/20">
              <td className="px-4 py-2">{s.name}</td>
              <td className="px-4 py-2">{s.code}</td>
              <td className="px-4 py-2">{s.department}</td>
              <td className="px-4 py-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded mr-2" onClick={() => handleEditClick(s)}>Edit</button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" onClick={() => handleDeleteClick(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setShowAdd(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center">Add Subject</h3>
            <form onSubmit={handleAddSubject} className="flex flex-col gap-4">
              <input name="name" value={addForm.name} onChange={handleAddChange} placeholder="Subject Name" className="border rounded px-3 py-2" required />
              <input name="code" value={addForm.code} onChange={handleAddChange} placeholder="Subject Code" className="border rounded px-3 py-2" required />
              <input name="department" value={addForm.department} onChange={handleAddChange} placeholder="Department" className="border rounded px-3 py-2" required />
              {addError && <div className="text-red-600 text-sm">{addError}</div>}
              <button type="submit" className="bg-cyan-600 text-white rounded py-2 font-semibold hover:bg-cyan-700 transition" disabled={addLoading}>
                {addLoading ? "Adding..." : "Add Subject"}
              </button>
            </form>
          </div>
        </div>
      )}
      {editId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setEditId(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center">Edit Subject</h3>
            <form onSubmit={handleEditSubject} className="flex flex-col gap-4">
              <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Subject Name" className="border rounded px-3 py-2" required />
              <input name="code" value={editForm.code} onChange={handleEditChange} placeholder="Subject Code" className="border rounded px-3 py-2" required />
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
            <h3 className="text-xl font-bold mb-4 text-center">Delete Subject</h3>
            <div className="mb-4 text-center">Are you sure you want to delete this subject?</div>
            {deleteError && <div className="text-red-600 text-sm mb-2">{deleteError}</div>}
            <div className="flex gap-4 justify-center">
              <button className="bg-gray-300 text-black rounded px-4 py-2" onClick={() => setDeleteId(null)} disabled={deleteLoading}>Cancel</button>
              <button className="bg-red-600 text-white rounded px-4 py-2" onClick={handleDeleteSubject} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectManagement;
