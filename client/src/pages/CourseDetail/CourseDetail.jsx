import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, CheckSquare, FileText, FolderOpen, X, ArrowLeft } from 'lucide-react';
import './CourseDetail.css';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [showAddItem, setShowAddItem] = useState(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [itemAddingLoading, setItemAddingLoading] = useState(false);
  const [itemError, setItemError] = useState(null);

  const [file, setFile] = useState(null);
  const [displayFileName, setDisplayFileName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [materialError, setMaterialError] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!user || !user.token) {
        setLoading(false);
        setError('User not authenticated.');
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const courseResponse = await axios.get(`http://localhost:5000/api/courses/${id}`, config);
        setCourseDetails(courseResponse.data);

        const tasksResponse = await axios.get(`http://localhost:5000/api/courses/${id}/tasks`, config);
        setTasks(tasksResponse.data);

        const assignmentsResponse = await axios.get(`http://localhost:5000/api/courses/${id}/assignments`, config);
        setAssignments(assignmentsResponse.data);
        
        const materialsResponse = await axios.get(`http://localhost:5000/api/materials/${id}`, config);
        setMaterials(materialsResponse.data);


      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(err.response?.data?.msg || 'Failed to fetch course data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, user]);


  const addItem = async (type) => {
    if (!newItemTitle.trim()) {
      setItemError('Title is required.');
      return;
    }
    if (!user || !user.token) {
      setItemError('User not authenticated. Please log in.');
      return;
    }

    setItemAddingLoading(true);
    setItemError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const itemData = { title: newItemTitle, description: newItemDesc };
      let response;

      if (type === 'tasks') {
        response = await axios.post(`http://localhost:5000/api/courses/${id}/tasks`, { ...itemData, completed: false }, config);
        setTasks(prev => [...prev, response.data]);
      } else if (type === 'assignments') {
        response = await axios.post(`http://localhost:5000/api/courses/${id}/assignments`, itemData, config);
        setAssignments(prev => [...prev, response.data]);
      } else if (type === 'materials') {
        setItemError('Please use the file upload section for materials.');
        setItemAddingLoading(false);
        return;
      }
      
      setNewItemTitle('');
      setNewItemDesc('');
      setShowAddItem(null);
    } catch (err) {
      console.error(`Error adding ${type}:`, err);
      setItemError(err.response?.data?.message || `Failed to add ${type}.`);
    } finally {
      setItemAddingLoading(false);
    }
  };

  const toggleTask = async (taskId) => {
    if (!user || !user.token) {
      setItemError('User not authenticated.');
      return;
    }

    const taskToToggle = tasks.find(task => task._id === taskId);
    if (!taskToToggle) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(
        `http://localhost:5000/api/courses/${id}/tasks/${taskId}`,
        { completed: !taskToToggle.completed },
        config
      );
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      ));
    } catch (err) {
      console.error('Error toggling task:', err);
      setItemError(err.response?.data?.message || 'Failed to toggle task.');
    }
  };

  const deleteItem = async (type, itemId) => {
    if (!user || !user.token) {
      setItemError('User not authenticated.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      if (type === 'tasks') {
        await axios.delete(`http://localhost:5000/api/courses/${id}/tasks/${itemId}`, config);
        setTasks(prev => prev.filter(item => item._id !== itemId));
      } else if (type === 'assignments') {
        await axios.delete(`http://localhost:5000/api/courses/${id}/assignments/${itemId}`, config);
        setAssignments(prev => prev.filter(item => item._id !== itemId));
      } else if (type === 'materials') {
        const materialToDelete = materials.find(m => m._id === itemId);
        if (materialToDelete) {
             await handleDeleteMaterial(itemId, materialToDelete.publicId);
             setMaterials(prev => prev.filter(item => item._id !== itemId));
        } else {
            setItemError('Material not found for deletion.');
        }
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      setItemError(err.response?.data?.message || `Failed to delete ${type}.`);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setDisplayFileName(selectedFile.name);
      setIsRenaming(false);
    } else {
      setDisplayFileName('');
    }
  };

  const handleUploadMaterial = async () => {
    if (!user || !user.token) {
      setMaterialError('User not authenticated.');
      return;
    }
    if (!file) {
      setMaterialError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setMaterialError(null);

    const formData = new FormData();
    formData.append('materialFile', file);
    formData.append('title', displayFileName);
    formData.append('description', newItemDesc);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(`http://localhost:5000/api/materials/${id}`, formData, config);
      setFile(null);
      setDisplayFileName('');
      setNewItemDesc('');
      const materialsResponse = await axios.get(`http://localhost:5000/api/materials/${id}`, config);
      setMaterials(materialsResponse.data);
    } catch (err) {
      console.error('Error uploading material:', err);
      setMaterialError(err.response?.data?.message || 'Material upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMaterial = async (materialId, publicId) => {
    if (!user || !user.token) {
      setMaterialError('User not authenticated.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/materials/${id}/${materialId}`, config);
      const materialsResponse = await axios.get(`http://localhost:5000/api/materials/${id}`, config);
      setMaterials(materialsResponse.data);
    } catch (err) {
      console.error('Error deleting material:', err);
      setMaterialError(err.response?.data?.message || 'Material deletion failed.');
    }
  };

  const handleRenameFile = () => {
    setIsRenaming(true);
  };

  const handleSaveRename = () => {
    setIsRenaming(false);
  };

  const handleCancelRename = () => {
    if (file) {
      setDisplayFileName(file.name);
    } else {
      setDisplayFileName('');
    }
    setIsRenaming(false);
  };

  const handleClearFile = () => {
    setFile(null);
    setDisplayFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsRenaming(false);
    setMaterialError(null);
  };

  if (loading) {
    return <div className="container"><div className="content-wrapper">Loading course details...</div></div>;
  }

  if (error) {
    return <div className="container"><div className="content-wrapper error-message">{error}</div></div>;
  }

  if (!courseDetails) {
    return <div className="container"><div className="content-wrapper error-message">Course not found.</div></div>;
  }

  return (
    <div className="container">
      <div className="content-wrapper">
        <button onClick={() => navigate('/courses')} className="btn-back">
          <ArrowLeft size={20} />
          Back to Courses
        </button>

        <div className="course-detail-header">
          <h1>{courseDetails.name}</h1>
          <p>{courseDetails.description}</p>
        </div>


        {showAddItem && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>New {showAddItem.charAt(0).toUpperCase() + showAddItem.slice(1, -1)}</h2>
                <button onClick={() => {setShowAddItem(null); setNewItemTitle(''); setNewItemDesc(''); setItemError(null);}} className="btn-close">
                  <X size={24} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Title"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="input-field"
              />
              <textarea
                placeholder="Description"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                className="textarea-field"
                rows="3"
              />
              <button onClick={() => addItem(showAddItem)} className="btn-submit" disabled={itemAddingLoading}>
                {itemAddingLoading ? 'Adding...' : `Add ${showAddItem.charAt(0).toUpperCase() + showAddItem.slice(1, -1)}`}
              </button>
              {itemError && <p className="error-message">{itemError}</p>}
            </div>
          </div>
        )}

        <div className="sections-grid">

          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <CheckSquare className="icon-green" size={24} />
                <h2>Tasks</h2>
              </div>
              <button onClick={() => setShowAddItem('tasks')} className="btn-add">
                <Plus size={20} />
              </button>
            </div>
            <div className="section-content">
              {tasks.length === 0 ? (
                <p className="empty-message">No tasks yet</p>
              ) : (
                tasks.map(task => (
                  <div key={task._id} className="item-card">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id)}
                      className="task-checkbox"
                    />
                    <div className="item-content">
                      <h3 className={task.completed ? 'completed' : ''}>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                    </div>
                    <button onClick={() => deleteItem('tasks', task._id)} className="btn-delete">
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>


          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <FileText className="icon-orange" size={24} />
                <h2>Assignments</h2>
              </div>
              <button onClick={() => setShowAddItem('assignments')} className="btn-add">
                <Plus size={20} />
              </button>
            </div>
            <div className="section-content">
              {assignments.length === 0 ? (
                <p className="empty-message">No assignments yet</p>
              ) : (
                assignments.map(assignment => (
                  <div key={assignment._id} className="item-card simple">
                    <div className="item-content">
                      <h3>{assignment.title}</h3>
                      {assignment.description && <p>{assignment.description}</p>}
                    </div>
                    <button onClick={() => deleteItem('assignments', assignment._id)} className="btn-delete">
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Materials Section */}
          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <FolderOpen className="icon-blue" size={24} />
                <h2>Materials</h2>
              </div>
              <button onClick={() => fileInputRef.current.click()} className="btn-add">
                <Plus size={20} />
              </button>
            </div>
            <div className="section-content">
                {materialError && <p className="error-message">{materialError}</p>}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                {displayFileName && (
                    <div className="selected-file-preview item-card">
                        {isRenaming ? (
                            <input
                                type="text"
                                value={displayFileName}
                                onChange={(e) => setDisplayFileName(e.target.value)}
                                onBlur={handleSaveRename}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveRename();
                                    if (e.key === 'Escape') handleCancelRename();
                                }}
                                autoFocus
                                className="input-field"
                            />
                        ) : (
                            <div className="item-content">
                                <h3>{displayFileName}</h3>
                                {newItemDesc && <p>{newItemDesc}</p>}
                            </div>
                        )}
                        <div className="file-actions" style={{display: 'flex', gap: '0.5rem'}}>
                            {!isRenaming && <button onClick={handleRenameFile} className="action-btn">Rename</button>}
                            {isRenaming && <button onClick={handleSaveRename} className="action-btn">Save</button>}
                            {isRenaming && <button onClick={handleCancelRename} className="action-btn">Cancel</button>}
                            <button onClick={handleClearFile} className="action-btn btn-delete">Clear</button>
                            <button onClick={handleUploadMaterial} className="action-btn btn-submit" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                )}
              {materials.length === 0 && !displayFileName ? (
                <p className="empty-message">No materials yet</p>
              ) : (
                materials.map(material => (
                  <div key={material._id} className="item-card simple">
                    <div className="item-content">
                      <h3>
                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                          {material.title}
                        </a>
                      </h3>
                      {material.description && <p>{material.description}</p>}
                    </div>
                    <button onClick={() => deleteItem('materials', material._id)} className="btn-delete">
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}