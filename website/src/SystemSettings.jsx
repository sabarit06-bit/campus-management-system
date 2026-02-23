import { useState } from 'react';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    academicYear: '2024-2025',
    sem: '1',
    minAttendance: 75,
    maxStudentsPerClass: 50,
    passingMarks: 40,
    emailNotifications: true,
    smsAlerts: false,
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    dataRetention: '365'
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings({
      academicYear: '2024-2025',
      sem: '1',
      minAttendance: 75,
      maxStudentsPerClass: 50,
      passingMarks: 40,
      emailNotifications: true,
      smsAlerts: false,
      maintenanceMode: false,
      debugMode: false,
      autoBackup: true,
      dataRetention: '365'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">⚙️ System Settings & Configuration</h1>

        {saved && (
          <div className="mb-6 p-4 bg-green-600/30 border border-green-500 rounded-lg text-green-400 font-semibold">
            ✓ Settings saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Academic Settings */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📚</span> Academic Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 block mb-2">Academic Year</label>
                <input
                  type="text"
                  value={settings.academicYear}
                  onChange={(e) => handleChange('academicYear', e.target.value)}
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., 2024-2025"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-2">Current Semester</label>
                <select
                  value={settings.sem}
                  onChange={(e) => handleChange('sem', e.target.value)}
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 block mb-2">Minimum Attendance Required (%)</label>
                <input
                  type="number"
                  value={settings.minAttendance}
                  onChange={(e) => handleChange('minAttendance', parseInt(e.target.value))}
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-2">Passing Marks (Out of 100)</label>
                <input
                  type="number"
                  value={settings.passingMarks}
                  onChange={(e) => handleChange('passingMarks', parseInt(e.target.value))}
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-2">Max Students Per Class</label>
                <input
                  type="number"
                  value={settings.maxStudentsPerClass}
                  onChange={(e) => handleChange('maxStudentsPerClass', parseInt(e.target.value))}
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  min="1"
                  max="500"
                />
              </div>
            </div>
          </div>

          {/* Communication Settings */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📢</span> Communication
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <label className="text-gray-300">Email Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <label className="text-gray-300">SMS Alerts</label>
                <input
                  type="checkbox"
                  checked={settings.smsAlerts}
                  onChange={(e) => handleChange('smsAlerts', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mt-6 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <label className="text-gray-300">Maintenance Mode</label>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <label className="text-gray-300">Debug Mode</label>
                <input
                  type="checkbox"
                  checked={settings.debugMode}
                  onChange={(e) => handleChange('debugMode', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <label className="text-gray-300">Auto Backup</label>
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => handleChange('autoBackup', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>💾</span> Data Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-300 block mb-2">Data Retention (Days)</label>
              <input
                type="number"
                value={settings.dataRetention}
                onChange={(e) => handleChange('dataRetention', e.target.value)}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                min="30"
                max="3650"
              />
            </div>
            <div className="flex items-end gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                💾 Backup Now
              </button>
              <button className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition">
                🔄 Restore
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔒</span> Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
              🔑 Reset All Passwords
            </button>
            <button className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
              🚫 Logout All Users
            </button>
            <button className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
              🔐 Clear Logs
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">ℹ️ System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700 rounded">
              <p className="text-gray-300 text-sm">System Version</p>
              <p className="text-white font-bold text-lg">v1.0.0</p>
            </div>
            <div className="p-4 bg-slate-700 rounded">
              <p className="text-gray-300 text-sm">Last Updated</p>
              <p className="text-white font-bold text-lg">02-Feb-2026</p>
            </div>
            <div className="p-4 bg-slate-700 rounded">
              <p className="text-gray-300 text-sm">Database Status</p>
              <p className="text-green-400 font-bold text-lg">✓ Healthy</p>
            </div>
            <div className="p-4 bg-slate-700 rounded">
              <p className="text-gray-300 text-sm">API Status</p>
              <p className="text-green-400 font-bold text-lg">✓ Online</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            ✓ Save Settings
          </button>
          <button
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
          >
            🔄 Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
