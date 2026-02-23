import React, { useState, useEffect } from 'react';

function LibraryManagement({ user }) {
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const regNo = user?.regNo || (user?.email && user.email.split('@')[0]);

  useEffect(() => {
    Promise.all([
      fetch('https://campus-management-system-production.up.railway.app/api/library/books').then(r => r.json()),
      regNo ? fetch(`https://campus-management-system-production.up.railway.app/api/library/issued-books/${regNo}`).then(r => r.json()) : Promise.resolve([])
    ])
    .then(([booksData, issuedData]) => {
      setBooks(booksData);
      setIssuedBooks(issuedData);
      setLoading(false);
    })
    .catch(err => { console.error(err); setLoading(false); });
  }, [regNo]);

  const issueBook = async (bookId) => {
    try {
      const res = await fetch('https://campus-management-system-production.up.railway.app/api/library/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNo,
          bookId,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      });
      if (res.ok) {
        alert('Book issued successfully.');
        window.location.reload();
      }
    } catch (err) {
      alert('Could not issue book');
      console.error(err);
    }
  };

  const returnBook = async (issueId) => {
    try {
      const res = await fetch('https://campus-management-system-production.up.railway.app/api/library/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId })
      });
      if (res.ok) {
        alert('Book returned successfully.');
        window.location.reload();
      }
    } catch (err) {
      alert('Could not return book');
      console.error(err);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Library Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Issued Books */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">My Issued Books</h2>
            {issuedBooks.length > 0 ? (
              <div className="space-y-3">
                {issuedBooks.map(issue => {
                  const book = books.find(b => b.id === issue.bookId);
                  return (
                    <div key={issue.id} className="bg-white/5 p-4 rounded-lg">
                      <div className="font-semibold text-white">{book?.title}</div>
                      <div className="text-sm text-gray-300">Issued: {issue.issuedAt}</div>
                      <div className="text-sm text-gray-300">Due: {issue.dueDate}</div>
                      <button
                        onClick={() => returnBook(issue.id)}
                        className="mt-2 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition"
                      >
                        Return Book
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400">No books issued</p>
            )}
          </div>

          {/* Available Books */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Available Books</h2>
            <div className="space-y-3">
              {books.map(book => (
                <div key={book.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="font-semibold text-white">{book.title}</div>
                  <div className="text-sm text-gray-300">Author: {book.author}</div>
                  <div className="text-sm text-gray-300">Available: {book.available}/{book.total}</div>
                  <button
                    onClick={() => issueBook(book.id)}
                    disabled={book.available <= 0}
                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition disabled:bg-gray-500"
                  >
                    {book.available > 0 ? 'Issue Book' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryManagement;
