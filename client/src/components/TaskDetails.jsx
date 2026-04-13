import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Calendar, FileText, BarChart2, Tag,
    CheckCircle, Clock, Plus, X, Upload, Trash2, Edit,
    Info, LayoutGrid, Download, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './TaskDetails.css';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [taskMaterials, setTaskMaterials] = useState([]);
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'materials'
    const [file, setFile] = useState(null);
    const [displayFileName, setDisplayFileName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [materialError, setMaterialError] = useState(null);
    const fileInputRef = useRef(null);

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'info' // 'info' or 'danger'
    });

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editFormData, setEditFormData] = useState({ 
        title: '', 
        description: '', 
        category: '', 
        difficulty: 5, 
        weight: 0, 
        deadline: '' 
    });

    // Floating action menu state
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && !event.target.closest('.floating-button-wrapper')) setIsMenuOpen(false);
        };
        if (isMenuOpen) document.addEventListener('click', handleClickOutside);
        else document.removeEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    useEffect(() => {
        const fetchTaskData = async () => {
            if (!user || !user.token) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                // Fetch task details
                const res = await fetch(`http://localhost:5000/api/tasks/${id}`, config);
                if (!res.ok) throw new Error('Failed to fetch task');
                const data = await res.json();
                setTask(data);

                // Fetch task-specific materials
                const matRes = await fetch(`http://localhost:5000/api/materials/task/${id}`, config);
                if (matRes.ok) {
                    const matData = await matRes.json();
                    setTaskMaterials(matData);
                }
            } catch (err) {
                console.error("Error fetching task data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskData();
    }, [id, user]);

    const showAlert = (title, message, type = 'info') => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            onConfirm: null,
            type
        });
    };

    const showConfirm = (title, message, onConfirm) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            onConfirm,
            type: 'danger'
        });
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setDisplayFileName(selectedFile.name);
        } else {
            setDisplayFileName('');
        }
    };

    const handleUploadMaterial = async () => {
        if (!user || !user.token || !file) return;

        setUploading(true);
        setMaterialError(null);

        const formData = new FormData();
        formData.append('materialFile', file);
        formData.append('title', displayFileName);

        try {
            const res = await fetch(`http://localhost:5000/api/materials/task/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            const newMaterial = await res.json();
            setTaskMaterials(prev => [newMaterial, ...prev]);

            // Reset upload state
            setFile(null);
            setDisplayFileName('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            showAlert('Success', 'File uploaded successfully!');
        } catch (err) {
            console.error("Error uploading material:", err);
            setMaterialError(err.message);
            showAlert('Error', err.message, 'danger');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMaterial = async (materialId) => {
        showConfirm(
            'Confirm Deletion',
            'Are you sure you want to delete this material? This action cannot be undone.',
            async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/materials/${materialId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    });

                    if (res.ok) {
                        setTaskMaterials(prev => prev.filter(m => m._id !== materialId));
                    } else {
                        const errorData = await res.json();
                        throw new Error(errorData.message || 'Delete failed');
                    }
                } catch (err) {
                    console.error("Error deleting material:", err);
                    showAlert('Error', 'Failed to delete material: ' + err.message, 'danger');
                }
            }
        );
    };

    const handleDeleteTask = async () => {
        showConfirm(
            'Delete Task',
            'Are you sure you want to delete this task? This will permanently remove all associated materials and comments.',
            async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    });

                    if (res.ok) {
                        // Navigate back to course details if possible, or dashboard
                        if (task.course) {
                            navigate(`/coursedetails?id=${task.course._id}`);
                        } else {
                            navigate('/dashboard');
                        }
                    } else {
                        throw new Error('Failed to delete task');
                    }
                } catch (err) {
                    console.error("Error deleting task:", err);
                    showAlert('Error', 'Failed to delete task', 'danger');
                }
            }
        );
    };

    const openEditModal = () => {
        setEditFormData({
            title: task.title || '',
            description: task.description || '',
            category: task.category || '',
            difficulty: task.difficulty || 5,
            weight: task.weight || 0,
            deadline: task.deadline ? task.deadline.split('T')[0] : ''
        });
        setShowEditModal(true);
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(editFormData)
            });

            if (res.ok) {
                const updatedTask = await res.json();
                setTask(updatedTask);
                setShowEditModal(false);
                showAlert('Success', 'Task updated successfully!');
            } else {
                throw new Error('Update failed');
            }
        } catch (err) {
            console.error("Error updating task:", err);
            showAlert('Error', 'Failed to update task', 'danger');
        } finally {
            setEditLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                const updatedTask = await res.json();
                setTask(updatedTask);
                showAlert('Success', `Task marked as ${newStatus}!`);
            } else {
                throw new Error('Status update failed');
            }
        } catch (err) {
            console.error("Error updating status:", err);
            showAlert('Error', 'Failed to update task status', 'danger');
        }
    };

    if (loading) return (
        <div className="task-details-root">
            <div className="container">
                <div className="content-limit">
                    <div className="loading-state">Loading task details...</div>
                </div>
            </div>
        </div>
    );

    if (!task) return (
        <div className="task-details-root">
            <div className="container">
                <div className="content-limit">
                    <div className="error-state">Task not found</div>
                </div>
            </div>
        </div>
    );

    const formatDate = (date) => {
        if (!date) return 'No Date';
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDifficultyColor = (difficulty) => {
        if (difficulty >= 8) return '#ef4444';
        if (difficulty >= 5) return '#f59e0b';
        return '#10b981';
    };

    return (
        <div className="task-details-root">
            <div className="container">
                <div className="content-limit">
                    {/* Header Section */}
                    <div className="header-section">
                        <button onClick={() => navigate(-1)} className="back-btn">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="header-text">
                            <h1 className="header-title">{task.title}</h1>
                            <p className="header-description">
                                {task.course ? `${task.course.courseCode} • ${task.course.courseTitle}` : task.category || 'General Task'}
                            </p>
                        </div>
                        
                        <div 
                            className="floating-button-wrapper"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => { setIsHovered(false); setHoveredButton(null); }}
                        >
                            <button 
                                className={`add-button ${isHovered || isMenuOpen ? 'plus-active' : ''}`}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <Edit size={28} />
                            </button>

                            {(isHovered || isMenuOpen) && (
                                <>
                                    <button 
                                        className={`action-btn btn-left ${hoveredButton === 1 ? 'is-hovered' : ''}`}
                                        onMouseEnter={() => setHoveredButton(1)}
                                        onClick={() => { openEditModal(); setIsMenuOpen(false); }}
                                        title="Edit Task"
                                    >
                                        <Edit size={18} /> Edit
                                    </button>

                                    <button 
                                        className={`action-btn btn-right ${hoveredButton === 2 ? 'is-hovered' : ''}`}
                                        onMouseEnter={() => setHoveredButton(2)}
                                        onClick={() => { handleDeleteTask(); setIsMenuOpen(false); }}
                                        title="Delete Task"
                                    >
                                        <Trash2 size={18} /> Delete
                                    </button>

                                    <button 
                                        className={`action-btn btn-bottom ${hoveredButton === 3 ? 'is-hovered' : ''}`}
                                        onMouseEnter={() => setHoveredButton(3)}
                                        onClick={() => { handleToggleStatus(); setIsMenuOpen(false); }}
                                        title={task.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete'}
                                    >
                                        {task.status === 'completed' 
                                            ? <><Clock size={18} /> Pending</> 
                                            : <><CheckCircle size={18} /> Complete</>}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="thin-line"></div>

                    {/* Stats Grid - Exactly like CourseDetails */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                <BarChart2 size={24} />
                            </div>
                            <div>
                                <span className="stat-label">Difficulty</span>
                                <h2 className="stat-value" style={{ color: getDifficultyColor(task.difficulty) }}>{task.difficulty}/10</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <span className="stat-label">Materials</span>
                                <h2 className="stat-value">{taskMaterials.length}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Main Glass Panel */}
                    <div className="glass-panel">
                        {/* Tab Toggle - Exactly like CourseDetails */}
                        <div className="toggle-container">
                            <button
                                className={`toggle-btn ${activeTab === 'details' ? 'active' : ''}`}
                                onClick={() => setActiveTab('details')}
                            >
                                Task Details
                            </button>
                            <button
                                className={`toggle-btn ${activeTab === 'materials' ? 'active' : ''}`}
                                onClick={() => setActiveTab('materials')}
                            >
                                Materials
                            </button>
                        </div>

                        <div className="panel-content">
                            {activeTab === 'details' ? (
                                <div className="details-tab-content">
                                    <div className="detail-item-card">
                                        <div className="card-header-row">
                                            <h3 className="section-subtitle">Description</h3>
                                            <span className={`status-badge ${task.status === 'completed' ? 'completed' : 'pending'}`}>
                                                {task.status === 'completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                {task.status || 'Pending'}
                                            </span>
                                        </div>
                                        <p className="description-text">{task.description || 'No description provided for this task.'}</p>

                                        <div className="info-divider"></div>

                                        <div className="meta-info-grid">
                                            <div className="meta-box">
                                                <Calendar size={18} className="meta-icon" />
                                                <div>
                                                    <span className="meta-label">Deadline</span>
                                                    <span className="meta-value">{formatDate(task.deadline || task.date)}</span>
                                                </div>
                                            </div>
                                            <div className="meta-box">
                                                <Tag size={18} className="meta-icon" />
                                                <div>
                                                    <span className="meta-label">Category</span>
                                                    <span className="meta-value">{task.category || 'General'}</span>
                                                </div>
                                            </div>
                                            {task.weight && (
                                                <div className="meta-box">
                                                    <Info size={18} className="meta-icon" />
                                                    <div>
                                                        <span className="meta-label">Weight</span>
                                                        <span className="meta-value">{task.weight}%</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {task.materials && (
                                            <div className="external-link-section">
                                                <h3 className="section-subtitle">External Resource</h3>
                                                <a href={task.materials} target="_blank" rel="noopener noreferrer" className="external-item-link">
                                                    <ExternalLink size={18} />
                                                    <span>View External Resource</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="materials-tab-content">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,image/*"
                                    />

                                    <div
                                        className="upload-placeholder-item"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        {uploading ? (
                                            <span className="upload-status">
                                                <Upload size={20} className="pulse-icon" /> Uploading...
                                            </span>
                                        ) : displayFileName ? (
                                            <div className="preview-mode">
                                                <div className="file-info-preview">
                                                    <FileText size={20} />
                                                    <span className="file-name-text">{displayFileName}</span>
                                                </div>
                                                <div className="preview-actions">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setFile(null); setDisplayFileName(''); }}
                                                        className="preview-btn-icon cancel"
                                                        title="Cancel"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleUploadMaterial(); }}
                                                        className="preview-btn-icon confirm"
                                                        title="Upload"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="add-prompt">
                                                <Plus size={24} /> Add New Material
                                            </span>
                                        )}
                                    </div>

                                    {materialError && <p className="material-error-msg">{materialError}</p>}

                                    <div className="materials-data-list">
                                        {taskMaterials.length === 0 ? (
                                            <p className="empty-msg">No materials uploaded for this task yet.</p>
                                        ) : (
                                            taskMaterials.map(mat => (
                                                <div key={mat._id} className="list-item-material">
                                                    <div className="mat-icon-box">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div className="mat-info-box">
                                                        <h3 className="mat-title">
                                                            <a href={mat.fileUrl} target="_blank" rel="noopener noreferrer">{mat.title}</a>
                                                        </h3>
                                                        <span className="mat-date">Uploaded {new Date(mat.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="mat-actions">
                                                        <a
                                                            href={mat.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mat-btn-circle"
                                                            download={mat.title}
                                                        >
                                                            <Download size={18} />
                                                        </a>
                                                        <button onClick={() => handleDeleteMaterial(mat._id)} className="mat-btn-circle delete">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Modal for Alerts & Confirmation */}
            {modalConfig.isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{modalConfig.title}</h2>
                            <button onClick={closeModal} className="btn-close" style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'rgba(255, 255, 255, 0.5)',
                                cursor: 'pointer',
                                padding: '0.6rem',
                                borderRadius: '50%',
                                display: 'flex',
                                transition: 'all 0.3s ease'
                            }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{modalConfig.message}</p>
                        </div>
                        <div className="modal-actions">
                            {modalConfig.onConfirm ? (
                                <>
                                    <button onClick={closeModal} className="btn-modal-secondary">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            modalConfig.onConfirm();
                                            closeModal();
                                        }}
                                        className={modalConfig.type === 'danger' ? 'btn-modal-danger' : 'btn-modal-primary'}
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button onClick={closeModal} className="btn-modal-primary">
                                    OK
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Task Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal cd-edit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Task</h2>
                            <button onClick={() => setShowEditModal(false)} className="btn-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateTask}>
                            <div className="modal-body">
                                <div className="cd-form-group">
                                    <label>Task Title</label>
                                    <input
                                        type="text"
                                        className="cd-input"
                                        value={editFormData.title}
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="cd-form-group">
                                    <label>Category</label>
                                    <select
                                        className="cd-input"
                                        value={editFormData.category}
                                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                    >
                                        {['Exam', 'Assignment', 'Lab Task', 'Presentation', 'Project', 'General'].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="cd-form-group">
                                    <label>Description</label>
                                    <textarea
                                        className="cd-input"
                                        rows="3"
                                        value={editFormData.description}
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                        style={{ resize: 'none' }}
                                    ></textarea>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="cd-form-group">
                                        <label>Difficulty (1-10)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="cd-input"
                                            value={editFormData.difficulty}
                                            onChange={(e) => setEditFormData({ ...editFormData, difficulty: e.target.value })}
                                        />
                                    </div>
                                    <div className="cd-form-group">
                                        <label>Weight (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="cd-input"
                                            value={editFormData.weight}
                                            onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="cd-form-group">
                                    <label>Deadline</label>
                                    <input
                                        type="date"
                                        className="cd-input"
                                        value={editFormData.deadline}
                                        onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="btn-modal-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-modal-primary"
                                    disabled={editLoading}
                                >
                                    {editLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetails;
