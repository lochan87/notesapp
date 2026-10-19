import React from 'react';
import { Link } from 'react-router-dom';
import { Folder } from '../services/api';

interface FolderCardProps {
  folder: Folder;
  onEdit?: (folder: Folder) => void;
  onDelete?: (folder: Folder) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, onEdit, onDelete }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="card h-100 shadow-sm border-0 folder-card position-relative">
      <div className="card-body d-flex flex-column">
        {/* Header with color indicator & quick actions */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div
            className="rounded shadow-sm"
            style={{
              width: '26px',
              height: '26px',
              backgroundColor: folder.color,
              border: '1.5px solid rgba(0,0,0,0.12)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
            }}
            title={`Folder color: ${folder.color}`}
          />

          {(onEdit || onDelete) && (
            <div className="dropdown" style={{ position: 'relative', zIndex: 2 }}>
              <button
                className="btn btn-sm btn-link text-muted p-1 text-decoration-none"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label={`Options for folder ${folder.name}`}
              >
                <i className="bi bi-three-dots-vertical" />
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                {onEdit && (
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center" 
                      onClick={() => onEdit(folder)}
                    >
                      <i className="bi bi-pencil me-2 text-primary" />
                      Edit Folder
                    </button>
                  </li>
                )}
                {onDelete && (
                  <li>
                    <button 
                      className="dropdown-item text-danger d-flex align-items-center" 
                      onClick={() => onDelete(folder)}
                    >
                      <i className="bi bi-trash me-2" />
                      Delete Folder
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Folder Info */}
        <div className="flex-grow-1">
          <h5 className="card-title mb-2">
            <Link
              to={`/folder/${folder._id}`}
              className="text-decoration-none text-primary stretched-link fw-semibold"
            >
              {folder.name}
            </Link>
          </h5>
          
          {folder.description && (
            <p className="card-text text-muted small mb-2" style={{ lineHeight: 1.5 }}>
              {folder.description.length > 100
                ? `${folder.description.substring(0, 100)}...`
                : folder.description
              }
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
          <div className="d-flex align-items-center text-muted small">
            <i className="bi bi-file-text me-1 text-primary"></i>
            <span>{folder.notesCount} note{folder.notesCount !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="text-muted small">
            <i className="bi bi-calendar3 me-1"></i>
            {formatDate(folder.mainCreatedAt || folder.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
