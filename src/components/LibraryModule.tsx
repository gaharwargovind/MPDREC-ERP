import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Tag, 
  User, 
  FileSpreadsheet,
  X
} from 'lucide-react';
import { LibraryBook, Student, AuthSession } from '../types/erp';

interface LibraryModuleProps {
  books: LibraryBook[];
  students: Student[];
  onUpdateBooks: (books: LibraryBook[]) => void;
  onUpdateStudent: (student: Student) => void;
  session: AuthSession;
}

export const LibraryModule: React.FC<LibraryModuleProps> = ({
  books,
  students,
  onUpdateBooks,
  onUpdateStudent,
  session,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  
  // Modals state
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);

  // Issue Form state
  const [targetStudentRoll, setTargetStudentRoll] = useState(students[0]?.rollNo || '');
  const [returnDays, setReturnDays] = useState(14);

  // Add Book Form state
  const [newBookForm, setNewBookForm] = useState({
    title: '',
    author: '',
    isbn: '978-0131103627',
    department: 'Computer Science',
    shelfLocation: 'Shelf CS-05',
    totalCopies: 5,
    availableCopies: 5,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80',
  });

  const filteredBooks = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.isbn.includes(searchTerm);
    const matchDept = selectedDeptFilter === 'all' || b.department === selectedDeptFilter;
    return matchSearch && matchDept;
  });

  const totalTitles = books.length;
  const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const totalAvailable = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const totalIssued = totalCopies - totalAvailable;

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || selectedBook.availableCopies <= 0) return;

    const student = students.find(s => s.rollNo === targetStudentRoll);
    if (!student) return;

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + returnDays);

    const issueRecord = {
      bookId: selectedBook.id,
      title: selectedBook.title,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      studentRollNo: student.rollNo,
      studentName: student.name,
    };

    // Update Book Record
    const updatedBooks = books.map(b => {
      if (b.id === selectedBook.id) {
        return {
          ...b,
          availableCopies: b.availableCopies - 1,
          issuedTo: [...(b.issuedTo || []), issueRecord]
        };
      }
      return b;
    });

    // Update Student Record
    const updatedStudent: Student = {
      ...student,
      issuedBooks: [
        ...student.issuedBooks,
        {
          bookId: selectedBook.id,
          title: selectedBook.title,
          author: selectedBook.author,
          issueDate: issueRecord.issueDate,
          dueDate: issueRecord.dueDate,
        }
      ]
    };

    onUpdateBooks(updatedBooks);
    onUpdateStudent(updatedStudent);
    setShowIssueModal(false);
  };

  const handleReturnBook = (book: LibraryBook, rollNo: string) => {
    const student = students.find(s => s.rollNo === rollNo);
    
    // Update Book Record
    const updatedBooks = books.map(b => {
      if (b.id === book.id) {
        return {
          ...b,
          availableCopies: Math.min(b.totalCopies, b.availableCopies + 1),
          issuedTo: (b.issuedTo || []).filter(item => item.studentRollNo !== rollNo)
        };
      }
      return b;
    });

    // Update Student Record
    if (student) {
      const updatedStudent: Student = {
        ...student,
        issuedBooks: student.issuedBooks.filter(item => item.bookId !== book.id)
      };
      onUpdateStudent(updatedStudent);
    }

    onUpdateBooks(updatedBooks);
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LibraryBook = {
      id: `BK-${Date.now()}`,
      title: newBookForm.title || 'Introduction to Computer Science',
      author: newBookForm.author || 'Author Name',
      isbn: newBookForm.isbn,
      department: newBookForm.department,
      shelfLocation: newBookForm.shelfLocation,
      totalCopies: Number(newBookForm.totalCopies),
      availableCopies: Number(newBookForm.totalCopies),
      coverUrl: newBookForm.coverUrl,
      issuedTo: [],
    };

    onUpdateBooks([created, ...books]);
    setShowAddBookModal(false);
  };

  const isStaffOrAdmin = session.role === 'admin' || session.role === 'staff' || session.role === 'faculty';

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold mb-1 border border-amber-200 dark:border-amber-800">
              <BookOpen className="w-3.5 h-3.5" /> Central Academic Library
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Textbook Catalog, Real-Time Copies & Book Circulation
            </h2>
          </div>

          {isStaffOrAdmin && (
            <button
              onClick={() => setShowAddBookModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/20"
              id="btn-add-book-catalog"
            >
              <Plus className="w-4 h-4" /> Add Book to Catalog
            </button>
          )}
        </div>

        {/* HIGH-VISIBILITY CENTRAL LIBRARY INVENTORY & CIRCULATION DECK */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          
          {/* Total Titles */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-amber-500/30 dark:border-amber-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100 font-mono">
                {totalTitles}
              </div>
              <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                Catalog Titles
              </div>
            </div>
          </div>

          {/* Total Volumes */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-blue-500/30 dark:border-blue-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20 shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-blue-950 dark:text-blue-100 font-mono">
                {totalCopies}
              </div>
              <div className="text-[11px] font-bold text-blue-800 dark:text-blue-300">
                Physical Volumes
              </div>
            </div>
          </div>

          {/* Available on Shelves */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-100 font-mono">
                {totalAvailable}
              </div>
              <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                Available on Shelf
              </div>
            </div>
          </div>

          {/* Issued / In Circulation */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-purple-500/30 dark:border-purple-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-purple-950 dark:text-purple-100 font-mono">
                {totalIssued}
              </div>
              <div className="text-[11px] font-bold text-purple-800 dark:text-purple-300">
                Issued to Scholars
              </div>
            </div>
          </div>

        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Title (e.g. Cormen DSA, Tanenbaum OS), Author, or ISBN..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science (CSE)</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mathematics & Science">Applied Sciences & Math</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => {
          const isOutOfStock = book.availableCopies <= 0;
          return (
            <div
              key={book.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {book.department}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">By {book.author}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ISBN:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{book.isbn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shelf Location:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{book.shelfLocation}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 font-medium">Copies Availability:</span>
                    <span className={`font-mono font-black ${isOutOfStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {book.availableCopies} / {book.totalCopies} Available
                    </span>
                  </div>
                </div>

                {/* Active Borrower List */}
                {book.issuedTo && book.issuedTo.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Currently Issued to ({book.issuedTo.length}):
                    </span>
                    <div className="space-y-1">
                      {book.issuedTo.map(item => (
                        <div key={item.studentRollNo} className="flex items-center justify-between text-[11px] bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-lg">
                          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {item.studentRollNo} ({item.studentName.split(' ')[0]})
                          </span>
                          {isStaffOrAdmin && (
                            <button
                              onClick={() => handleReturnBook(book, item.studentRollNo)}
                              className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                            >
                              Return Copy
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Issue Button */}
              {isStaffOrAdmin && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSelectedBook(book);
                      setShowIssueModal(true);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isOutOfStock
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {isOutOfStock ? 'All Copies Checked Out' : 'Issue Book to Student'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ISSUE BOOK MODAL */}
      {showIssueModal && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-base font-bold mb-1 text-slate-900 dark:text-slate-100">Issue Book to Scholar</h3>
            <p className="text-xs text-slate-500 mb-4 font-semibold text-blue-600">{selectedBook.title}</p>
            
            <form onSubmit={handleIssueBook} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Select Enrolled Student</label>
                <select
                  value={targetStudentRoll}
                  onChange={(e) => setTargetStudentRoll(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                >
                  {students.map(s => (
                    <option key={s.rollNo} value={s.rollNo}>
                      {s.rollNo} - {s.name} (Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Loan Duration (Days)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={returnDays}
                  onChange={(e) => setReturnDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Standard AKTU library circulation is 14 days.</span>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowIssueModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD BOOK MODAL */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full">
            <h3 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">Add New Book to Central Catalog</h3>
            
            <form onSubmit={handleCreateBook} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence: A Modern Approach"
                  value={newBookForm.title}
                  onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Author(s)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stuart Russell & Peter Norvig"
                    value={newBookForm.author}
                    onChange={(e) => setNewBookForm({ ...newBookForm, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">ISBN Code</label>
                  <input
                    type="text"
                    value={newBookForm.isbn}
                    onChange={(e) => setNewBookForm({ ...newBookForm, isbn: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Shelf Location</label>
                  <input
                    type="text"
                    value={newBookForm.shelfLocation}
                    onChange={(e) => setNewBookForm({ ...newBookForm, shelfLocation: e.target.value })}
                    placeholder="e.g. Shelf CS-08"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Total Copies Count</label>
                  <input
                    type="number"
                    min={1}
                    value={newBookForm.totalCopies}
                    onChange={(e) => setNewBookForm({ ...newBookForm, totalCopies: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowAddBookModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold">
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
