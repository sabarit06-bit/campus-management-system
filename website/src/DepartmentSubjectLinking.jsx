import React, { useEffect, useState } from "react";

function DepartmentSubjectLinking() {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDept, setEditDept] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [saveError, setSaveError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("https://campus-management-system-production.up.railway.app/api/departments").then(r => r.json()),
      fetch("https://campus-management-system-production.up.railway.app/api/subjects").then(r => r.json()),
      fetch("https://campus-management-system-production.up.railway.app/api/department-subjects").then(r => r.json()),
    ]).then(([deps, subs, links]) => {
      setDepartments(deps);
      setSubjects(subs);
      setLinks(links);
      setLoading(false);
    }).catch(() => {
      setError("Failed to load data.");
      setLoading(false);
    });
  }, []);

  const handleEditClick = (deptCode) => {
    setEditDept(deptCode);
    const link = links.find(l => l.department === deptCode);
    setSelectedSubjects(link ? link.subjects : []);
    setSaveError("");
  };

  const handleSubjectToggle = (subId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subId)
        ? prev.filter(id => id !== subId)
        : [...prev, subId]
    );
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveError("");
    try {
      const res = await fetch(`https://campus-management-system-production.up.railway.app/api/department-subjects/${editDept}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify({ subjects: selectedSubjects })
      });
      if (!res.ok) {
        const data = await res.json();
        setSaveError(data.error || "Failed to save links.");
      } else {
        const updated = await res.json();
        setLinks((prev) => {
          const idx = prev.findIndex(l => l.department === editDept);
          if (idx === -1) return [...prev, updated];
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        });
        setEditDept(null);
      }
    } catch {
      setSaveError("Failed to save links.");
    }
    setSaveLoading(false);
  };

  if (loading) return <div className="text-white p-8">Loading department-subject links...</div>;
  if (error) return <div className="text-red-400 p-8">{error}</div>;

  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-6">Department-Subject Linking</h2>
      <table className="min-w-full bg-white/10 rounded-lg overflow-hidden mb-8">
        <thead>
          <tr className="bg-cyan-900/60">
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Subjects</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => {
            const link = links.find(l => l.department === d.code);
            return (
              <tr key={d.code} className="border-b border-white/20">
                <td className="px-4 py-2">{d.name} ({d.code})</td>
                <td className="px-4 py-2">
                  {link && link.subjects.length > 0
                    ? link.subjects.map(subId => {
                        const sub = subjects.find(s => s.id === subId);
                        return sub ? sub.name : subId;
                      }).join(", ")
                    : <span className="text-gray-400">No subjects linked</span>}
                </td>
                <td className="px-4 py-2">
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded" onClick={() => handleEditClick(d.code)}>Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {editDept && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setEditDept(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center">Edit Subjects for {departments.find(d => d.code === editDept)?.name} ({editDept})</h3>
            <div className="flex flex-col gap-2 mb-4">
              {subjects.map((s) => (
                <label key={s.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(s.id)}
                    onChange={() => handleSubjectToggle(s.id)}
                  />
                  {s.name} ({s.code})
                </label>
              ))}
            </div>
            {saveError && <div className="text-red-600 text-sm mb-2">{saveError}</div>}
            <div className="flex gap-4 justify-center">
              <button className="bg-gray-300 text-black rounded px-4 py-2" onClick={() => setEditDept(null)} disabled={saveLoading}>Cancel</button>
              <button className="bg-cyan-600 text-white rounded px-4 py-2" onClick={handleSave} disabled={saveLoading}>
                {saveLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentSubjectLinking;
