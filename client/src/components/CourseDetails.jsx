import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    ArrowLeft, CheckSquare, FileText, Download, 
    Trash2, Clock, BookOpen, LayoutGrid, 
    MoreVertical, Plus, ExternalLink, X, Upload
} from 'lucide-react';
import './CourseDetails.css';

const CourseDetails = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('id');
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState('tasks');
    const [course, setCourse] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.token || !courseId) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                const [courseRes, tasksRes, materialsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/courses/${courseId}`, config),
                    axios.get(`http://localhost:5000/api/tasks/course/${courseId}`, config),
                    axios.get(`http://localhost:5000/api/materials/${courseId}`, config)
                ]);

                setCourse(courseRes.data);
                setTasks(tasksRes.data);
                setMaterials(materialsRes.data);

            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, courseId]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create form data
        const formData = new FormData();
        formData.append('materialFile', file);
        formData.append('title', file.name.split('.').slice(0, -1).join('.')); // Default title to filename

        setUploading(true);
        try {
            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}` 
                }
            };
            const res = await axios.post(`http://localhost:5000/api/materials/${courseId}`, formData, config);
            setMaterials(prev => [...prev, res.data]);
            alert('File uploaded successfully!');
        } catch (err) {
            console.error("Upload error:", err);
            alert(err.response?.data?.message || 'Failed to upload file');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteMaterial = async (materialId) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`http://localhost:5000/api/materials/${courseId}/${materialId}`, config);
            setMaterials(prev => prev.filter(m => m._id !== materialId));
        } catch (err) {
            console.error("Delete error:", err);
            alert('Failed to delete material');
        }
    };

    if (loading) return (
        <div className="course-details-root">
            <div className="container">
                <div className="content-limit" style={{textAlign: 'center', paddingTop: '5rem'}}>
                    Loading details...
                </div>
            </div>
        </div>
    );

    if (!course) return (
        <div className="course-details-root">
            <div className="container">
                <div className="content-limit" style={{textAlign: 'center', paddingTop: '5rem'}}>
                    Course not found.
                </div>
            </div>
        </div>
    );

    return (
        <div className="course-details-root">
            <div className="container">
                <div className="content-limit">
                    
                    <div className="header-section" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '2rem', minHeight: '80px'}}>
                        <Link to="/courses" className="back-btn" style={{position: 'absolute', left: 0}}>
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="header-text" style={{textAlign: 'center'}}>
                            <h1 className="header-title" style={{fontSize: '3rem', fontWeight: '800', margin: 0, background: 'linear-gradient(135deg, #ffffff 0%, var(--light-accent) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{course.courseTitle}</h1>
                            <p className="header-description" style={{color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem'}}>{course.courseCode} • {course.semester}</p>
                        </div>
                    </div>

                    <div className="thin-line"></div>

                    <div className="stats-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem'}}>
                        <div className="stat-card" style={{background: 'var(--bg-secondary)', backdropFilter: 'blur(15px)', border: '1px solid var(--border-color)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem'}}>
                            <div style={{width: '3.5rem', height: '3.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>
                                <CheckSquare size={24} />
                            </div>
                            <div>
                                <span style={{display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px'}}>Total Tasks</span>
                                <h2 style={{fontSize: '1.75rem', fontWeight: '700', margin: 0}}>{tasks.length}</h2>
                            </div>
                        </div>
                        <div className="stat-card" style={{background: 'var(--bg-secondary)', backdropFilter: 'blur(15px)', border: '1px solid var(--border-color)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem'}}>
                            <div style={{width: '3.5rem', height: '3.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <span style={{display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px'}}>Files</span>
                                <h2 style={{fontSize: '1.75rem', fontWeight: '700', margin: 0}}>{materials.length}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{background: 'var(--bg-secondary)', borderRadius: '2rem', padding: '2.5rem', border: '1px solid var(--border-color)', backdropFilter: 'blur(20px)'}}>
                        
                        <div className="toggle-container" style={{background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '1rem', display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', position: 'relative'}}>
                            <button 
                                className={`toggle-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                                onClick={() => setActiveTab('tasks')}
                                style={{flex: 1, padding: '0.8rem', borderRadius: '0.75rem', border: 'none', background: activeTab === 'tasks' ? 'var(--accent-blue)' : 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s'}}
                            >
                                Tasks
                            </button>
                            <button 
                                className={`toggle-btn ${activeTab === 'materials' ? 'active' : ''}`}
                                onClick={() => setActiveTab('materials')}
                                style={{flex: 1, padding: '0.8rem', borderRadius: '0.75rem', border: 'none', background: activeTab === 'materials' ? 'var(--accent-blue)' : 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s'}}
                            >
                                Materials
                            </button>
                        </div>

                        <div className="panel-content">
                            {activeTab === 'tasks' ? (
                                <div className="data-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                    {tasks.length === 0 ? (
                                        <p className="empty-msg" style={{textAlign: 'center', color: 'var(--text-muted)'}}>No tasks for this course</p>
                                    ) : (
                                        tasks.map(task => (
                                            <div 
                                                key={task._id} 
                                                className="list-item" 
                                                onClick={() => navigate(`/tasks/${task._id}`)}
                                                style={{background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', border: '1px solid var(--border-color)', transition: 'all 0.2s'}}
                                            >
                                                <div style={{color: task.status === 'completed' ? '#10b981' : 'var(--text-muted)'}}>
                                                    <CheckSquare size={20} />
                                                </div>
                                                <div style={{flex: 1}}>
                                                    <h3 style={{fontSize: '1.1rem', margin: 0, textDecoration: task.status === 'completed' ? 'line-through' : 'none', opacity: task.status === 'completed' ? 0.6 : 1}}>{task.title}</h3>
                                                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.25rem'}}>
                                                        <Clock size={12}/> Due {new Date(task.deadline).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <ExternalLink size={16} style={{opacity: 0.3}} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="data-list" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        style={{display: 'none'}} 
                                        onChange={handleFileUpload}
                                        accept=".pdf,.doc,.docx,image/*"
                                    />
                                    
                                    <div 
                                        className="upload-placeholder list-item"
                                        onClick={() => fileInputRef.current.click()}
                                        style={{borderStyle: 'dashed', borderDashArray: '10 10', justifyContent: 'center', background: 'rgba(59, 130, 246, 0.05)', color: 'var(--accent-blue)', height: '80px'}}
                                    >
                                        {uploading ? (
                                            <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                <Upload size={20} className="pulse-icon"/> Uploading...
                                            </span>
                                        ) : (
                                            <span style={{display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600'}}>
                                                <Plus size={24} /> Add New Material
                                            </span>
                                        )}
                                    </div>

                                    {materials.length === 0 ? null : (
                                        materials.map(material => (
                                            <div 
                                                key={material._id} 
                                                className="list-item"
                                                style={{background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid var(--border-color)'}}
                                            >
                                                <div style={{width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)'}}>
                                                    <FileText size={24} />
                                                </div>
                                                <div style={{flex: 1}}>
                                                    <h3 style={{fontSize: '1.1rem', margin: 0}}>
                                                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                                                            {material.title}
                                                        </a>
                                                    </h3>
                                                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Shared {new Date(material.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="download-btn">
                                                        <Download size={18} />
                                                    </a>
                                                    <button onClick={() => handleDeleteMaterial(material._id)} className="download-btn" style={{color: '#ef4444'}}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
