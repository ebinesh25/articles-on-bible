import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseContext } from '../contexts/SupabaseContext';
import { Settings, User, LogOut, Edit } from 'lucide-react';

// Quick access component for admin features - shows in top corner when logged in
const AdminQuickAccess: React.FC = () => {
  const { user, supabase } = useSupabaseContext();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowMenu(false);
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="relative">
        {/* Admin Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Admin Menu"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-30" 
              onClick={() => setShowMenu(false)}
            />
            
            {/* Menu */}
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-40">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Admin</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <Link
                  to="/admin"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-3" />
                  Content Management
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminQuickAccess;