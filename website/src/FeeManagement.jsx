import { useState } from 'react';

export default function FeeManagement() {
  const [feeData] = useState({
    studentId: '12345',
    studentName: 'Rajesh Kumar',
    totalFeePerSemester: 150000,
    currency: '₹'
  });

  const [feeStructure] = useState([
    { id: 1, component: 'Tuition Fee', amount: 100000, status: 'Paid' },
    { id: 2, component: 'Lab Fee', amount: 15000, status: 'Paid' },
    { id: 3, component: 'Library Fee', amount: 5000, status: 'Paid' },
    { id: 4, component: 'Activity Fee', amount: 15000, status: 'Paid' },
    { id: 5, component: 'Exam Fee', amount: 10000, status: 'Pending' },
    { id: 6, component: 'Hostel Fee', amount: 30000, status: 'Pending' }
  ]);

  const [paymentHistory] = useState([
    { id: 1, date: '01-Feb-2026', amount: 100000, method: 'Online Transfer', receipt: 'RCP001' },
    { id: 2, date: '02-Feb-2026', amount: 15000, method: 'NetBanking', receipt: 'RCP002' },
    { id: 3, date: '05-Feb-2026', amount: 20000, method: 'UPI', receipt: 'RCP003' }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitted, setSubmitted] = useState(false);

  const totalPaid = feeStructure.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = feeStructure.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0);
  const percentagePaid = Math.round((totalPaid / feeData.totalFeePerSemester) * 100);

  const filteredFees = filterStatus === 'all'
    ? feeStructure
    : feeStructure.filter(f => f.status.toLowerCase() === filterStatus.toLowerCase());

  const handlePayment = (e) => {
    e.preventDefault();
    if (paymentAmount > 0 && paymentAmount <= totalPending) {
      setSubmitted(true);
      setPaymentAmount('');
      setTimeout(() => {
        setSubmitted(false);
        setShowPaymentForm(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">💳 Fee Management & Payment</h1>
        <p className="text-gray-300 mb-8">Track and manage your semester fees</p>

        {submitted && (
          <div className="mb-6 p-4 bg-green-600/30 border border-green-500 rounded-lg text-green-400 font-semibold">
            ✓ Payment processed successfully! Check email for receipt.
          </div>
        )}

        {/* Student Info Card */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">👤 Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-300 text-sm">Registration Number</p>
              <p className="text-2xl font-bold text-white">{feeData.studentId}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Student Name</p>
              <p className="text-2xl font-bold text-white">{feeData.studentName}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Current Semester</p>
              <p className="text-2xl font-bold text-white">Sem-1 | 2024-2025</p>
            </div>
          </div>
        </div>

        {/* Fee Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-600 p-6 rounded-lg shadow-lg">
            <p className="text-green-100 text-sm mb-2">Total Paid</p>
            <p className="text-2xl font-bold text-white">{feeData.currency}{totalPaid.toLocaleString()}</p>
            <p className="text-xs text-green-200 mt-2">{percentagePaid}% Complete</p>
          </div>
          <div className="bg-red-600 p-6 rounded-lg shadow-lg">
            <p className="text-red-100 text-sm mb-2">Outstanding</p>
            <p className="text-2xl font-bold text-white">{feeData.currency}{totalPending.toLocaleString()}</p>
            <p className="text-xs text-red-200 mt-2">Due Soon</p>
          </div>
          <div className="bg-blue-600 p-6 rounded-lg shadow-lg">
            <p className="text-blue-100 text-sm mb-2">Total Fee</p>
            <p className="text-2xl font-bold text-white">{feeData.currency}{feeData.totalFeePerSemester.toLocaleString()}</p>
            <p className="text-xs text-blue-200 mt-2">Per Semester</p>
          </div>
          <div className="bg-purple-600 p-6 rounded-lg shadow-lg">
            <p className="text-purple-100 text-sm mb-2">Payment Status</p>
            <p className={`text-2xl font-bold ${totalPending > 0 ? 'text-red-300' : 'text-green-300'}`}>
              {totalPending > 0 ? 'Pending' : 'Paid ✓'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-white">Payment Progress</h3>
            <span className="text-sm text-gray-300">{percentagePaid}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all"
              style={{ width: `${percentagePaid}%` }}
            ></div>
          </div>
        </div>

        {/* Fee Structure */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Fee Structure</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-700 text-white px-4 py-2 rounded border border-purple-500 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="paid">Paid Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-500">
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Fee Component</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Due Date</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map(fee => (
                  <tr key={fee.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="px-4 py-3 text-white font-medium">{fee.component}</td>
                    <td className="px-4 py-3 text-white">{feeData.currency}{fee.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-300">15-Feb-2026</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        fee.status === 'Paid' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {fee.status === 'Pending' && (
                        <button className="text-blue-400 hover:text-blue-300 underline text-sm">
                          Pay Now
                        </button>
                      )}
                      {fee.status === 'Paid' && (
                        <span className="text-green-400 text-sm">✓ Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">💰 Payment History</h2>
          <div className="space-y-3">
            {paymentHistory.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:shadow-lg transition">
                <div>
                  <p className="text-white font-semibold">{payment.method}</p>
                  <p className="text-gray-400 text-sm">Receipt: {payment.receipt}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{feeData.currency}{payment.amount.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">{payment.date}</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition">
                  📥 Receipt
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        {totalPending > 0 && (
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">💳 Available Payment Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-700 border-2 border-blue-600 rounded-lg cursor-pointer hover:shadow-lg transition">
                <p className="text-2xl mb-2">🏦</p>
                <p className="text-white font-semibold">Net Banking</p>
                <p className="text-gray-400 text-xs">All major banks supported</p>
              </div>
              <div className="p-4 bg-slate-700 border-2 border-green-600 rounded-lg cursor-pointer hover:shadow-lg transition">
                <p className="text-2xl mb-2">📱</p>
                <p className="text-white font-semibold">UPI</p>
                <p className="text-gray-400 text-xs">Google Pay, Phone Pe, BHIM</p>
              </div>
              <div className="p-4 bg-slate-700 border-2 border-red-600 rounded-lg cursor-pointer hover:shadow-lg transition">
                <p className="text-2xl mb-2">💳</p>
                <p className="text-white font-semibold">Debit/Credit Card</p>
                <p className="text-gray-400 text-xs">Visa, Mastercard, RuPay</p>
              </div>
            </div>

            {!showPaymentForm ? (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
              >
                💰 Pay Outstanding Balance: {feeData.currency}{totalPending.toLocaleString()}
              </button>
            ) : (
              <form onSubmit={handlePayment} className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4">Make Payment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 block mb-2">Payment Amount</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={`Max: ${feeData.currency}${totalPending.toLocaleString()}`}
                      className="w-full bg-slate-600 text-white px-4 py-2 rounded border border-gray-500"
                      min="0"
                      max={totalPending}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 block mb-2">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-slate-600 text-white px-4 py-2 rounded border border-gray-500"
                    >
                      <option value="card">Debit/Credit Card</option>
                      <option value="netbanking">Net Banking</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded">
                      Process Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPaymentForm(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Info Panel */}
        <div className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">💡 Important Notes</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>✓ Payment deadline is 15th of every month</li>
            <li>✓ Late fees apply after the deadline</li>
            <li>✓ All payments are secure and encrypted</li>
            <li>✓ Receipt will be emailed to your registered email address</li>
            <li>✓ For payment issues, contact Finance Department</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
