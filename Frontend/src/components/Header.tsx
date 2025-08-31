
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { logout } = useAuth();

  return (
    <div className="bg-gray-200 flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div className="flex items-center">
        <img src="/logo.png" alt="logo" className='w-14 h-10' />
        <span className="text-2xl font-semibold text-gray-900">Dashboard</span>
      </div>
      <button
        onClick={logout}
        className="bg-red-400 rounded-3xl px-3 py-2 text-white font-medium hover:bg-red-500 hover:scale-110 hover:shadow-lg transition-all duration-300"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Header;
