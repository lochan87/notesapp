import React, { useState, useRef, useEffect, useCallback } from 'react';
import { noteApi, Note } from '../services/api';

interface CreateNoteModalProps {
  show: boolean;
  onHide: () => void;
  onNoteCreated: (note: Note) => void;
  folderId: string;
}

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

// Client-side image optimization to prevent >4.5MB Vercel serverless body rejection
const compressImage = (file: File, maxDim = 1600, quality = 0.85): Promise<File> => {
  return new Promise((resolve) => {
    if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, '.jpg'),
              { type: 'image/jpeg', lastModified: Date.now() }
            );
            resolve(optimizedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ 
  show, 
  onHide, 
  onNoteCreated, 
  folderId 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    isPinned: false
  });
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Clean up all object URLs when component unmounts or modal closes
  const clearImages = useCallback(() => {
    imageItems.forEach(item => URL.revokeObjectURL(item.previewUrl));
    setImageItems([]);
  }, [imageItems]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      content: '',
      tags: '',
      isPinned: false
    });
    clearImages();
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (contentTextareaRef.current) {
      contentTextareaRef.current.style.height = 'auto';
    }
  }, [clearImages]);

  const handleHide = useCallback(() => {
    if (!loading) {
      resetForm();
      onHide();
    }
  }, [loading, resetForm, onHide]);

  // Handle ESC key press
  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        handleHide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, loading, handleHide]);

  const processFiles = async (files: File[]) => {
    setError('');
    const validFiles: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image file.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 10MB maximum limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (imageItems.length + validFiles.length > 5) {
      setError('You can only attach up to 5 images per note.');
      return;
    }

    // Compress & generate previews safely
    const newItems: ImageItem[] = [];
    for (const file of validFiles) {
      const optimized = await compressImage(file);
      const previewUrl = URL.createObjectURL(optimized);
      newItems.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file: optimized,
        previewUrl
      });
    }

    setImageItems(prev => [...prev, ...newItems]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const removeImage = (id: string) => {
    setImageItems(prev => {
      const target = prev.find(i => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  // Clipboard paste support (Ctrl+V screenshot / image)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const pastedFiles: File[] = [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      e.preventDefault();
      processFiles(pastedFiles);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
    // Auto-expand textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.max(120, e.target.scrollHeight)}px`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Note title is required.');
      return;
    }

    if (!formData.content.trim()) {
      setError('Note content is required.');
      return;
    }

    try {
      setLoading(true);

      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const newNote = await noteApi.create({
        title: formData.title.trim(),
        content: formData.content.trim(),
        folderId,
        tags,
        isPinned: formData.isPinned,
        images: imageItems.map(i => i.file)
      });

      onNoteCreated(newNote);
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        onClick={handleHide}
      />

      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex={-1} 
        style={{ zIndex: 1055 }}
        onPaste={handlePaste}
        role="dialog"
        aria-modal="true"
        aria-labelledby="createNoteModalTitle"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" style={{ maxHeight: '90vh' }}>
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title d-flex align-items-center" id="createNoteModalTitle">
                <i className="bi bi-file-earmark-plus text-primary me-2"></i>
                Create New Note
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleHide}
                disabled={loading}
                aria-label="Close"
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
                    <div>{error}</div>
                    <button 
                      type="button" 
                      className="btn-close ms-auto" 
                      onClick={() => setError('')} 
                      aria-label="Dismiss alert"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="noteTitle" className="form-label fw-semibold">
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="noteTitle"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter note title..."
                    maxLength={200}
                    disabled={loading}
                    autoFocus
                  />
                  <div className="form-text d-flex justify-content-between">
                    <span>A clear, descriptive title</span>
                    <span>{formData.title.length}/200</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="noteContent" className="form-label fw-semibold">
                    Content <span className="text-danger">*</span>
                  </label>
                  <textarea
                    ref={contentTextareaRef}
                    className="form-control"
                    id="noteContent"
                    rows={5}
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your note content here... URLs will automatically convert to clickable links."
                    maxLength={10000}
                    disabled={loading}
                    style={{ minHeight: '120px', resize: 'vertical' }}
                  />
                  <div className="form-text d-flex justify-content-between">
                    <span>URLs convert to links automatically</span>
                    <span>{formData.content.length}/10,000</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="noteTags" className="form-label fw-semibold">
                    Tags
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="noteTags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., work, personal, meeting, idea"
                    disabled={loading}
                  />
                  <div className="form-text">
                    Separate multiple tags with commas
                  </div>
                </div>

                {/* Drag-and-drop & File Upload Area */}
                <div className="mb-3">
                  <label className="form-label fw-semibold d-flex justify-content-between">
                    <span>Images <small className="text-muted fw-normal">({imageItems.length}/5)</small></span>
                    <span className="small text-muted">Paste image with Ctrl+V</span>
                  </label>
                  
                  <div 
                    className={`p-3 rounded border text-center transition-all ${
                      isDragOver ? 'border-primary bg-primary bg-opacity-10' : 'border-dashed'
                    }`}
                    style={{ 
                      borderStyle: 'dashed', 
                      borderWidth: '2px',
                      cursor: imageItems.length >= 5 ? 'not-allowed' : 'pointer'
                    }}
                    onDragOver={(e) => { e.preventDefault(); if (imageItems.length < 5) setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      if (imageItems.length < 5 && e.dataTransfer.files) {
                        processFiles(Array.from(e.dataTransfer.files));
                      }
                    }}
                    onClick={() => {
                      if (imageItems.length < 5 && fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="d-none"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={loading || imageItems.length >= 5}
                    />
                    <i className="bi bi-cloud-arrow-up text-primary fs-3 mb-1 d-block" />
                    <span className="fw-medium">
                      {imageItems.length >= 5 
                        ? 'Image limit reached (max 5)' 
                        : 'Click to upload or drag & drop images here'}
                    </span>
                    <div className="small text-muted mt-1">
                      Supports JPG, PNG, WebP (auto-optimized)
                    </div>
                  </div>

                  {/* Image Previews */}
                  {imageItems.length > 0 && (
                    <div className="d-flex flex-wrap gap-3 mt-3">
                      {imageItems.map((item, index) => (
                        <div key={item.id} className="position-relative" style={{ width: '88px' }}>
                          <img
                            src={item.previewUrl}
                            alt={`Preview ${index + 1}`}
                            className="rounded border shadow-sm w-100"
                            style={{
                              height: '88px',
                              objectFit: 'cover'
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                            style={{ 
                              width: '24px', 
                              height: '24px', 
                              transform: 'translate(30%, -30%)' 
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(item.id);
                            }}
                            disabled={loading}
                            title="Remove image"
                            aria-label={`Remove image ${index + 1}`}
                          >
                            <i className="bi bi-x fs-6"></i>
                          </button>
                          <div 
                            className="text-truncate text-muted small mt-1 text-center" 
                            title={item.file.name}
                            style={{ fontSize: '0.72rem' }}
                          >
                            {item.file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="notePinned"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
                      disabled={loading}
                    />
                    <label className="form-check-label fw-medium" htmlFor="notePinned">
                      <i className="bi bi-pin-angle me-1 text-warning"></i>
                      Pin this note to top
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary px-3"
                  onClick={handleHide}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 d-inline-flex align-items-center"
                  disabled={loading || !formData.title.trim() || !formData.content.trim()}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-lg me-2" />
                      Create Note
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNoteModal;
