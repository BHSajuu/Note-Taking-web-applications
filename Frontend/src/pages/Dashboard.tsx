
const Dashboard = () => {
  return (
    <div>
      {/* 1. Header/Navbar */}
      <header className="p-4 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Notes</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, [User Name]!</span>
            <button className="px-4 py-2 text-white bg-red-500 rounded-md">Logout</button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="container p-4 mx-auto mt-6">
        {/* Create Note Form */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Create a New Note</h2>
            <form>
                <input type="text" placeholder="Note title" className="w-full p-3 mb-4 border rounded-md" />
                <textarea placeholder="Note content..." className="w-full p-3 mb-4 border rounded-md" rows={4}></textarea>
                <button type="submit" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md">Add Note</button>
            </form>
        </div>

        {/* Notes List */}
        <div>
            <h2 className="mb-4 text-xl font-semibold">Your Notes</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* NoteCard components will be mapped here */}
                <p>Your notes will appear here...</p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;