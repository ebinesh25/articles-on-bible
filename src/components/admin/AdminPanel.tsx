import React, { useState } from 'react';
import { useSupabaseContext } from '../../contexts/SupabaseContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import PageEditor from './PageEditor';
import { DynamicPage } from '../../types';

type AdminView = 'login' | 'dashboard' | 'create' | 'edit';

const AdminPanel: React.FC = () => {
  const { user, loading } = useSupabaseContext();
  const [currentView, setCurrentView] = useState<AdminView>('login');
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return (
      <AdminLogin 
        onLoginSuccess={() => setCurrentView('dashboard')} 
      />
    );
  }

  const handleCreatePage = () => {
    setEditingPage(null);
    setCurrentView('create');
  };

  const handleEditPage = (page: DynamicPage) => {
    setEditingPage(page);
    setCurrentView('edit');
  };

  const handleSavePage = () => {
    setCurrentView('dashboard');
    setEditingPage(null);
  };

  const handleCancelEdit = () => {
    setCurrentView('dashboard');
    setEditingPage(null);
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  // Render based on current view
  switch (currentView) {
    case 'dashboard':
      return (
        <AdminDashboard
          onLogout={handleLogout}
          onCreatePage={handleCreatePage}
          onEditPage={handleEditPage}
        />
      );

    case 'create':
      return (
        <>
          <AdminDashboard
            onLogout={handleLogout}
            onCreatePage={handleCreatePage}
            onEditPage={handleEditPage}
          />
          <PageEditor
            page={null}
            onSave={handleSavePage}
            onCancel={handleCancelEdit}
          />
        </>
      );

    case 'edit':
      return (
        <>
          <AdminDashboard
            onLogout={handleLogout}
            onCreatePage={handleCreatePage}
            onEditPage={handleEditPage}
          />
          <PageEditor
            page={editingPage}
            onSave={handleSavePage}
            onCancel={handleCancelEdit}
          />
        </>
      );

    default:
      return (
        <AdminLogin 
          onLoginSuccess={() => setCurrentView('dashboard')} 
        />
      );
  }
};

export default AdminPanel;