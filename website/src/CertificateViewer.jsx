import React, { useState, useEffect } from 'react';

function CertificateViewer({ user }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const regNo = user?.regNo || (user?.email && user.email.split('@')[0]);

  useEffect(() => {
    if (regNo) {
      fetch(`https://campus-management-system-production.up.railway.app/api/certificates/${regNo}`)
        .then(res => res.json())
        .then(data => {
          setCertificates(data);
          setLoading(false);
        })
        .catch(err => { console.error(err); setLoading(false); });
    }
  }, [regNo]);

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">My Certificates</h1>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map(cert => (
              <div key={cert.id} className="bg-gradient-to-br from-yellow-400/10 to-orange-600/10 border-2 border-yellow-400/30 rounded-lg p-6 hover:shadow-lg hover:shadow-yellow-500/20 transition">
                <div className="text-5xl mb-4">Certificate</div>
                <h3 className="text-2xl font-bold text-yellow-300 mb-2">{cert.certificateType}</h3>
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-gray-400">Course:</span>
                    <span className="text-white ml-2">{cert.course}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Issue Date:</span>
                    <span className="text-white ml-2">{cert.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2 px-3 py-1 bg-green-600/30 text-green-300 rounded-full text-sm font-semibold">
                      {cert.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold">
                  Download Certificate
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-12 text-center">
            <div className="text-2xl mb-4">No Certificates</div>
            <p className="text-gray-300">No certificates yet. Keep earning achievements.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CertificateViewer;
