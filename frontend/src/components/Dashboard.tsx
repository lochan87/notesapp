import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Folder, folderApi } from '../services/api';
import { useData } from '../contexts/DataContext';
import CreateFolderModal from './CreateFolderModal';
import EditFolderModal from './EditFolderModal';
import ConfirmModal from './ConfirmModal';
import FolderCard from './FolderCard';
import SkeletonGrid from './SkeletonLoader';

const Dashboard: React.FC = () => {
  const { 
    folders, 
    foldersLoaded, 
    foldersLoading, 
    fetchFolders, 
    addFolderLocally,
    updateFolderLocally,
    removeFolderLocally
  } = useData();

  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('noteapp-folder-view-mode') as 'grid' | 'list') || 'grid';
  });

  const handleSetViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    try {
      localStorage.setItem('noteapp-folder-view-mode', mode);
    } catch {}
  };

  useEffect(() => {
    loadFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFolders = async (force = false) => {
    try {
      setError('');
      await fetchFolders(force);
    } catch (err) {
      console.error('Error loading folders:', err);
      setError('Failed to load folders. Please try again.');
    }
  };

  const handleFolderCreated = (newFolder: Folder) => {
    addFolderLocally(newFolder);
    setShowCreateModal(false);
  };

  const handleFolderUpdated = (updatedFolder: Folder) => {
    updateFolderLocally(updatedFolder);
    setFolderToEdit(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!folderToDelete) return;
    try {
      setIsDeleting(true);
      await folderApi.delete(folderToDelete._id);
      removeFolderLocally(folderToDelete._id);
      setFolderToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete folder.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  );

  // Show skeleton only on the very first load — subsequent visits use cached data
  const isInitialLoading = !foldersLoaded && foldersLoading;

  if (isInitialLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col">
            <h1 className="h3 mb-1">
              <i className="bi bi-folder2-open me-2 text-primary" />
              My Folders
            </h1>
            <p className="text-muted mb-0">Loading folders…</p>
          </div>
        </div>
        <SkeletonGrid count={8} type="folder" colClass="col-lg-3 col-md-4 col-sm-6" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h1 className="h3 mb-1">
                <i className="bi bi-folder2-open me-2 text-primary"></i>
                My Folders
              </h1>
              <p className="text-muted mb-0">
                {folders.length} folder{folders.length !== 1 ? 's' : ''} total
                {searchQuery.trim() && ` • ${filteredFolders.length} matching "${searchQuery.trim()}"`}
              </p>
            </div>
            
            <div className="d-flex flex-wrap gap-2 w-100 w-md-auto align-items-center">
              {/* Quick Folder Search */}
              <div className="input-group input-group-sm" style={{ maxWidth: '240px' }}>
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Filter folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="btn btn-outline-secondary border-start-0" 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    title="Clear filter"
                  >
                    <i className="bi bi-x" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="btn-group" role="group" aria-label="View mode">
                <button
                  type="button"
                  className={`btn btn-sm btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => handleSetViewMode('grid')}
                  title="Grid view"
                >
                  <i className="bi bi-grid"></i>
                </button>
                <button
                  type="button"
                  className={`btn btn-sm btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => handleSetViewMode('list')}
                  title="List view"
                >
                  <i className="bi bi-list"></i>
                </button>
              </div>

              {/* Create Folder Button */}
              <button
                className="btn btn-primary btn-sm px-3"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="bi bi-plus-lg me-1"></i>
                Create Folder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="row mb-4">
          <div className="col">
            <div className="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
              <div>{error}</div>
              <button
                type="button"
                className="btn btn-link text-danger ms-auto p-0"
                onClick={() => loadFolders(true)}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folders Content */}
      {folders.length === 0 ? (
        <div className="row">
          <div className="col">
            <div className="empty-state">
              <div className="empty-state-icon folders">
                <i className="bi bi-folder-plus" />
              </div>
              <h4>No folders yet</h4>
              <p>Create your first folder to start organizing your notes. Keep everything tidy and easy to find.</p>
              <button
                className="btn btn-primary btn-lg px-4"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="bi bi-plus-lg me-2" />
                Create Your First Folder
              </button>
            </div>
          </div>
        </div>
      ) : filteredFolders.length === 0 ? (
        <div className="empty-state py-5">
          <div className="empty-state-icon search">
            <i className="bi bi-search" />
          </div>
          <h4>No matching folders</h4>
          <p>No folders match "{searchQuery}". Try a different keyword.</p>
          <button 
            className="btn btn-outline-primary"
            onClick={() => setSearchQuery('')}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="row">
          {viewMode === 'grid' ? (
            filteredFolders.map(folder => (
              <div key={folder._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <FolderCard
                  folder={folder}
                  onEdit={(f) => setFolderToEdit(f)}
                  onDelete={(f) => setFolderToDelete(f)}
                />
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="app-table-header">
                        <tr>
                          <th style={{ width: '35%' }}>Name</th>
                          <th style={{ width: '35%' }}>Description</th>
                          <th>Notes</th>
                          <th>Created</th>
                          <th className="text-end" style={{ width: '120px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFolders.map(folder => (
                          <tr key={folder._id}>
                            <td>
                              <Link
                                to={`/folder/${folder._id}`}
                                className="text-decoration-none text-primary"
                              >
                                <div className="d-flex align-items-center">
                                  <div
                                    className="rounded me-3 flex-shrink-0"
                                    style={{
                                      width: '22px',
                                      height: '22px',
                                      backgroundColor: folder.color,
                                      border: '1.5px solid rgba(0,0,0,0.12)',
                                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
                                    }}
                                  />
                                  <span className="fw-semibold text-truncate">{folder.name}</span>
                                </div>
                              </Link>
                            </td>
                            <td className="text-muted small">
                              <span className="text-truncate d-inline-block" style={{ maxWidth: '300px' }}>
                                {folder.description || 'No description'}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-primary rounded-pill">
                                {folder.notesCount}
                              </span>
                            </td>
                            <td className="text-muted small">
                              {new Date(folder.mainCreatedAt || folder.createdAt).toLocaleDateString()}
                            </td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <Link
                                  to={`/folder/${folder._id}`}
                                  className="btn btn-outline-primary"
                                  title="Open folder"
                                >
                                  <i className="bi bi-eye"></i>
                                </Link>
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() => setFolderToEdit(folder)}
                                  title="Edit folder"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() => setFolderToDelete(folder)}
                                  title="Delete folder"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Folder Modal */}
      <CreateFolderModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onFolderCreated={handleFolderCreated}
      />

      {/* Edit Folder Modal */}
      {folderToEdit && (
        <EditFolderModal
          show={!!folderToEdit}
          folder={folderToEdit}
          onHide={() => setFolderToEdit(null)}
          onFolderUpdated={handleFolderUpdated}
          onFolderDeleted={() => {
            if (folderToEdit) removeFolderLocally(folderToEdit._id);
            setFolderToEdit(null);
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      {folderToDelete && (
        <ConfirmModal
          show={!!folderToDelete}
          title="Delete Folder"
          message={`Are you sure you want to delete "${folderToDelete.name}"? All notes inside this folder will also be removed.`}
          confirmLabel="Delete Folder"
          confirmVariant="danger"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setFolderToDelete(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default Dashboard;
