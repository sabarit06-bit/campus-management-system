import { useState } from 'react';

export default function TransportHostel() {
  const [activeTab, setActiveTab] = useState('transport');

  // Transport data
  const [transportRoutes] = useState([
    { id: 1, routeName: 'North Route', pickupPoint: 'Station Road', dropPoint: 'Campus Gate A', timing: '7:00 AM - 8:30 AM', fare: '₹500', busNumber: 'CMP-101', capacity: 45, status: 'Active' },
    { id: 2, routeName: 'South Route', pickupPoint: 'Bus Stand', dropPoint: 'Campus Gate B', timing: '7:15 AM - 8:45 AM', fare: '₹600', busNumber: 'CMP-102', capacity: 50, status: 'Active' },
    { id: 3, routeName: 'East Route', pickupPoint: 'Market Cross', dropPoint: 'Campus Gate C', timing: '7:30 AM - 9:00 AM', fare: '₹550', busNumber: 'CMP-103', capacity: 48, status: 'Active' },
    { id: 4, routeName: 'West Route', pickupPoint: 'Railway Station', dropPoint: 'Campus Gate D', timing: '7:45 AM - 9:15 AM', fare: '₹700', busNumber: 'CMP-104', capacity: 45, status: 'Active' },
  ]);

  const [userTransport] = useState({
    enrolled: true,
    routeId: 1,
    pickupPoint: 'Station Road',
    dropPoint: 'Campus Gate A',
    fare: '₹500',
    billingCycle: 'Monthly',
    registrationDate: '15-Jan-2026',
    renewalDate: '15-Mar-2026',
    status: 'Active'
  });

  // Hostel data
  const [hostelBlocks] = useState([
    { id: 1, blockName: 'Block A', type: 'Boys', capacity: 200, available: 45, occupied: 155, floor: 5 },
    { id: 2, blockName: 'Block B', type: 'Girls', capacity: 180, available: 30, occupied: 150, floor: 4 },
    { id: 3, blockName: 'Block C', type: 'Boys', capacity: 220, available: 60, occupied: 160, floor: 5 },
    { id: 4, blockName: 'Block D', type: 'Girls', capacity: 200, available: 35, occupied: 165, floor: 5 }
  ]);

  const [roomTypes] = useState([
    { type: 'Single Room', personCapacity: 1, fee: '₹8000', amenities: ['AC', 'Attached Bathroom', 'WiFi'] },
    { type: 'Double Room', personCapacity: 2, fee: '₹5000/person', amenities: ['AC', 'Shared Bathroom', 'WiFi'] },
    { type: 'Triple Room', personCapacity: 3, fee: '₹3500/person', amenities: ['Cooler', 'Shared Bathroom', 'WiFi'] },
  ]);

  const [userHostel] = useState({
    enrolled: true,
    blockName: 'Block A',
    roomNumber: 'A-307',
    roomType: 'Double Room',
    floorNumber: 3,
    bedNumber: 1,
    wardenName: 'Mr. Sharma',
    wardenPhone: '+91-9876543210',
    registrationDate: '20-Jan-2026',
    fee: '₹5000',
    billingCycle: 'Monthly',
    status: 'Active'
  });

  const [hostelFacilities] = useState([
    { icon: '🍽️', name: 'Mess Facility', description: 'Lunch & Dinner included, Multiple cuisines' },
    { icon: '📚', name: 'Study Rooms', description: 'Well-equipped common study areas' },
    { icon: '🏋️', name: 'Gym', description: 'Modern fitness equipment available' },
    { icon: '🧺', name: 'Laundry Service', description: 'Weekly laundry service included' },
    { icon: '🔒', name: 'Security', description: '24/7 CCTV surveillance & security staff' },
    { icon: '📡', name: 'WiFi Internet', description: 'High-speed internet access in rooms' },
  ]);

  const [showTransportForm, setShowTransportForm] = useState(false);
  const [showHostelForm, setShowHostelForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleTransportEnroll = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowTransportForm(false);
    }, 2000);
  };

  const handleHostelEnroll = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowHostelForm(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">🚌 Transport & Hostel Management</h1>
        <p className="text-gray-300 mb-8">Manage your transport and hostel accommodations</p>

        {submitted && (
          <div className="mb-6 p-4 bg-green-600/30 border border-green-500 rounded-lg text-green-400 font-semibold">
            ✓ Registration successful! You will receive confirmation email shortly.
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'transport'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            🚌 Transport Management
          </button>
          <button
            onClick={() => setActiveTab('hostel')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'hostel'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            🏠 Hostel Management
          </button>
        </div>

        {/* TRANSPORT SECTION */}
        {activeTab === 'transport' && (
          <div className="space-y-8">
            {/* Current Enrollment */}
            {userTransport.enrolled && (
              <div className="bg-gradient-to-r from-green-900 to-blue-900 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4">✓ Active Transport Enrollment</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-300 text-sm">Route Name</p>
                    <p className="text-xl font-bold text-white">{userTransport.routeName || transportRoutes[0].routeName}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Pickup Point</p>
                    <p className="text-xl font-bold text-white">{userTransport.pickupPoint}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Monthly Fare</p>
                    <p className="text-xl font-bold text-white">{userTransport.fare}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Status</p>
                    <p className="text-xl font-bold text-green-400">Active</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-4">Renewal Date: {userTransport.renewalDate}</p>
              </div>
            )}

            {/* Routes List */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Available Routes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {transportRoutes.map(route => (
                  <div key={route.id} className="border-2 border-blue-500 rounded-lg p-6 bg-slate-700 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white">{route.routeName}</h3>
                      <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded">Active</span>
                    </div>
                    <div className="space-y-2 mb-4 text-gray-300">
                      <p>🚏 Pickup: {route.pickupPoint}</p>
                      <p>🎯 Drop: {route.dropPoint}</p>
                      <p>⏰ Timing: {route.timing}</p>
                      <p>🚌 Bus: {route.busNumber} ({route.capacity} seater)</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">{route.fare}/month</span>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                        Select Route
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Guidelines */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">📋 Transport Guidelines</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Services run on all working days (Monday-Saturday)</li>
                <li>✓ Payment can be made monthly or quarterly</li>
                <li>✓ Bus timings are fixed; arrive 5 minutes early</li>
                <li>✓ Valid ID card must be carried at all times</li>
                <li>✓ For complaints/changes, contact transport office</li>
              </ul>
            </div>
          </div>
        )}

        {/* HOSTEL SECTION */}
        {activeTab === 'hostel' && (
          <div className="space-y-8">
            {/* Current Enrollment */}
            {userHostel.enrolled && (
              <div className="bg-gradient-to-r from-green-900 to-blue-900 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4">✓ Active Hostel Accommodation</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-300 text-sm">Block & Room</p>
                    <p className="text-xl font-bold text-white">{userHostel.blockName} - {userHostel.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Warden</p>
                    <p className="text-white">{userHostel.wardenName}</p>
                    <p className="text-sm text-gray-400">{userHostel.wardenPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Monthly Fee</p>
                    <p className="text-xl font-bold text-white">{userHostel.fee}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Blocks Overview */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Hostel Blocks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hostelBlocks.map(block => (
                  <div key={block.id} className="border-2 border-purple-500 rounded-lg p-6 bg-slate-700">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white">{block.blockName} ({block.type})</h3>
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">{block.floor} Floors</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-300">Total Capacity: <span className="text-white font-bold">{block.capacity}</span></p>
                      <p className="text-gray-300">Occupied: <span className="text-orange-400 font-bold">{block.occupied}</span></p>
                      <p className="text-gray-300">Available: <span className="text-green-400 font-bold">{block.available}</span></p>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full"
                        style={{ width: `${(block.occupied / block.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Types */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Room Types & Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roomTypes.map((room, idx) => (
                  <div key={idx} className="border-2 border-green-500 rounded-lg p-6 bg-slate-700">
                    <h3 className="text-lg font-bold text-white mb-2">{room.type}</h3>
                    <p className="text-gray-300 mb-3">👥 {room.personCapacity} person{room.personCapacity > 1 ? 's' : ''}</p>
                    <p className="text-2xl font-bold text-green-400 mb-4">{room.fee}</p>
                    <div className="space-y-1 mb-4">
                      {room.amenities.map((amenity, aidx) => (
                        <p key={aidx} className="text-gray-300 text-sm">✓ {amenity}</p>
                      ))}
                    </div>
                    <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition">
                      Apply for Room
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hostel Facilities */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">🏛️ Hostel Facilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hostelFacilities.map((facility, idx) => (
                  <div key={idx} className="bg-slate-700 rounded-lg p-4 hover:shadow-lg transition">
                    <p className="text-3xl mb-2">{facility.icon}</p>
                    <h3 className="text-white font-bold mb-1">{facility.name}</h3>
                    <p className="text-gray-400 text-sm">{facility.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hostel Rules */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">📋 Hostel Rules & Guidelines</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Gate closure time: 10:00 PM (9:30 PM on weekdays)</li>
                <li>✓ Visitors allowed: 6:00 PM - 8:00 PM only</li>
                <li>✓ No loud music or gatherings after 11:00 PM</li>
                <li>✓ Alcohol and smoking strictly prohibited</li>
                <li>✓ Mess timings: Breakfast 7-8 AM, Lunch 12-1 PM, Dinner 7-8 PM</li>
                <li>✓ Monthly maintenance fee: ₹500 (for common areas repair)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
