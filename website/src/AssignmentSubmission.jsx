import React, { useState, useEffect } from 'react';

function AssignmentSubmission({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/assignments')
      .then(res => res.json())
      .then(data => setAssignments(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!selectedAssignment || !file) {
      alert('Please select an assignment and file');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:4000/api/assignments/${selectedAssignment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNo: user?.regNo || user?.email?.split('@')[0],
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          submittedAt: new Date().toISOString()
        })
      });
      if (res.ok) {
        alert('Assignment submitted successfully.');
        setFile(null);
        setSelectedAssignment(null);
      }
    } catch (err) {
      alert('Submission failed');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Assignment Submissions</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Assignment List */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Available Assignments</h2>
            <div className="space-y-3">
              {assignments.map(assignment => (
                <div
                  key={assignment.id}
                  onClick={() => setSelectedAssignment(assignment)}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedAssignment?.id === assignment.id
                      ? 'bg-cyan-600'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-white">{assignment.title}</div>
                  <div className="text-sm text-gray-300">Subject: {assignment.subject}</div>
                  <div className="text-xs text-gray-400 mt-1">Due: {assignment.dueDate}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Form */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Submit</h2>
            {selectedAssignment ? (
              <div className="space-y-4">
                <div className="bg-white/5 p-3 rounded">
                  <div className="text-sm font-semibold text-cyan-300">{selectedAssignment.title}</div>
                  <div className="text-xs text-gray-400">Due: {selectedAssignment.dueDate}</div>
                </div>
                <label className="block">
                  <div className="text-sm font-semibold text-white mb-2">Choose File:</div>
                  <input
                    type="file"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </label>
                {file && (
                  <div className="text-xs text-green-300">Selected: {file.name}</div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !file}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-500 font-semibold"
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            ) : (
              <p className="text-gray-400">Select an assignment to submit</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentSubmission;
