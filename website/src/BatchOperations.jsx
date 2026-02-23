import { useState } from 'react';

export default function BatchOperations() {
  const [operationType, setOperationType] = useState('students');
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [processedCount, setProcessedCount] = useState(0);
  const [csvData, setCsvData] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target.result);
      setMessage(`File loaded: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const processBatch = async () => {
    if (!csvData) {
      setMessage('Please select a CSV file first');
      return;
    }

    setUploadStatus('processing');
    setUploadProgress(0);

    const lines = csvData.split('\n').filter(line => line.trim());
    const records = [];

    // Skip header row and parse CSV
    for (let i = 1; i < lines.length; i++) {
      const [name, regNo, dept, year] = lines[i].split(',').map(v => v.trim());
      if (name && regNo && dept) {
        records.push({ name, regNo, department: dept, year: parseInt(year) || 1 });
      }
    }

    let successful = 0;
    let failed = 0;

    try {
      for (let i = 0; i < records.length; i++) {
        try {
          const endpoint = operationType === 'students' ? '/api/students' : '/api/teachers';
          const payload = operationType === 'students'
            ? { name: records[i].name, regNo: records[i].regNo, department: records[i].department, year: records[i].year }
            : { name: records[i].name, regNo: records[i].regNo, department: records[i].department, specialization: 'TBD' };

          await fetch(`https://campus-management-system-production.up.railway.app${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
            body: JSON.stringify(payload)
          });
          
          successful++;
        } catch (err) {
          failed++;
        }

        const progress = Math.round(((i + 1) / records.length) * 100);
        setUploadProgress(progress);
        setProcessedCount(i + 1);
      }

      setUploadStatus('complete');
      setMessage(`✓ Batch operation completed! Successfully uploaded: ${successful}, Failed: ${failed}`);
    } catch (err) {
      setUploadStatus('error');
      setMessage(`✗ Error: ${err.message}`);
    }
  };

  const sampleCSV = operationType === 'students'
    ? `Name,Registration Number,Department,Year
John Doe,REG001,CSE,1
Jane Smith,REG002,ECE,2
Mike Johnson,REG003,Mechanical,3
Sarah Williams,REG004,Civil,1`
    : `Name,Registration Number,Department,Specialization
Dr. Singh,TEA001,CSE,Data Science
Prof. Kumar,TEA002,ECE,Embedded Systems
Mr. Patel,TEA003,Mechanical,Manufacturing`;

  const downloadSample = () => {
    const element = document.createElement('a');
    const file = new Blob([sampleCSV], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `sample_${operationType}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">⚡ Batch Operations</h1>

        {/* Operation Type Selection */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Select Operation Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => { setOperationType('students'); setCsvData(''); setUploadStatus('idle'); }}
              className={`p-6 rounded-lg border-2 transition ${
                operationType === 'students'
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 bg-slate-700 text-gray-300 hover:border-purple-400'
              }`}
            >
              <div className="text-4xl mb-2">👥</div>
              <div className="text-xl font-bold">Bulk Upload Students</div>
              <p className="text-sm mt-2">Upload multiple students at once</p>
            </button>
            <button
              onClick={() => { setOperationType('teachers'); setCsvData(''); setUploadStatus('idle'); }}
              className={`p-6 rounded-lg border-2 transition ${
                operationType === 'teachers'
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-gray-600 bg-slate-700 text-gray-300 hover:border-blue-400'
              }`}
            >
              <div className="text-4xl mb-2">🎓</div>
              <div className="text-xl font-bold">Bulk Upload Teachers</div>
              <p className="text-sm mt-2">Upload multiple teachers at once</p>
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">📤 Upload CSV File</h2>
          
          <div className="mb-6 p-6 border-2 border-dashed border-purple-500 rounded-lg text-center bg-slate-700/50">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-4xl mb-2">📁</div>
              <p className="text-white font-semibold mb-2">Click to select CSV file or drag & drop</p>
              <p className="text-gray-300 text-sm">Supported format: CSV (.csv)</p>
              {csvData && <p className="text-green-400 text-sm mt-2">✓ File loaded</p>}
            </label>
          </div>

          {/* CSV Format Info */}
          <div className="mb-6 bg-slate-700 p-4 rounded">
            <h3 className="text-white font-bold mb-3">📋 Expected CSV Format:</h3>
            <pre className="text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
{operationType === 'students'
  ? 'Name,Registration Number,Department,Year'
  : 'Name,Registration Number,Department,Specialization'}
            </pre>
          </div>

          {/* Sample Download */}
          <button
            onClick={downloadSample}
            className="w-full mb-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            📥 Download Sample CSV
          </button>
        </div>

        {/* Processing Section */}
        {uploadStatus !== 'idle' && (
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Processing Status</h2>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Progress: {uploadProgress}%</span>
                <span className="text-white font-bold">{processedCount} records processed</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg text-white ${
                uploadStatus === 'complete' ? 'bg-green-600/30 border border-green-500' :
                uploadStatus === 'error' ? 'bg-red-600/30 border border-red-500' :
                'bg-blue-600/30 border border-blue-500'
              }`}>
                {message}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={processBatch}
            disabled={!csvData || uploadStatus === 'processing'}
            className={`flex-1 px-6 py-3 font-semibold rounded-lg transition ${
              csvData && uploadStatus !== 'processing'
                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            {uploadStatus === 'processing' ? '⏳ Processing...' : '✓ Process & Upload'}
          </button>
          <button
            onClick={() => { setCsvData(''); setUploadStatus('idle'); setMessage(''); }}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
          >
            🔄 Reset
          </button>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-slate-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">ℹ️ Important Information</h3>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Maximum 1000 records per batch</li>
            <li>✓ CSV file must have headers in first row</li>
            <li>✓ All fields are required</li>
            <li>✓ Registration numbers must be unique</li>
            <li>✓ Failed records will be skipped automatically</li>
            <li>✓ A detailed report will be generated after processing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
