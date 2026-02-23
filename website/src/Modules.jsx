import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Modules({ role }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", status: "active" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", status: "active" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetch("https://campus-management-system-production.up.railway.app/api/modules")
      .then((res) => res.json())
      .then((data) => {
        setModules(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load modules.");
        setLoading(false);
      });
  }, []);

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const res = await fetch("https://campus-management-system-production.up.railway.app/api/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify(addForm)
      });
      if (!res.ok) {
        const data = await res.json();
        setAddError(data.error || "Failed to add module.");
      } else {
        const newMod = await res.json();
        setModules((prev) => [...prev, newMod]);
        setShowAdd(false);
        setAddForm({ name: "", status: "active" });
      }
    } catch {
      setAddError("Failed to add module.");
    }
    setAddLoading(false);
  };

  const handleEditClick = (mod) => {
    setEditId(mod.id);
    setEditForm({ name: mod.name, status: mod.status });
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditModule = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditLoading(true);
    try {
      const res = await fetch(`https://campus-management-system-production.up.railway.app/api/modules/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error || "Failed to update module.");
      } else {
        const updated = await res.json();
        setModules((prev) => prev.map((m) => (m.id === editId ? updated : m)));
        setEditId(null);
      }
    } catch {
      setEditError("Failed to update module.");
    }
    setEditLoading(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteError("");
  };

  const handleDeleteModule = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`https://campus-management-system-production.up.railway.app/api/modules/${deleteId}`, {
        method: "DELETE",
        headers: {
          "x-user-role": "admin"
        }
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete module.");
      } else {
        setModules((prev) => prev.filter((m) => m.id !== deleteId));
        setDeleteId(null);
      }
    } catch {
      setDeleteError("Failed to delete module.");
    }
    setDeleteLoading(false);
  };

  if (loading) return <div className="text-white p-12 text-xl">Loading modules...</div>;
  if (error) return <div className="text-red-400 p-12 text-xl">{error}</div>;

  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-6">Modules</h2>
      {role === 'admin' && (
        <button className="mb-6 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded" onClick={() => setShowAdd(true)}>Add Module</button>
      )}
      <div className="grid md:grid-cols-3 gap-8">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white/10 rounded-lg p-6 border border-white/20 flex flex-col items-center hover:bg-cyan-900/30 transition cursor-pointer relative">
            <Link
              to={`/modules/${mod.name.toLowerCase()}`}
              className="w-full flex flex-col items-center"
            >
              <div className="font-bold text-xl mb-2">{mod.name}</div>
              <div
                className={`text-xs px-3 py-1 rounded-full ${
                  mod.status === "active" ? "bg-cyan-600" : "bg-gray-500"
                } text-white mt-2`}
              >
                {mod.status}
              </div>
            </Link>
            {role === 'admin' && (
              <div className="flex gap-2 mt-4">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded" onClick={() => handleEditClick(mod)}>Edit</button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" onClick={() => handleDeleteClick(mod.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setShowAdd(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center">Add Module</h3>
            <form onSubmit={handleAddModule} className="flex flex-col gap-4">
              <input name="name" value={addForm.name} onChange={handleAddChange} placeholder="Module Name" className="border rounded px-3 py-2" required />
              <select name="status" value={addForm.status} onChange={handleAddChange} className="border rounded px-3 py-2">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {addError && <div className="text-red-600 text-sm">{addError}</div>}
              <button type="submit" className="bg-cyan-600 text-white rounded py-2 font-semibold hover:bg-cyan-700 transition" disabled={addLoading}>
                {addLoading ? "Adding..." : "Add Module"}
              </button>
            </form>
          </div>
        </div>
      )}
      {editId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setEditId(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center">Edit Module</h3>
            <form onSubmit={handleEditModule} className="flex flex-col gap-4">
              <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Module Name" className="border rounded px-3 py-2" required />
              <select name="status" value={editForm.status} onChange={handleEditChange} className="border rounded px-3 py-2">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
            <h3 className="text-xl font-bold mb-4 text-center">Delete Module</h3>
            <div className="mb-4 text-center">Are you sure you want to delete this module?</div>
            {deleteError && <div className="text-red-600 text-sm mb-2">{deleteError}</div>}
            <div className="flex gap-4 justify-center">
              <button className="bg-gray-300 text-black rounded px-4 py-2" onClick={() => setDeleteId(null)} disabled={deleteLoading}>Cancel</button>
              <button className="bg-red-600 text-white rounded px-4 py-2" onClick={handleDeleteModule} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modules;
