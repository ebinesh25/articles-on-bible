import React, { useState } from 'react';
import { useSupabaseContext } from '../../contexts/SupabaseContext';
import { useContent } from '../../hooks/useContent';
import { Plus, Edit, Trash2, Eye, LogOut, User } from 'lucide-react';
import { DynamicPage } from '../../types';
import LoadingSpinner from '../LoadingSpinner';

interface AdminDashboardProps {
  onLogout: () => void;
  onCreatePage: () => void;
  onEditPage: (page: DynamicPage) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onCreatePage, onEditPage }) => {
  const { user, supabase } = useSupabaseContext();
  const { contentData, loading, error, refetch } = useContent();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }

    setDeletingId(pageId);
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (error) {
        alert('Error deleting page: ' + error.message);
      } else {
        refetch();
      }
    } catch (err) {
      alert('Unexpected error deleting page');
    } finally {
      setDeletingId(null);
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'warm': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cool': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'nature': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error: {error}</div>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
              <p className="text-gray-600">Manage your spiritual journey content</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2" />
                <span className="text-sm">{user?.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Pages</h3>
            <p className="text-3xl font-bold text-blue-600">{contentData?.pages.length || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Published</h3>
            <p className="text-3xl font-bold text-green-600">{contentData?.pages.length || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Author</h3>
            <p className="text-lg text-gray-600">{contentData?.author.english || 'Not set'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Pages</h2>
          
          <button
            onClick={onCreatePage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Page
          </button>
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {!contentData?.pages.length ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-4">No pages found</p>
              <button
                onClick={onCreatePage}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Page
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Theme
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contentData.pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {page.title.english}
                          </div>
                          <div className="text-sm text-gray-500">
                            {page.title.tamil}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            ID: {page.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getThemeColor(page.theme)}`}>
                          {page.theme}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>Tamil: {page.content.tamil.length} items</div>
                        <div>English: {page.content.english.length} items</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <a
                            href={`/article/${page.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="View page"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          
                          <button
                            onClick={() => onEditPage(page)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Edit page"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeletePage(page.id)}
                            disabled={deletingId === page.id}
                            className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                            title="Delete page"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;