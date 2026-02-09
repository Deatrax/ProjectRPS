import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState('materials');
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [file, setFile] = useState(null);
  const [displayFileName, setDisplayFileName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [materialError, setMaterialError] = useState(null);

  const fileInputRef = useRef(null); 

  // Fetch Course Details
  useEffect(() => {
    const fetchCourseDetails = async () => {
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
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`, config);
        setCourseDetails(response.data);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError(err.response?.data?.msg || 'Failed to fetch course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, user]);

  // Fetch Materials for the course
  const fetchMaterials = async () => {
    if (!user || !user.token) {
      setMaterialError('User not authenticated.');
      return;
    }
    if (!courseDetails) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`http://localhost:5000/api/materials/${id}`, config);
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setMaterialError(err.response?.data?.msg || 'Failed to fetch materials.');
    }
  };

  useEffect(() => {
    if (selectedOption === 'materials' && courseDetails) {
      fetchMaterials();
    }
  }, [selectedOption, courseDetails, user]);

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
    formData.append('description', ''); 
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
      fetchMaterials(); 
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
      fetchMaterials(); 
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
  };

  const renderContent = () => {
    if (!courseDetails) return <p>No details available.</p>;

    switch (selectedOption) {
      case 'tasks':
        return (
          <div>
            <h3>Tasks for {courseDetails.name}</h3>
            <p>List of tasks will appear here.</p>
          </div>
        );
      case 'assignments':
        return (
          <div>
            <h3>Assignments for {courseDetails.name}</h3>
            <p>List of assignments will appear here.</p>
          </div>
        );
      case 'materials':
        return (
          <div className="materials-section">
            <h3>Materials for {courseDetails.name}</h3>
            {materialError && <p className="error-message">{materialError}</p>}
            
            {/*Upload UI */}
            <div className="upload-material-container">
              <h4>Add New Material</h4>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="add-material-btn"
                disabled={uploading}
              >
                Choose File
              </button>

              {displayFileName && (
                <div className="selected-file-preview">
                  {isRenaming ? (
                    <input
                      type="text"
                      value={displayFileName}
                      onChange={(e) => setDisplayFileName(e.target.value)}
                      onBlur={handleSaveRename} // Save on blur
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveRename();
                        }
                        if (e.key === 'Escape') {
                            handleCancelRename();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <span>{displayFileName}</span>
                  )}
                  <div className="file-actions">
                    {!isRenaming && <button onClick={handleRenameFile} className="action-btn">Rename</button>}
                    {isRenaming && <button onClick={handleSaveRename} className="action-btn">Save</button>}
                    {isRenaming && <button onClick={handleCancelRename} className="action-btn">Cancel</button>}
                    <button onClick={handleClearFile} className="action-btn delete-action-btn">Clear</button>
                    <button onClick={handleUploadMaterial} className="action-btn primary-action-btn" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Materials List */}
            <div className="materials-list">
              <h4>Uploaded Materials</h4>
              {materials.length === 0 ? (
                <p>No materials uploaded yet.</p>
              ) : (
                <ul>
                  {materials.map((material) => (
                    <li key={material._id} className="material-item">
                      <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                        {material.title}
                      </a>
                      {material.description && <p className="material-description">{material.description}</p>}
                      <button onClick={() => handleDeleteMaterial(material._id, material.publicId)} className="delete-btn">
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h3>Welcome to {courseDetails.name} Details</h3>
            <p>Select an option from the sidebar.</p>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="course-detail-page">Loading course details...</div>;
  }

  if (error) {
    return <div className="course-detail-page error-message">{error}</div>;
  }

  return (
    <div className="course-detail-page">
      <div className="course-detail-sidebar">
        <h2>Course Options</h2>
        <ul>
          <li
            className={selectedOption === 'tasks' ? 'active' : ''}
            onClick={() => setSelectedOption('tasks')}
          >
            Tasks
          </li>
          <li
            className={selectedOption === 'assignments' ? 'active' : ''}
            onClick={() => setSelectedOption('assignments')}
          >
            Assignments
          </li>
          <li
            className={selectedOption === 'materials' ? 'active' : ''}
            onClick={() => setSelectedOption('materials')}
          >
            Materials
          </li>
        </ul>
      </div>
      <div className="course-detail-content">
        {courseDetails && (
          <>
            <h2>{courseDetails.name} ({courseDetails.code})</h2>
            <p>{courseDetails.description}</p>
          </>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default CourseDetail;
