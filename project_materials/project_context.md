# Project Context & Progress

## What has been planned and achieved till now

**Achieved:**
- **Project Structure**: Set up a full-stack MERN-like architecture with Vite+React for the frontend and Node+Express backend.
- **Authentication**: User Signup and Login workflows implemented.
- **Courses Management**: Functionality to add, view, and manage courses (Courses, CourseDetail, AddCourse routines).
- **Task Management**: Features covering Tasks and AllTasks modules allowing creation and tracking of tasks within courses.
- **Materials**: Uploading/Managing course materials.
- **Dashboard & Analytics**: Created a Dashboard with an Analytics view for progress tracking.
- **Routing & API Setup**: Backend routes for `auth`, `course`, `courses`, `material`, and `tasks` integrated with matching frontend pages.

**Planned / Next Steps:**
- Further UI/UX enhancements and responsiveness improvements.
- Advanced analytics and visualizations on the dashboard.
- Refinement of task tracking with notifications and deadlines.
- Adding comprehensive error handling and testing.

---

# Codebase: Frontend & Backend

## client\eslint.config.js

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

```

## client\index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>client</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

## client\package.json

```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.13.5",
    "lucide-react": "^0.563.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "vite": "^7.2.4"
  }
}

```

## client\src\App.jsx

```javascript
// src/App.jsx
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './index.css';
import PandaLamp from './components/PandaLamp';
import TaskPicker from './components/TaskPicker';

function App() {
  const [count, setCount] = useState(0);
  const { user, logout } = useAuth();

  return (
    <div>
      {user ? (
        <div>
          {/* <h2>Welcome, {user.name}!</h2>
          <button onClick={logout}>Logout</button>
          <Link to="/dashboard">Go to Dashboard</Link> */}
          <Navigate to="/dashboard" />
          {/* <Dashboard /> */}
        </div>
      ) : (
        <PandaLamp />
      )}
    </div>
  );
}

export default App;

```

## client\src\components\.gitkeep

```

```

## client\src\components\Card.jsx

```javascript
import React from 'react';

const Card = ({ onGetStarted }) => {
  return (
    <div className="card welcome" id="welcomeCard">
      <h2 id="welcomeTitle">Welcome!</h2>
      <p>Ready to get started?</p>
      <button className="primary" id="getStartedBtn" onClick={onGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default Card;
```

## client\src\components\CourseDetails.css

```css
.course-details-root {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #ffffff;
}

.course-details-root .container {
    width: 100%;
    min-height: 100vh;
    padding: 3rem 1rem 120px 1rem;
    box-sizing: border-box;
    background: transparent !important;
}

.course-details-root .content-limit {
    max-width: 1100px;
    margin: 0 auto;
}

.course-details-root .back-btn {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.8rem;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 60;
    text-decoration: none;
}

.course-details-root .back-btn:hover {
    background: var(--hover-bg);
    transform: translateX(-5px);
}

.course-details-root .thin-line {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 233, 166, 0.3), transparent);
    margin-bottom: 3rem;
}

/* Stats Overview Grid */
.course-details-root .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.course-details-root .stat-card {
    background: var(--bg-secondary);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid var(--border-color);
    border-radius: 1.5rem;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    transition: all 0.3s ease;
}

.course-details-root .stat-card:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 233, 166, 0.3);
}

/* Main glass panel */
.course-details-root .glass-panel {
    background: var(--bg-secondary);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: 2rem;
    padding: 2.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Tab Switcher */
.course-details-root .toggle-container {
    background: rgba(0, 0, 0, 0.2);
    padding: 0.5rem;
    border-radius: 1.25rem;
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2.5rem;
    position: relative;
    border: 1px solid var(--border-color);
}

.course-details-root .toggle-btn {
    flex: 1;
    padding: 1rem;
    border-radius: 0.85rem;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 2;
}

.course-details-root .toggle-btn.active {
    color: white;
    background: var(--accent-blue);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.course-details-root .toggle-btn:not(.active):hover {
    color: white;
    background: rgba(255, 255, 255, 0.05);
}

/* Data List Items */
.course-details-root .list-item {
    background: rgba(255, 255, 255, 0.03);
    padding: 1.25rem;
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    cursor: pointer;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
    margin-bottom: 1rem;
}

.course-details-root .list-item:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateX(5px);
    border-color: var(--accent-blue);
}

.course-details-root .download-btn {
    padding: 0.75rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-color);
    transition: all 0.2s;
    cursor: pointer;
}

.course-details-root .download-btn:hover {
    background: var(--accent-blue);
    color: white;
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .course-details-root .glass-panel {
        padding: 1.5rem;
    }
    
    .course-details-root .header-title {
        font-size: 2.2rem !important;
    }
}

```

## client\src\components\CourseDetails.jsx

```javascript
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
                                                    <a 
                                                        href={material.fileUrl.replace('/upload/', '/upload/fl_attachment/')} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="download-btn"
                                                        download={material.title}
                                                    >
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

```

## client\src\components\Lamp.jsx

```javascript
import React from 'react';

const Lamp = ({ toggleLamp }) => {
  return (
    <div className="lamp-wrap">
      <div className="lamp-beam-container">
        <div className="lamp-glow"></div>
      </div>
      <button className="lamp" id="lampBtn" onClick={toggleLamp}>
        <span className="lamp-top"></span>
        <span className="lamp-bulb"></span>
        <span className="lamp-base"></span>
      </button>
    </div>
  );
};

export default Lamp;
```

## client\src\components\Navbar.css

```css
:root {
    --bg-primary: #0b1020;
    --bg-secondary: rgba(255, 255, 255, 0.08);
    --text-primary: rgba(255, 255, 255, 0.9);
    --text-secondary: rgba(255, 255, 255, 0.65);
    --text-muted: rgba(255, 255, 255, 0.45);
    --border-color: rgba(255, 255, 255, 0.1);
    --hover-bg: rgba(255, 255, 255, 0.12);
    --nav-bg: rgba(11, 16, 32, 0.85);
    --accent-blue: #3b82f6;
    --accent-indigo: #6366f1;
}

/* Tooltips */
.nav-item-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.nav-tooltip {
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    white-space: nowrap;
    z-index: 100;
}

.nav-item-wrapper:hover .nav-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* Notch Bottom Navbar */
.notch-navbar-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    /* Increased z-index to be on top of everything */
    display: flex;
    justify-content: center;
    pointer-events: none;
    /* Allow clicks through the empty areas */
}

.notch-navbar {
    pointer-events: auto;
    width: 90%;
    max-width: 600px;
    background: var(--nav-bg);
    /* Dark glassy bg */
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: none;
    /* Merged with bottom */

    /* Variable Rounding: Rounded top corners, square bottom to merge */
    border-radius: 24px 24px 0 0;

    padding: 1rem 2rem;
    padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
    /* Account for iPhone home bar */

    display: flex;
    justify-content: space-between;
    align-items: center;

    box-shadow:
        0 -10px 40px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);

    position: relative;
    transition: box-shadow 0.3s ease, border-top-color 0.3s ease;
}

.nav-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0.5rem;
}

.nav-item:hover {
    color: var(--text-primary);
    transform: translateY(-2px);
}

.nav-item.active {
    color: var(--accent-blue);
}

.nav-item.active::after {
    content: '';
    position: absolute;
    bottom: -5px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: currentColor;
    /* Use currentColor to match active color */
    box-shadow: 0 0 8px currentColor;
}

.nav-item-icon {
    transition: transform 0.3s;
}

.nav-item:hover .nav-item-icon {
    transform: scale(1.1);
}

/* Add a subtle glow at the top edge of the notch */
.notch-navbar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}
```

## client\src\components\Navbar.jsx

```javascript
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home, BookOpen, CheckSquare, TrendingUp, Award, Settings
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Dock items configuration
    const dockItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'Courses', path: '/courses' },
        { icon: CheckSquare, label: 'All Tasks', path: '/tasks' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: Award, label: 'Achievements', path: '/dashboard' },   // Placeholder paths as in original
        { icon: Settings, label: 'Settings', path: '/dashboard' },    // Placeholder paths as in original
    ];

    // Determine active color based on some global state or default
    // For now we  use  default accent color or maybe pass it as a prop coz we want dynamic coloring.
    // If the requirement is "universal" sticking to a theme color or allowing context overrides is best.
    // Let's us a default blue accent for now.
    const defaultColor = '#3b82f6';

    //  to support the dynamic "Pain Score" color globally, we need a Context.
    // Assuming for now we want a consistent look or a default look for pages outside Dashboard.

    return (
        <div className="notch-navbar-container">
            <nav className="notch-navbar" style={{
                borderTop: `2px solid ${defaultColor}`,
                boxShadow: `0 -4px 20px -5px ${defaultColor}40`
            }}>
                {dockItems.map((item, index) => (
                    <BottomNavItem
                        key={index}
                        {...item}
                        isActive={location.pathname === item.path}
                        activeColor={defaultColor}
                    />
                ))}
            </nav>
        </div>
    );
};

// Bottom Nav Item Helper Component
const BottomNavItem = ({ icon: Icon, label, path, isActive, activeColor }) => {
    const navigate = useNavigate();

    return (
        <div className="nav-item-wrapper group">
            <button
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(path)}
                style={isActive ? { color: activeColor } : {}}
            >
                <div className="nav-item-icon">
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
            </button>
            <span className="nav-tooltip">
                {label}
            </span>
        </div>
    );
};

export default Navbar;

```

## client\src\components\Panda.jsx

```javascript
import React from 'react';

const Panda = ({ currentState }) => {
  return (
    <section className="panda-area" aria-hidden="true">
      <div className="panda" id="panda">
        <div className="ear left"></div>
        <div className="ear right"></div>
        <div className="head">
          <div className="eye-patch left"><div className="eye left"></div></div>
          <div className="eye-patch right"><div className="eye right"></div></div>
          <div className="nose"></div>
          <div className="mouth"></div>
        </div>
        <div className="body">
          <div className="arm left" id="armLeft"></div>
          <div className="arm right" id="armRight"></div>
        </div>
      </div>
    </section>
  );
};

export default Panda;
```

## client\src\components\PandaLamp.css

```css
:root {
  --bg: #0b1020;
  --light: #ffe9a6;
  --card: rgba(255, 255, 255, 0.08);
  --card2: rgba(255, 255, 255, 0.12);
  --text: rgba(255, 255, 255, 0.9);
  --muted: rgba(255, 255, 255, 0.65);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: var(--text);
}

.panda-wrapper {
  background: radial-gradient(1200px 700px at 50% 10%, #18224a 0%, var(--bg) 60%);
  min-height: 100vh;
  display: grid;
  place-items: center;
  width: 100%;
}

/* --- SCENE CONTAINER --- */
.scene {
  width: min(1000px, 94vw);
  min-height: 700px;
  border-radius: 28px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* --- LAMP AREA --- */
.lamp-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  /* Keep lamp button on top of everything */
}

.lamp {
  width: 240px;
  height: 200px;
  background: transparent;
  border: 0;
  position: relative;
  cursor: pointer;
  z-index: 2;
}

/* Lamp Shade */
.lamp-top {
  position: absolute;
  left: 50%;
  top: 0;
  width: 220px;
  height: 140px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-top: none;
  border-bottom: none;
  border-radius: 110px 110px 30px 30px;
}

/* Lamp Bulb */
.lamp-bulb {
  position: absolute;
  left: 50%;
  top: 100px;
  width: 44px;
  height: 50px;
  transform: translateX(-50%);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.14);
  z-index: 3;
}

/* Lamp Base Knob */
.lamp-base {
  position: absolute;
  left: 50%;
  top: 145px;
  width: 20px;
  height: 14px;
  transform: translateX(-50%);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.10);
  z-index: 3;
}

.hint {
  color: var(--muted);
  margin-top: -20px;
  font-size: 14px;
}

/* --- LIGHT BEAM --- */
.lamp-beam-container {
  position: absolute;
  top: 138px;
  /* Touching bottom of lamp shade */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 600px;
  pointer-events: none;
  z-index: 1;
  /* Behind Panda */
}

.lamp-glow {
  width: 680px;
  height: 100%;
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(255, 233, 166, 0.45) 0%, rgba(255, 233, 166, 0) 80%);
  clip-path: polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%);
  opacity: 0;
  transition: opacity 700ms ease;
}

/* --- PANDA & CARDS AREA --- */
.panda-area {
  position: relative;
  width: 100%;
  flex: 1;
  display: block;
  /* Reduced margin to move Panda UPWARDS closer to the light */
  margin-top: 100px;
}

.panda {
  position: absolute;
  left: 50%;
  bottom: 40px;
  width: 260px;
  height: 320px;

  /* DEFAULT HIDDEN STATE: 
     translate(-50%, 200px) -> Pushed DOWN 200px.
     This ensures it slides UP when it becomes active. 
  */
  transform: translate(-50%, 200px);

  opacity: 0;
  transition: opacity 600ms ease, transform 800ms cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 5;
}


/* Ears */
.ear {
  position: absolute;
  width: 70px;
  height: 70px;
  background: #0d0f12;
  border-radius: 50%;
  top: 0;
}

.ear.left {
  left: 40px;
}

.ear.right {
  right: 40px;
}

/* Head */
.head {
  position: absolute;
  left: 50%;
  top: 30px;
  width: 220px;
  height: 200px;
  transform: translateX(-50%);
  background: #f7f7f7;
  border-radius: 110px;
  box-shadow: inset 0 -10px 0 rgba(0, 0, 0, 0.06);
}

/* Face */
.eye-patch {
  position: absolute;
  width: 70px;
  height: 80px;
  top: 55px;
  background: #0d0f12;
  border-radius: 50%;
  opacity: 0.95;
}

.eye-patch.left {
  left: 40px;
  transform: rotate(-10deg);
}

.eye-patch.right {
  right: 40px;
  transform: rotate(10deg);
}

.eye {
  position: absolute;
  left: 50%;
  top: 36px;
  width: 18px;
  height: 18px;
  transform: translateX(-50%);
  background: #ffffff;
  border-radius: 50%;
  overflow: hidden;
}

.eye::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  transform: translate(-50%, -50%);
  background: #0d0f12;
  border-radius: 50%;
}

.nose {
  position: absolute;
  left: 50%;
  top: 130px;
  width: 16px;
  height: 12px;
  transform: translateX(-50%);
  background: #0d0f12;
  border-radius: 0 0 10px 10px;
}

.mouth {
  position: absolute;
  left: 50%;
  top: 148px;
  width: 40px;
  height: 20px;
  transform: translateX(-50%);
  border-bottom: 3px solid rgba(0, 0, 0, 0.6);
  border-radius: 0 0 50px 50px;
  opacity: 0.55;
}

/* Body */
.body {
  position: absolute;
  left: 50%;
  top: 210px;
  width: 240px;
  height: 140px;
  transform: translateX(-50%);
  background: #f7f7f7;
  border-radius: 120px 120px 80px 80px;
  box-shadow: inset 0 -10px 0 rgba(0, 0, 0, 0.06);
}

.arm {
  position: absolute;
  width: 90px;
  height: 60px;
  background: #0d0f12;
  border-radius: 40px;
  top: 20px;
  transition: transform 500ms ease;
}

.arm.left {
  left: 12px;
  transform-origin: 80% 20%;
}

.arm.right {
  right: 12px;
  transform-origin: 20% 20%;
}


/* --- CARDS --- */
.card {
  width: 100%;
  max-width: 360px;
  padding: 24px 24px;
  border-radius: 18px;
  background: var(--card);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  z-index: 10;

  /* Absolute positioning for animations */
  position: absolute;
  left: 50%;
  top: 60px;
  /* Align with Panda's chest */

  /* Default Hidden State: Centered and slightly transparent */
  transform: translate(-50%, 20px);
  opacity: 0;
  pointer-events: none;

  transition: opacity 450ms ease, transform 500ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.card h2 {
  margin: 0 0 8px;
  font-size: 24px;
  text-align: center;
}

.card p {
  margin: 0 0 20px;
  color: var(--muted);
  text-align: center;
}

.card.form label {
  display: block;
  margin: 12px 0;
  color: var(--muted);
  font-size: 14px;
}

.card.form input {
  width: 100%;
  margin-top: 6px;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: var(--card2);
  color: var(--text);
  outline: none;
}

.card.form input:focus {
  border-color: rgba(255, 233, 166, 0.7);
  box-shadow: 0 0 0 3px rgba(255, 233, 166, 0.15);
}

.primary {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 233, 166, 0.22);
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: background 200ms;
}

.primary:hover {
  background: rgba(255, 233, 166, 0.3);
}

.switch-text {
  font-size: 13px;
  color: var(--muted);
  margin: 16px 0;
  text-align: center;
}

.link-btn {
  background: none;
  border: none;
  color: var(--light);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
  margin-left: 4px;
}

.link-btn:hover {
  color: #fff;
}



/* --- STATE LOGIC --- */
@keyframes blinkOpen {
  0% {
    transform: translateX(-50%) scaleY(0.15);
  }

  40% {
    transform: translateX(-50%) scaleY(1);
  }

  70% {
    transform: translateX(-50%) scaleY(0.25);
  }

  100% {
    transform: translateX(-50%) scaleY(1);
  }
}

/* 1. Lamp Off/On */
.state-lampOff .lamp-glow {
  opacity: 0;
}

.state-lampOn .lamp-glow {
  opacity: 1;
}

.state-panda .panda {
  opacity: 1;
  /* ANIMATION: Moves UP from 200px to 0px (Center) */
  transform: translate(-50%, -100px);
  z-index: 5;
}

/* 2. WELCOME STATE (Card on Belly) */
.state-welcome #welcomeCard {
  opacity: 1;
  pointer-events: auto;
  /* ANIMATION: Drops DOWN from -200px to 150px (Belly Position) */
  transform: translate(-50%, 220%);
}

/* Arms for Welcome (Holding the belly card) */
.state-welcome .arm.left {
  transform: rotate(25deg) translate(5px, 0px);
}

.state-welcome .arm.right {
  transform: rotate(-25deg) translate(-5px, 0px);
}

.state-login .panda {
  opacity: 1;
  transform: translate(calc(-50% - 220px), -100px);
}

/* 3. LOGIN STATE (Card Center/Chest) */
.state-login #loginCard {
  opacity: 1;
  pointer-events: auto;
  /* ANIMATION: Drops DOWN from -200px to 0px (Chest Position) */
  transform: translate(calc(-50% + 200px), 55%);
}

.state-login .eye {
  animation: blinkOpen 900ms ease both;
}

/* Arms for Login (Holding the chest card) */
.state-login .arm.left {
  transform: rotate(14deg) translateY(10px);
}

.state-login .arm.right {
  transform: rotate(-14deg) translateY(10px);
}


/* 4. SIGNUP STATE (Split View) */
.state-signup .panda {
  opacity: 1;
  transform: translate(calc(-50% - 220px), -100px);
}

.state-signup #signupCard {
  opacity: 1;
  pointer-events: auto;
  transform: translate(calc(-50% + 200px), 20%);
}

.state-signup .eye {
  animation: blinkOpen 900ms ease both;
}

/* Arms Open (Presenting) */
.state-signup .arm.left {
  transform: rotate(-38deg) translate(20px, -55px);
}

.state-signup .arm.right {
  transform: rotate(38deg) translate(-20px, -55px);
}

.state-waking .eye {
  animation: blinkOpen 900ms ease both;
}

.state-coverEyes .arm.left {
  transform: rotate(-38deg) translate(20px, -55px);
}

.state-coverEyes .arm.right {
  transform: rotate(38deg) translate(-20px, -55px);
}

.state-coverEyes .eye {
  background: transparent;
}

.state-coverEyes .eye::after {
  width: 26px;
  height: 3px;
  border-radius: 3px;
  background: #f2f2f2;
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

## client\src\components\PandaLamp.jsx

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Lamp from './Lamp';
import Panda from './Panda';
import Card from './Card';
import PandaLogin from './PandaLogin';
import PandaSignup from './PandaSignup';
import './PandaLamp.css';

const PandaLamp = () => {
  const [isLampOn, setIsLampOn] = useState(false);
  const [view, setView] = useState(''); // 'welcome', 'login', 'signup'
  const [pandaState, setPandaState] = useState(''); // 'sleeping', 'waking'
  const [isCoveringEyes, setIsCoveringEyes] = useState(false);
  const [showPanda, setShowPanda] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const getSceneClasses = () => {
    const classes = ['scene'];
    classes.push(isLampOn ? 'state-lampOn' : 'state-lampOff');
    if (showPanda) classes.push('state-panda');
    if (pandaState) classes.push(`state-${pandaState}`);
    if (isCoveringEyes) classes.push('state-coverEyes');
    if (view === 'welcome') classes.push('state-welcome');
    if (view === 'login') classes.push('state-login');
    if (view === 'signup') classes.push('state-signup');
    return classes.join(' ');
  };

  const toggleLamp = () => {
    if (!isLampOn) {
      setIsLampOn(true);
      setShowPanda(true);
      setPandaState('sleeping');
      setHintVisible(false);

      setTimeout(() => setPandaState('waking'), 400);
      setTimeout(() => {
        setPandaState('');
        setView('welcome');
      }, 1400);
    } else {
      // Reset Everything (Match JS logic)
      setIsLampOn(false);
      setShowPanda(false);
      setPandaState('');
      setView('');
      setIsCoveringEyes(false);
      setHintVisible(true);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setView('login');
      setIsLampOn(false); // JS: replace(STATE_LAMP_ON, STATE_LAMP_OFF)
    }
  };

  return (
    <div className="panda-wrapper">
      <main className={getSceneClasses()} id="scene">
        <Lamp toggleLamp={toggleLamp} isLampOn={isLampOn} />

        {/* 
            IMPORTANT: We render components without {&&} 
            so that CSS transitions work correctly. 
        */}
        <Panda currentState={getSceneClasses()} />

        <Card onGetStarted={handleGetStarted} />

        <PandaLogin
          onSignupClick={() => setView('signup')}
          onPasswordFocus={() => setIsCoveringEyes(true)}
          onPasswordBlur={() => setIsCoveringEyes(false)}
        />

        <PandaSignup
          onLoginClick={() => setView('login')}
          onPasswordFocus={() => setIsCoveringEyes(true)}
          onPasswordBlur={() => setIsCoveringEyes(false)}
        />

        {hintVisible && <div className="hint" id="hint">Hint: Click the lamp to get started!</div>}
      </main>
    </div>
  );
};

export default PandaLamp;
```

## client\src\components\PandaLogin.jsx

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PandaLogin = ({ onSignupClick, onPasswordFocus, onPasswordBlur }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login successful:', response.data);

      const token = response.data.token;
      // Decode token to get user data (payload)
      const payload = JSON.parse(atob(token.split('.')[1]));

      login(payload, token);
      navigate('/dashboard');
    } catch (error) {
      console.log('Login failed:', error.response?.data || error.message);
      // Handle error (e.g., show error message)
    }
  };
  return (
    <div className="card form" id="loginCard">
      <h2>Login</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
        <label>Email
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>Password
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={onPasswordFocus}
            onBlur={onPasswordBlur}
            required
          />
        </label>
        <p className="switch-text">
          Don't have an account?
          <button type="button" className="link-btn" onClick={onSignupClick}>Sign up</button>
        </p>
        <button className="primary" type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default PandaLogin;
```

## client\src\components\PandaSignup.jsx

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const PandaSignup = ({ onLoginClick, onPasswordFocus, onPasswordBlur }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { 
        name, 
        email, 
        password 
      });
      console.log('Sign Up successful:', response.data);
      
      // On success, redirect to login
      onLoginClick(); 
    } catch (error) {
      console.error('Sign Up failed:', error.response?.data);
      setError(error.response?.data?.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="card form" id="signupCard">
      <h2>Sign Up</h2>
      <form id="signupForm" autoComplete="on" onSubmit={handleSignupSubmit}>
        <label>
          Name
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // Trigger animation
            onFocus={onPasswordFocus}
            onBlur={onPasswordBlur}
            required
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // Trigger animation
            onFocus={onPasswordFocus}
            onBlur={onPasswordBlur}
            required
          />
        </label>

        {error && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

        <p className="switch-text">
          Already have an account?{' '}
          <button type="button" className="link-btn" onClick={onLoginClick}>
            Log in
          </button>
        </p>

        <button className="primary" type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default PandaSignup;
```

## client\src\components\PrivateRoute.jsx

```javascript
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    return user ? (
        <>
            <Outlet />
            <Navbar />
        </>
    ) : <Navigate to="/" />;
};

export default PrivateRoute;

```

## client\src\components\TaskDetails.css

```css
/* TaskDetails.css - Dark Theme */

.task-details-container {
    width: 80%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
    text-align: center;
    color: var(--text-primary);
    font-family: 'Poppins', sans-serif;
    animation: fadeIn 0.8s ease-out;
}

.tasks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    text-align: left;
}

.tasks-title-group {
    display: flex;
    flex-direction: column;
}

.tasks-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #fff 0%, var(--accent-indigo) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.tasks-meta {
    display: flex;
    gap: 15px;
    margin-top: 10px;
    font-size: 1rem;
    color: var(--text-secondary);
}

.meta-tag {
    background: var(--bg-secondary);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--border-color);
}

.glass-card {
    background: var(--bg-secondary);
    border-radius: 24px;
    padding: 40px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    text-align: left;
}

.description-section {
    margin-bottom: 40px;
}

.section-label {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--accent-blue);
    margin-bottom: 15px;
    font-weight: 600;
    display: block;
}

.description-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text-primary);
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
}

.detail-item {
    background: rgba(0, 0, 0, 0.2);
    padding: 24px;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    transition: transform 0.2s;
}

.detail-item:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
}

.detail-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-top: 5px;
}

.difficulty-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin-top: 12px;
    overflow: hidden;
}

.difficulty-fill {
    height: 100%;
    background: linear-gradient(90deg, #4ade80, #facc15, #f87171);
    border-radius: 4px;
    width: 0%;
    /* Set via inline style */
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.materials-section {
    border-top: 1px solid var(--border-color);
    padding-top: 30px;
}

.material-link {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(59, 130, 246, 0.15);
    color: var(--accent-blue);
    padding: 12px 24px;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid rgba(59, 130, 246, 0.3);
    font-weight: 600;
}

.material-link:hover {
    background: rgba(59, 130, 246, 0.25);
    transform: translateY(-2px);
    color: white;
    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
}

.back-btn {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 10px 24px;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.95rem;
    font-weight: 500;
}

.back-btn:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
    border-color: var(--text-primary);
    transform: translateX(-5px);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
```

## client\src\components\TaskDetails.jsx

```javascript
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, BarChart2, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './TaskDetails.css';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);

    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTask = async () => {
            if (!user || !user.token) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const res = await fetch(`http://localhost:5000/api/tasks/${id}`, config);
                if (!res.ok) throw new Error('Failed to fetch task');

                const data = await res.json();


                setTask(data);
            } catch (err) {
                console.error("Error fetching task:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id, user]);

    if (!task) return <div className="loading-spinner">Loading...</div>;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="task-details-container">
            <div className="tasks-header">
                <div className="tasks-title-group">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <ArrowLeft size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Back
                    </button>
                    <h1 className="tasks-title" style={{ marginTop: '20px' }}>{task.title}</h1>
                    <div className="tasks-meta">
                        <div className="meta-tag">
                            <Calendar size={14} />
                            {formatDate(task.date)}
                        </div>
                        <div className="meta-tag">
                            <Tag size={14} />
                            {task.category}
                        </div>
                        <div className="meta-tag" style={{ color: '#a5b4fc', borderColor: '#a5b4fc' }}>
                            {task.course ? (task.course.courseCode || 'Course Info') : 'No Course'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <div className="description-section">
                    <span className="section-label">Description</span>
                    <p className="description-text">
                        {task.description}
                    </p>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <span className="section-label" style={{ marginBottom: '5px' }}>Difficulty</span>
                        <div className="detail-value">{task.difficulty}/10</div>
                        <div className="difficulty-bar">
                            <div
                                className="difficulty-fill"
                                style={{ width: `${task.difficulty * 10}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="detail-item">
                        <span className="section-label" style={{ marginBottom: '5px' }}>Weight</span>
                        <div className="detail-value">15%</div>
                        <div className="section-label" style={{ fontSize: '0.7rem', marginTop: '5px', opacity: 0.7 }}>of Final Grade</div>
                    </div>

                    <div className="detail-item">
                        <span className="section-label" style={{ marginBottom: '5px' }}>Status</span>
                        <div className="detail-value" style={{ color: '#fbbf24' }}>In Progress</div>
                    </div>
                </div>

                {task.materials && (
                    <div className="materials-section">
                        <span className="section-label">Resources</span>
                        <br />
                        <a href={task.materials} target="_blank" rel="noopener noreferrer" className="material-link">
                            <FileText size={18} />
                            View Attached Materials
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;

```

## client\src\components\TaskPicker.css

```css
/* --- Scoped Resets & Setup for TaskPicker --- */
.task-picker-scope {
    /* Variables */
    --wheel-height: 150px;
    --item-height: 50px;
    --primary-color: #4a90e2;
    --primary-dark: #357abd;
    --accent-glow: rgba(74, 144, 226, 0.4);
    --bg-dark: #18224a;
    --glass-border: rgba(255, 255, 255, 0.1);
    --bg-secondary: rgba(255, 255, 255, 0.08);
    --border-color: rgba(255, 255, 255, 0.1);

    /* Body/Root replacements */
    font-family: 'Poppins', sans-serif;
    color: #333;
    min-height: 100vh;
    width: 100%;

    /* Layout */
    display: flex;
    justify-content: center;
    padding-top: 40px;
    padding-bottom: 40px;
    box-sizing: border-box;

    /* Text alignment checks */
    text-align: left;
}

.task-picker-scope * {
    box-sizing: border-box;
}

/* --- Main Container --- */
.task-picker-scope .picker-container {
    /* STRICTLY 80% WIDTH */
    width: 100%;
    max-width: 600px;
    padding-bottom: 120px;
    background: transparent;
    display: flex;
    flex-direction: column;
    gap: 25px;
    animation: taskPickerFadeIn 0.8s ease-out;
}

@keyframes taskPickerFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.task-picker-scope .header-section {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 0.5rem;
  width: 100%;
  min-height: 60px;
}

.task-picker-scope .back-btn {
  position: absolute;
  left: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 60;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-5px);
}

/* --- Page Title --- */
.task-picker-scope .page-title {
    color: #fff;
    font-size: 36px;
    font-weight: 600;
    margin: 0;
    padding-bottom: 0px;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.5px;
    position: relative;
    text-align: center;
    /* Ensure title aligns with content */
}

.thin-line {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 233, 166, 0.3), transparent);
  margin-top: 0.5rem;    
  margin-bottom: -10px; 
  padding: 0;
}


/* --- Date Picker Section (Glassmorphism) --- */
.task-picker-scope .date-picker-section {
    display: flex;
    justify-content: center;
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 4px 0;
    height: var(--wheel-height);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    width: 100%;
    margin-top: 0;
    /* Ensure picker spans full container width */
}

.task-picker-scope .date-picker-section::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 5%;
    width: 90%;
    height: var(--item-height);
    transform: translateY(-50%);
    background: linear-gradient(90deg, transparent, rgba(74, 144, 226, 0.1), transparent);
    border-top: 1px solid rgba(74, 144, 226, 0.3);
    border-bottom: 1px solid rgba(74, 144, 226, 0.3);
    pointer-events: none;
    z-index: 1;
}

.task-picker-scope .wheel {
    height: var(--wheel-height);
    width: 30%;
    /* 3 columns taking up 30% each roughly */
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    text-align: center;
    scrollbar-width: none;
    z-index: 2;
}

.task-picker-scope .wheel::-webkit-scrollbar {
    display: none;
}

.task-picker-scope .wheel-item {
    height: var(--item-height);
    display: flex;
    align-items: center;
    justify-content: center;
    scroll-snap-align: center;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;
    cursor: pointer;
}

.task-picker-scope .wheel-spacer {
    height: var(--item-height);
}

.task-picker-scope .wheel:hover .wheel-item:hover {
    color: #fff;
    transform: scale(1.1);
    text-shadow: 0 0 12px var(--primary-color);
}

.task-picker-scope .wheel-item.active {
    color: #fff;
    font-weight: 700;
    transform: scale(1.2);
    text-shadow: 0 0 15px var(--primary-color);
}

.error-alert {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    animation: shake 0.4s ease-in-out;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* --- Form Section --- */
.task-picker-scope fieldset {
    background: var(--bg-secondary);
    width: 100%;
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    position: relative;
    box-sizing: border-box;
}

.task-picker-scope legend {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    padding: 8px 20px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 15px var(--accent-glow);
}

.task-picker-scope .form-group {
    margin-bottom: 25px;
    position: relative;
}

.task-picker-scope .form-group label {
    display: block;
    margin-bottom: 10px;
    font-size: 13px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    text-align: left;
}

.task-picker-scope .form-group input[type="text"],
.task-picker-scope .form-group textarea,
.task-picker-scope .form-group select {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 1rem;
    transition: border-color 0.2s;
}

.task-picker-scope .form-group textarea {
    resize: vertical;
    min-height: 100px;
}

.task-picker-scope .form-group input:focus,
.task-picker-scope .form-group textarea:focus,
.task-picker-scope .form-group select:focus {
    outline: none;
    border-color: var(--accent-blue);
}

/* --- Fancy Radio Chips --- */
.task-picker-scope .radio-group {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: flex-start;
    /* Align to left */
}

.task-picker-scope .radio-group input[type="radio"] {
    display: none;
}

.task-picker-scope .radio-group label {
    background-color: #f4f6f9;
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    display: flex;
    align-items: center;
    text-transform: capitalize;
    margin-bottom: 0;
    text-align: center;
}

.task-picker-scope .radio-group label:hover {
    background-color: #e2e6ea;
    transform: translateY(-2px);
}

.task-picker-scope .radio-group input[type="radio"]:checked+label {
    background: var(--primary-color);
    color: white;
    box-shadow: 0 4px 15px var(--accent-glow);
    border-color: var(--primary-color);
}

/* --- Upload Box --- */
.task-picker-scope .upload-box {
    border: 2px dashed #cbd5e0;
    border-radius: 12px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #718096;
    transition: all 0.3s ease;
    background: #f8fafc;
    position: relative;
    overflow: hidden;
}

.task-picker-scope .upload-box:hover {
    border-color: var(--primary-color);
    background: #ebf8ff;
    color: var(--primary-color);
}

.task-picker-scope .plus-icon {
    font-size: 28px;
    margin-right: 12px;
    font-weight: 300;
}

/* --- Submit Button --- */
.task-picker-scope .submit-btn {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    border: none;
    padding: 16px;
    width: 100%;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 15px;
    letter-spacing: 1px;
    box-shadow: 0 10px 20px rgba(74, 144, 226, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.task-picker-scope .submit-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(74, 144, 226, 0.4);
}

.task-picker-scope .submit-btn:active {
    transform: scale(0.98);
}

/* Responsive Fix */
@media (max-width: 600px) {
    .task-picker-scope .picker-container {
        width: 95%;
    }

    .task-picker-scope fieldset {
        padding: 25px;
    }

    .task-picker-scope .radio-group label {
        width: 100%;
        justify-content: center;
    }
}
```

## client\src\components\TaskPicker.jsx

```javascript
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './TaskPicker.css';

const TaskPicker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for comparison

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    difficulty: 5,
    weight: 10
  });

  // Date state (indexes)
  const [dateState, setDateState] = useState({
    dayIndex: today.getDate() - 1,
    monthIndex: today.getMonth(),
    yearIndex: 2 // Default to 2025 (adjust based on years array)
  });

  const [error, setError] = useState('');

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const currentYearVal = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYearVal + i);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Dynamically calculate days
  const currentYear = years[dateState.yearIndex];
  const currentMonth = dateState.monthIndex;
  const numDays = getDaysInMonth(currentMonth, currentYear);
  const days = Array.from({ length: numDays }, (_, i) => i + 1);

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const ITEM_HEIGHT = 50;

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (user && user.token) {
          const res = await axios.get('http://localhost:5000/api/courses', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setCourses(res.data);
          if (res.data.length > 0) {
            setFormData(prev => ({ ...prev, course: res.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, [user]);

  useEffect(() => {
    // Initial scroll
    if (dayRef.current) dayRef.current.scrollTop = dateState.dayIndex * ITEM_HEIGHT;
    if (monthRef.current) monthRef.current.scrollTop = dateState.monthIndex * ITEM_HEIGHT;
    if (yearRef.current) yearRef.current.scrollTop = dateState.yearIndex * ITEM_HEIGHT;
  }, []);

  // Ensure dayIndex stays within bounds when month/year changes
  useEffect(() => {
    if (dateState.dayIndex >= numDays) {
      const newDayIndex = numDays - 1;
      setDateState(prev => ({ ...prev, dayIndex: newDayIndex }));
      if (dayRef.current) dayRef.current.scrollTop = newDayIndex * ITEM_HEIGHT;
    }
  }, [numDays]);

  const handleScroll = (e, type) => {
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    
    // Safety check for index range
    let maxIndex = 0;
    if (type === 'dayIndex') maxIndex = numDays - 1;
    if (type === 'monthIndex') maxIndex = months.length - 1;
    if (type === 'yearIndex') maxIndex = years.length - 1;
    
    const safeIndex = Math.min(Math.max(0, index), maxIndex);
    setDateState(prev => ({ ...prev, [type]: safeIndex }));
    setError(''); // Clear error on scroll
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user || !user.token) {
      setError('You must be logged in to create a task.');
      return;
    }

    const selectedDay = days[dateState.dayIndex];
    const selectedMonth = dateState.monthIndex;
    const selectedYear = years[dateState.yearIndex];

    // Create date object
    const taskDate = new Date(selectedYear, selectedMonth, selectedDay, 23, 59, 59);

    // 1. Validation: Cannot be in the past
    if (taskDate < today) {
      setError('Deadline cannot be in the past. Please select a future date.');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      difficulty: Number(formData.difficulty),
      weight: Number(formData.weight),
      deadline: taskDate,
      course: formData.course
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      };

      const res = await axios.post('http://localhost:5000/api/tasks', payload, config);
      alert('Task Created Successfully!');
      navigate('/tasks');
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Error creating task.');
    }
  };

  const categories = ['Exam', 'Assignment', 'Lab Task', 'Presentation', 'Project', 'General'];

  return (
    <div className="task-picker-scope">
      <div className="picker-container">

        <div className="header-section">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={20}/>
          </button>
          <h1 className="page-title">Add New Task</h1>
        </div>

        <div className="thin-line"></div>

        {error && (
          <div className="error-alert">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Date Picker */}
        <div className="date-picker-section">
          <div className="wheel" ref={dayRef} onScroll={(e) => handleScroll(e, 'dayIndex')}>
            <div className="wheel-spacer"></div>
            {days.map(d => (
              <div key={d} className={`wheel-item ${d === days[dateState.dayIndex] ? 'active' : ''}`}>{d}</div>
            ))}
            <div className="wheel-spacer"></div>
          </div>

          <div className="wheel" ref={monthRef} onScroll={(e) => handleScroll(e, 'monthIndex')}>
            <div className="wheel-spacer"></div>
            {months.map((m, i) => (
              <div key={i} className={`wheel-item ${i === dateState.monthIndex ? 'active' : ''}`}>{m}</div>
            ))}
            <div className="wheel-spacer"></div>
          </div>

          <div className="wheel" ref={yearRef} onScroll={(e) => handleScroll(e, 'yearIndex')}>
            <div className="wheel-spacer"></div>
            {years.map((y, i) => (
              <div key={y} className={`wheel-item ${i === dateState.yearIndex ? 'active' : ''}`}>{y}</div>
            ))}
            <div className="wheel-spacer"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Task Details</legend>

            <div className="form-group">
              <label>Course</label>
              <select name="course" value={formData.course} onChange={handleChange} required>
                <option value="" disabled>Select a Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.courseCode} - {course.courseTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Task Name</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Calculus Midterm" required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Provide details..."></textarea>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty (1-5)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="range" min="1" max="5" name="difficulty" value={formData.difficulty} onChange={handleChange} style={{ flex: 1 }} />
                <span style={{ fontWeight: 'bold', color:'white' }}>{formData.difficulty}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Weight (1-100%)</label>
              <input type="number" name="weight" min="1" max="100" value={formData.weight} onChange={handleChange} required />
            </div>

            <button type="submit" className="submit-btn">Create Task</button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default TaskPicker;
```

## client\src\context\.gitkeep

```

```

## client\src\context\AuthContext.jsx

```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            // TODO: verify the token with the backend here

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ ...payload, token });
            } catch (e) {
                console.error("Invalid token", e);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser({ ...userData, token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

```

## client\src\index.css

```css
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: dark;
  color: rgba(255, 255, 255, 0.9);
  
  /* Navy Blue Theme Variables (from My Courses page) */
  --bg-dark: #0b1020;
  --glow-color: #18224a;
  --bg-gradient: radial-gradient(1200px 700px at 50% 10%, var(--glow-color) 0%, var(--bg-dark) 60%);

  --bg-secondary: rgba(255, 255, 255, 0.08);
  --text-primary: rgba(255, 255, 255, 0.9);
  --text-secondary: rgba(255, 255, 255, 0.65);
  --text-muted: rgba(255, 255, 255, 0.45);
  --border-color: rgba(255, 255, 255, 0.1);
  --hover-bg: rgba(255, 255, 255, 0.12);
  --accent-blue: #3b82f6;
  --accent-indigo: #6366f1;
  --light-accent: #ffe9a6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: var(--bg-gradient) no-repeat fixed;
  background-color: var(--bg-dark);
  color: var(--text-primary);
}

a {
  font-weight: 500;
  color: var(--accent-blue);
  text-decoration: inherit;
}

a:hover {
  color: var(--accent-indigo);
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid var(--border-color);
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.25s;
}

button:hover {
  border-color: var(--accent-blue);
  background-color: var(--hover-bg);
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

```

## client\src\main.jsx

```javascript
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Keep Router here
import './index.css';
import App from './App.jsx';
import Login from './pages/Login/Login.jsx';  // Import Login page
import SignUp from './pages/Signup/Signup.jsx';  // Import SignUp pag
import Dashboard from './pages/Dashboard/Dashboard.jsx'; // Import Dashboard page
// import AddCourse from './pages/Courses/AddCourse.jsx'; // Import AddCourse page
import AddCourse from './pages/AddCourse/AddCourse.jsx'; // Import AddCourse page
import TaskPicker from './components/TaskPicker.jsx'; // Import TaskPicker component
import CourseDetails from './components/CourseDetails.jsx'; // Import CourseDetails component
import TaskDetails from './components/TaskDetails.jsx'; // Import TaskDetails component
import Courses from './pages/Courses/Courses.jsx'; // Import Courses page
import CourseDetail from './pages/CourseDetail/CourseDetail.jsx'; // Import CourseDetail page
import AllTasks from './pages/AllTasks/AllTasks.jsx'; // Import AllTasks page
import Analytics from './pages/Analytics/Analytics.jsx'; // Import Analytics page
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Define your routes here */}
          {/* Public Routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses/new" element={<AddCourse />} />
            <Route path="/tasks" element={<AllTasks />} />
            <Route path="/taskpicker" element={<TaskPicker />} />
            <Route path="/coursedetails" element={<CourseDetails />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* Removed duplicate /courses/add as /courses/new exists, but keeping if user uses both */}
            <Route path="/courses/add" element={<AddCourse />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);

```

## client\src\pages\.gitkeep

```

```

## client\src\pages\AddCourse\AddCourse.css

```css
/* Courses.css */

:root {
    --bg-primary: #0b1020;
    --bg-secondary: rgba(255, 255, 255, 0.08);
    --text-primary: rgba(255, 255, 255, 0.9);
    --text-secondary: rgba(255, 255, 255, 0.65);
    --text-muted: rgba(255, 255, 255, 0.45);
    --border-color: rgba(255, 255, 255, 0.1);
    --hover-bg: rgba(255, 255, 255, 0.12);
    --accent-blue: #3b82f6;
    --danger: #ef4444;
}

.add-course-container {
    min-height: 100vh;
    width: 100%;
    color: var(--text-primary);
    padding: 2rem;
    padding-bottom: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.add-course-header {
    width: 100%;
    max-width: 600px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.back-btn {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.back-btn:hover {
    background: var(--hover-bg);
    transform: translateX(-2px);
}

.page-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
}

.add-course-form-card {
    background: var(--bg-secondary);
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 1rem;
    transition: border-color 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: var(--accent-blue);
}

.color-options {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.color-option {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: transform 0.2s, border-color 0.2s;
    position: relative;
}

.color-option:hover {
    transform: scale(1.1);
}

.color-option.selected {
    border-color: white;
    transform: scale(1.1);
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.btn-primary {
    flex: 1;
    background: var(--accent-blue);
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-secondary {
    flex: 1;
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.75rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    text-align: center;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn-secondary:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
}

.error-msg {
    color: var(--danger);
    font-size: 0.875rem;
    margin-bottom: 1rem;
    background: rgba(239, 68, 68, 0.1);
    padding: 0.5rem;
    border-radius: 4px;
}
```

## client\src\pages\AddCourse\AddCourse.jsx

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import './AddCourse.css';

const AddCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        courseTitle: '',
        courseCode: '',
        semester: 'Spring 2026',
        color: '#3b82f6'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const colors = [
        '#3b82f6', // Blue
        '#6366f1', // Indigo
        '#8b5cf6', // Violet
        '#ec4899', // Pink
        '#ef4444', // Red
        '#f59e0b', // Amber
        '#10b981', // Emerald
        '#06b6d4', // Cyan
        '#14b8a6', // Teal
        '#64748b', // Slate
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleColorSelect = (color) => {
        setFormData({ ...formData, color });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token'); // token is stored here
            if (!token) {
                console.error("No token found");
                setError("You must be logged in to add a course.");
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create course');
            }

            // Success
            navigate('/courses');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-course-container">
            <div className="add-course-header">
                <Link to="/courses" className="back-btn">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="page-title">Add New Course</h1>
            </div>

            <div className="add-course-form-card">
                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Course Title</label>
                        <input
                            type="text"
                            name="courseTitle"
                            className="form-input"
                            placeholder="e.g. Web Programming"
                            value={formData.courseTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Course Code</label>
                        <input
                            type="text"
                            name="courseCode"
                            className="form-input"
                            placeholder="e.g. CSE 4540"
                            value={formData.courseCode}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Semester</label>
                        <select
                            name="semester"
                            className="form-input"
                            value={formData.semester}
                            onChange={handleChange}
                        >
                            <option value="Spring 2026">Spring 2026</option>
                            <option value="Fall 2025">Fall 2025</option>
                            <option value="Summer 2026">Summer 2026</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Course Color</label>
                        <div className="color-options">
                            {colors.map((c) => (
                                <div
                                    key={c}
                                    className={`color-option ${formData.color === c ? 'selected' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => handleColorSelect(c)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <Link to="/courses" className="btn-secondary">
                            Cancel
                        </Link>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourse;

```

## client\src\pages\AllTasks\AllTasks.css

```css
:root {
  --bg-dark: #0b1020;
  --glow-color: #18224a;
}

.all-tasks-page-wrapper {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.all-tasks-page-wrapper .container {
  width: 100%;
  min-height: 100vh;
  padding: 3rem 1rem 120px 1rem;
  box-sizing: border-box;
  background: transparent !important;
}

.all-tasks-page-wrapper .content-limit {
  max-width: 1100px;
  margin: 0 auto;
}

/* Header Section */
.all-tasks-page-wrapper .header-section {
  width: 100%;
}

.all-tasks-page-wrapper .header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 2rem;
  width: 100%;
  min-height: 80px;
}

.all-tasks-page-wrapper .header-text {
  text-align: center;
}

.all-tasks-page-wrapper .header-text h1 {
  font-size: 3.2em;
  line-height: 1.1;
  margin-bottom: 0.5rem;
  color: #ffffff;
  font-weight: bold;
}

.all-tasks-page-wrapper .floating-button-wrapper {
  position: absolute;
  right: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.all-tasks-page-wrapper .add-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffe9a6 0%, #e6d08f 100%);
  border: none;
  color: #0b1020;
  cursor: pointer;
  z-index: 50;
  box-shadow: 0 8px 25px rgba(255, 233, 166, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* Centering the icon */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 0;
}

.all-tasks-page-wrapper .add-button svg {
  display: block;
  margin: 0;
}

.all-tasks-page-wrapper .add-button.plus-active {
  transform: rotate(45deg);
  background: #cccccc;
}

.all-tasks-page-wrapper .action-btn {
  position: absolute;
  padding: 0.8rem 1.4rem;
  border-radius: 50px;
  border: none;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
  cursor: pointer;
  z-index: 40;
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  transition: all 0.3s ease;
}

.all-tasks-page-wrapper .btn-bottom {
  top: 80px;
  background: linear-gradient(135deg, #a855f7, #7e22ce, #581c87);
}

.all-tasks-page-wrapper .btn-bottom:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.6), 
              0 0 25px rgba(168, 85, 247, 0.4);
  color: white;
}

@keyframes bounceIn {
  from {
    opacity: 0;
    transform: scale(0.4);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.all-tasks-page-wrapper .header-text p {
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.all-tasks-page-wrapper .back-btn {
  position: absolute;
  left: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 60;
  text-decoration: none;
}

.all-tasks-page-wrapper .back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-5px);
}

.all-tasks-page-wrapper .thin-line {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 233, 166, 0.3), transparent);
  margin-bottom: 3rem;
}

/* Filter Bar */
.tasks-filter-bar {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    padding: 1.25rem 2rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    justify-content: space-between;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    min-width: 220px;
}

.filter-select {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.75rem 3rem 0.75rem 1.25rem;
    border-radius: 8px;
    outline: none;
    font-family: inherit;
    transition: all 0.2s;
    width: 100%;
    cursor: pointer;
    color-scheme: dark; 

    /* Custom Arrow */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: calc(100% - 1rem) center;
    background-size: 1.1rem;
}

.filter-select option {
    background-color: #18224a; 
    color: white;
}

.filter-select:focus {
    border-color: #ffe9a6;
    background: rgba(255, 255, 255, 0.1);
}

/* Tasks Grid */
.tasks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
}

.task-card {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    padding: 1.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.task-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 233, 166, 0.3);
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.task-card.completed {
    opacity: 0.6;
}

.task-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.task-course-badge {
    font-size: 0.75rem;
    padding: 0.4rem 0.75rem;
    border-radius: 50px;
    background: rgba(255, 233, 166, 0.1);
    color: #ffe9a6;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.task-priority-badge {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.4rem 0.75rem;
    border-radius: 50px;
}

.priority-high {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.priority-med {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
}

.priority-low {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
}

.task-card-title {
    font-size: 1.35rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    line-height: 1.3;
    color: #ffffff;
}

.task-card-desc {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
    flex-grow: 1;
}

.task-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 1.25rem;
}

.date-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 5rem 2rem;
    color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.02);
    border-radius: 1.5rem;
    border: 1px dashed rgba(255, 255, 255, 0.1);
}

.empty-state h3 {
    font-size: 1.5rem;
    color: #ffe9a6;
    margin-bottom: 0.5rem;
}

```

## client\src\pages\AllTasks\AllTasks.jsx

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Filter, Clock, CheckCircle, BookOpen, Tag, ArrowLeft, Plus, CheckSquare, FileQuestion } from 'lucide-react';
import './AllTasks.css';

const AllTasks = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed
    const [sortBy, setSortBy] = useState('deadline'); // deadline, priority
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    const [isHovered, setIsHovered] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.token) return;
            try {
                // Fetch Tasks
                const tasksRes = await axios.get('http://localhost:5000/api/tasks', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setTasks(tasksRes.data);

                // Fetch Courses
                const coursesRes = await axios.get('http://localhost:5000/api/courses', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setCourses(coursesRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (isMenuOpen && !event.target.closest('.floating-button-wrapper')) {
            setIsMenuOpen(false);
          }
        };
    
        if (isMenuOpen) {
          document.addEventListener('click', handleClickOutside);
        } else {
          document.removeEventListener('click', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    const getPriorityColor = (difficulty) => {
        if (difficulty >= 8) return 'priority-high';
        if (difficulty >= 5) return 'priority-med';
        return 'priority-low';
    };

    const toggleTaskStatus = async (e, task) => {
        e.stopPropagation();
        try {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            await axios.put(`http://localhost:5000/api/tasks/${task._id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Optimistic update
            setTasks(tasks.map(t =>
                t._id === task._id ? { ...t, status: newStatus } : t
            ));
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    const filteredTasks = tasks
        .filter(task => {
            // Status Filter
            if (filter === 'pending' && task.status === 'completed') return false;
            if (filter === 'completed' && task.status !== 'completed') return false;

            // Course Filter
            if (selectedCourse !== 'all') {
                const taskCourseId = task.course ? task.course._id : null;
                if (taskCourseId !== selectedCourse) return false;
            }

            // Type Filter
            if (selectedType !== 'all') {
                if (task.category !== selectedType) return false;
            }

            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'deadline') {
                return new Date(a.deadline) - new Date(b.deadline);
            } else if (sortBy === 'priority') {
                return b.difficulty - a.difficulty;
            }
            return 0;
        });

    if (loading) return <div className="all-tasks-page-wrapper"><div className="container"><div className="content-limit">Loading...</div></div></div>;

    return (
        <div className="all-tasks-page-wrapper">
            <div className="container">
                <div className="content-limit">
                    {/* Header Section */}
                    <div className="header-section">
                        <div className="header-content">
                            <Link to="/dashboard" className="back-btn">
                                <ArrowLeft size={20}/>
                            </Link>
                            <div className="header-text">
                                <h1>My Tasks</h1>
                                <p>Manage and track all your academic commitments</p>
                            </div>

                            <div
                                className="floating-button-wrapper"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => {
                                setIsHovered(false);
                                setHoveredButton(null);
                                }}
                            >
                                <button
                                className={`add-button ${isHovered || isMenuOpen ? 'plus-active' : ''}`}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                <Plus size={28} />
                                </button>

                                {isHovered || isMenuOpen ? (
                                <>
                                    <button
                                    className={`action-btn btn-bottom ${hoveredButton === 2 ? 'is-hovered' : ''}`}
                                    onMouseEnter={() => setHoveredButton(2)}
                                    onClick={() => navigate('/taskpicker')}
                                    >
                                    <CheckSquare size={18} /> Add Task
                                    </button>
                                </>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="thin-line"></div>

                    <div className="tasks-filter-bar">
                        <div className="filter-group">
                            <Filter size={18} color="#aaa" />
                            <select
                                className="filter-select"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Tasks</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <Clock size={18} color="#aaa" />
                            <select
                                className="filter-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="deadline">Sort by Deadline</option>
                                <option value="priority">Sort by Difficulty</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <BookOpen size={18} color="#aaa" />
                            <select
                                className="filter-select"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="all">All Courses</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.courseCode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <Tag size={18} color="#aaa" />
                            <select
                                className="filter-select"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                {['Exam', 'Assignment', 'Lab Task', 'Presentation', 'Project', 'General'].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="tasks-grid">
                        {filteredTasks.length === 0 ? (
                            <div className="empty-state">
                                <h3>No tasks found</h3>
                                <p>You're all caught up!</p>
                            </div>
                        ) : (
                            filteredTasks.map(task => (
                                <div
                                    key={task._id}
                                    className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}
                                    onClick={() => navigate(`/tasks/${task._id}`)}
                                >
                                    <div className="task-card-header">
                                        <span className="task-course-badge">
                                            {task.course ? task.course.courseCode : task.category || 'General'}
                                        </span>
                                        <span className={`task-priority-badge ${getPriorityColor(task.difficulty)}`}>
                                            Diff: {task.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="task-card-title">{task.title}</h3>
                                    <p className="task-card-desc">{task.description || 'No description provided.'}</p>

                                    <div className="task-card-footer">
                                        <div className="date-display">
                                            <Calendar size={14} />
                                            <span>
                                                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Deadline'}
                                            </span>
                                        </div>

                                        <button
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: task.status === 'completed' ? '#10b981' : 'rgba(255,255,255,0.3)'
                                            }}
                                            onClick={(e) => toggleTaskStatus(e, task)}
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllTasks;

```

## client\src\pages\Analytics\Analytics.css

```css
/* Analytics.css */

.analytics-page-wrapper {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    color: var(--text-primary);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.analytics-page-wrapper .container {
    width: 100%;
    min-height: 100vh;
    padding: 3rem 1rem 120px 1rem;
    box-sizing: border-box;
    background: transparent !important;
}

.analytics-page-wrapper .content-limit {
    max-width: 1100px;
    margin: 0 auto;
}

/* Header Styling */
.analytics-page-wrapper .header-content {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 2rem;
    width: 100%;
}

.analytics-page-wrapper .header-text {
    text-align: center;
}

.analytics-page-wrapper .header-text h1 {
    font-size: 3rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #ffffff 0%, var(--light-accent) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.analytics-page-wrapper .header-text p {
    color: var(--text-secondary);
    margin-top: 0.5rem;
    font-size: 1.1rem;
}

.analytics-page-wrapper .back-btn {
    position: absolute;
    left: 0;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: white;
    padding: 0.8rem;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 60;
    text-decoration: none;
}

.analytics-page-wrapper .back-btn:hover {
    background: var(--hover-bg);
    transform: translateX(-5px);
}

.analytics-page-wrapper .thin-line {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 233, 166, 0.3), transparent);
    margin-bottom: 3rem;
}

/* Procrastination Alert Card */
.procrastination-card {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 1.5rem;
    padding: 1.5rem 2rem;
    margin-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: slideIn 0.5s ease-out;
}

.alert-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #ef4444;
}

.alert-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
}

.pulse-icon {
    animation: pulse 2s infinite;
}

.alert-content p {
    margin: 0 0 0.75rem 0;
    font-size: 1.1rem;
    color: var(--text-primary);
}

.worst-offender {
    font-size: 0.95rem;
    color: var(--text-secondary);
    background: rgba(0, 0, 0, 0.2);
    padding: 0.75rem 1.25rem;
    border-radius: 12px;
    display: inline-block;
}

.delay-badge {
    background: #ef4444;
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 700;
    margin-left: 0.75rem;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.stat-card {
    background: var(--bg-secondary);
    backdrop-filter: blur(15px);
    border: 1px solid var(--border-color);
    border-radius: 1.5rem;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.12);
}

.stat-icon-wrapper {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.courses-bg { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.tasks-bg { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
.on-time-bg { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.avg-delay-bg { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }

.stat-label {
    display: block;
    font-size: 0.85rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.stat-value {
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
    color: white;
}

/* Analytics Sections */
.analytics-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.analytics-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1.5rem;
    padding: 2rem;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
}

.section-header h2 {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0;
}

.icon-purple { color: #a855f7; }
.icon-blue { color: #3b82f6; }

.data-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.data-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.item-label {
    width: 80px;
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 600;
}

.progress-container {
    flex: 1;
    height: 0.6rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 999px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    border-radius: 999px;
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.purple-bar { background: linear-gradient(90deg, #a855f7, #7e22ce); }
.blue-bar { background: linear-gradient(90deg, #3b82f6, #2563eb); }
.green-bar { background: linear-gradient(90deg, #10b981, #059669); }

.item-value {
    font-size: 1rem;
    font-weight: 700;
    color: white;
    min-width: 25px;
    text-align: right;
}

/* Completion Summary Card */
.completion-summary-card {
    background: linear-gradient(135deg, rgba(24, 34, 74, 0.4) 0%, rgba(11, 16, 32, 0.6) 100%);
    border: 1px solid var(--border-color);
    border-radius: 1.5rem;
    padding: 2.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.summary-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.completion-info h3 {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
}

.completion-percentage {
    font-size: 3.5rem;
    font-weight: 900;
    color: #10b981;
    text-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
}

.full-progress-bar {
    height: 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 999px;
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.efficiency-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #34d399);
    border-radius: 999px;
    transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations */
@keyframes slideIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
    .analytics-sections {
        grid-template-columns: 1fr;
    }
    
    .completion-summary-card {
        padding: 1.5rem;
    }
    
    .completion-percentage {
        font-size: 2.5rem;
    }
}

```

## client\src\pages\Analytics\Analytics.jsx

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    TrendingUp, BookOpen, CheckSquare, Clock, 
    AlertCircle, PieChart, BarChart2, ArrowLeft,
    CheckCircle2, ListTodo, Calendar, Timer, 
    Flame, Zap, LayoutGrid, ClipboardList
} from 'lucide-react';
import './Analytics.css';
import Navbar from '../../components/Navbar';

const Analytics = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        highPriorityTasks: 0,
        tasksByCourse: {},
        tasksByCategory: {},
        monthlyCompletion: {},
        yearlyCompletion: {},
        procrastination: {
            lateCompletions: 0,
            onTimeCompletions: 0,
            averageDelayDays: 0,
            mostDelayedTask: null
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.token) return;
            try {
                const [coursesRes, tasksRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/courses', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    }),
                    axios.get('http://localhost:5000/api/tasks', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    })
                ]);

                setCourses(coursesRes.data);
                setTasks(tasksRes.data);
                processStats(coursesRes.data, tasksRes.data);
            } catch (err) {
                console.error("Error fetching analytics data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const processStats = (coursesData, tasksData) => {
        const completed = tasksData.filter(t => t.status === 'completed');
        const pending = tasksData.length - completed.length;
        const highPriority = tasksData.filter(t => t.difficulty >= 8).length;

        // Tasks by Course
        const byCourse = {};
        tasksData.forEach(task => {
            if (task.course) {
                const courseCode = task.course.courseCode || 'Unknown';
                byCourse[courseCode] = (byCourse[courseCode] || 0) + 1;
            }
        });

        // Tasks by Category
        const byCategory = {};
        tasksData.forEach(task => {
            const cat = task.category || 'General';
            byCategory[cat] = (byCategory[cat] || 0) + 1;
        });

        // Monthly & Yearly Tracks
        const monthly = {};
        const yearly = {};
        tasksData.forEach(task => {
            const date = new Date(task.createdAt);
            const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            const year = date.getFullYear().toString();
            
            monthly[monthYear] = (monthly[monthYear] || 0) + 1;
            yearly[year] = (yearly[year] || 0) + 1;
        });

        // Procrastination Tracker
        let late = 0;
        let onTime = 0;
        let totalDelay = 0;
        let worstTask = null;
        let maxDelay = -Infinity;

        completed.forEach(task => {
            if (task.completedAt && task.deadline) {
                const completedDate = new Date(task.completedAt);
                const deadlineDate = new Date(task.deadline);
                
                const delayMs = completedDate - deadlineDate;
                const delayDays = delayMs / (1000 * 60 * 60 * 24);

                if (delayMs > 0) {
                    late++;
                    totalDelay += delayDays;
                    if (delayDays > maxDelay) {
                        maxDelay = delayDays;
                        worstTask = { title: task.title, delay: Math.round(delayDays) };
                    }
                } else {
                    onTime++;
                }
            }
        });

        setStats({
            totalCourses: coursesData.length,
            totalTasks: tasksData.length,
            completedTasks: completed.length,
            pendingTasks: pending,
            highPriorityTasks: highPriority,
            tasksByCourse: byCourse,
            tasksByCategory: byCategory,
            monthlyCompletion: monthly,
            yearlyCompletion: yearly,
            procrastination: {
                lateCompletions: late,
                onTimeCompletions: onTime,
                averageDelayDays: late > 0 ? (totalDelay / late).toFixed(1) : 0,
                mostDelayedTask: worstTask
            }
        });
    };

    if (loading) {
        return (
            <div className="analytics-page-wrapper">
                <div className="container">
                    <div className="content-limit">Loading Analytics...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page-wrapper">
            <div className="container">
                <div className="content-limit">
                    {/* Header Section */}
                    <div className="header-section">
                        <div className="header-content">
                            <Link to="/dashboard" className="back-btn">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="header-text">
                                <h1>Academic Analytics</h1>
                                <p>Comprehensive overview of your academic performance and trends</p>
                            </div>
                        </div>
                    </div>

                    <div className="thin-line"></div>

                    {/* Procrastination Alert */}
                    {stats.procrastination.lateCompletions > 0 && (
                        <div className="procrastination-card alert-theme">
                            <div className="alert-header">
                                <Timer className="pulse-icon" />
                                <h3>Procrastination Alert</h3>
                            </div>
                            <div className="alert-content">
                                <p>You have completed <strong>{stats.procrastination.lateCompletions}</strong> tasks late.</p>
                                {stats.procrastination.mostDelayedTask && (
                                    <div className="worst-offender">
                                        <span>Max Delay: </span>
                                        <strong>{stats.procrastination.mostDelayedTask.title}</strong> 
                                        <span className="delay-badge">{stats.procrastination.mostDelayedTask.delay} days late</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Expanded Stats Grid */}
                    <div className="stats-grid expanded-grid">
                        <div className="stat-card">
                            <div className="stat-icon-wrapper courses-bg"><BookOpen size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Courses</span>
                                <h2 className="stat-value">{stats.totalCourses}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper tasks-bg"><ListTodo size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Total Tasks</span>
                                <h2 className="stat-value">{stats.totalTasks}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper completed-bg"><CheckCircle2 size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Finished</span>
                                <h2 className="stat-value">{stats.completedTasks}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper high-priority-bg"><AlertCircle size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Hard Tasks</span>
                                <h2 className="stat-value">{stats.highPriorityTasks}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper on-time-bg"><Zap size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">On-Time</span>
                                <h2 className="stat-value">{stats.procrastination.onTimeCompletions}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper avg-delay-bg"><Clock size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Avg Delay</span>
                                <h2 className="stat-value">{stats.procrastination.averageDelayDays}d</h2>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Section Grid */}
                    <div className="analytics-sections">
                        {/* 1. Tasks by Course */}
                        <div className="analytics-section">
                            <div className="section-header">
                                <PieChart size={20} className="icon-blue" />
                                <h2>Tasks by Course</h2>
                            </div>
                            <div className="data-list">
                                {Object.entries(stats.tasksByCourse).length === 0 ? (
                                    <p className="empty-msg">No data</p>
                                ) : (
                                    Object.entries(stats.tasksByCourse).map(([course, count]) => (
                                        <div key={course} className="data-item">
                                            <span className="item-label">{course}</span>
                                            <div className="progress-container">
                                                <div className="progress-bar blue-bar" style={{ width: `${(count / stats.totalTasks) * 100}%` }}></div>
                                            </div>
                                            <span className="item-value">{count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 2. Tasks by Category */}
                        <div className="analytics-section">
                            <div className="section-header">
                                <BarChart2 size={20} className="icon-orange" />
                                <h2>Tasks by Category</h2>
                            </div>
                            <div className="data-list">
                                {Object.entries(stats.tasksByCategory).length === 0 ? (
                                    <p className="empty-msg">No data</p>
                                ) : (
                                    Object.entries(stats.tasksByCategory).map(([cat, count]) => (
                                        <div key={cat} className="data-item">
                                            <span className="item-label">{cat}</span>
                                            <div className="progress-container">
                                                <div className="progress-bar orange-bar" style={{ width: `${(count / stats.totalTasks) * 100}%` }}></div>
                                            </div>
                                            <span className="item-value">{count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 3. Monthly Activity */}
                        <div className="analytics-section">
                            <div className="section-header">
                                <Calendar size={20} className="icon-purple" />
                                <h2>Monthly Activity</h2>
                            </div>
                            <div className="data-list">
                                {Object.entries(stats.monthlyCompletion).map(([month, count]) => (
                                    <div key={month} className="data-item">
                                        <span className="item-label">{month}</span>
                                        <div className="progress-container">
                                            <div className="progress-bar purple-bar" style={{ width: `${(count / stats.totalTasks) * 100}%` }}></div>
                                        </div>
                                        <span className="item-value">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Yearly Activity */}
                        <div className="analytics-section">
                            <div className="section-header">
                                <TrendingUp size={20} className="icon-green" />
                                <h2>Yearly Track</h2>
                            </div>
                            <div className="data-list">
                                {Object.entries(stats.yearlyCompletion).map(([year, count]) => (
                                    <div key={year} className="data-item">
                                        <span className="item-label">{year}</span>
                                        <div className="progress-container">
                                            <div className="progress-bar green-bar" style={{ width: `${(count / stats.totalTasks) * 100}%` }}></div>
                                        </div>
                                        <span className="item-value">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Final Efficiency Summary */}
                    <div className="completion-summary-card">
                        <div className="summary-content">
                            <div className="completion-info">
                                <h3>Efficiency & Discipline</h3>
                                <p>Your ratio of on-time completions to total finished tasks.</p>
                            </div>
                            <div className="completion-percentage">
                                {stats.completedTasks > 0 
                                    ? Math.round((stats.procrastination.onTimeCompletions / stats.completedTasks) * 100) 
                                    : 0}%
                            </div>
                        </div>
                        <div className="full-progress-bar">
                            <div 
                                className="full-progress-fill efficiency-fill"
                                style={{ width: `${stats.completedTasks > 0 ? (stats.procrastination.onTimeCompletions / stats.completedTasks) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default Analytics;

```

## client\src\pages\CourseDetail\CourseDetail.css

```css
/* CourseDetail.css - Dark Theme */

.container {
  min-height: 100vh;
  background: transparent;
  padding: 2rem;
  color: var(--text-primary);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
}

.btn-back:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
  transform: translateX(-5px);
}

.course-detail-header {
  background: var(--bg-secondary);
  border-radius: 1.5rem;
  backdrop-filter: blur(15px);
  border: 1px solid var(--border-color);
  padding: 0;
  margin-bottom: 2rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.course-detail-header h1 {
  background: linear-gradient(135deg, var(--glow-color), var(--bg-dark));
  color: white;
  padding: 2.5rem 2rem 1rem 2rem;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  border-bottom: 1px solid var(--border-color);
}

.course-detail-header p {
  color: var(--text-secondary);
  background: linear-gradient(135deg, var(--glow-color), var(--bg-dark));
  padding: 0 2rem 2.5rem 2rem;
  margin: 0;
  font-size: 1.1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-dark);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 2rem;
  width: 90%;
  max-width: 28rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  color: var(--text-primary);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.btn-close {
  background: var(--bg-secondary);
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
}

.btn-close:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: white;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-blue);
  background: rgba(0, 0, 0, 0.4);
}

.textarea-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  color: white;
  resize: none;
  font-family: inherit;
  transition: all 0.2s;
}

.textarea-field:focus {
  outline: none;
  border-color: var(--accent-blue);
  background: rgba(0, 0, 0, 0.4);
}

.btn-submit {
  width: 100%;
  background-color: var(--accent-blue);
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-submit:hover {
  opacity: 0.9;
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.section-card {
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.icon-green { color: #10b981; }
.icon-orange { color: #f59e0b; }
.icon-blue { color: #3b82f6; }

.btn-add {
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.btn-add:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
  transform: scale(1.1);
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-message {
  color: var(--text-muted);
  font-size: 0.875rem;
  text-align: center;
  padding: 1.5rem 0;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
}

.item-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  position: relative;
  transition: all 0.2s;
}

.item-card:hover {
  background-color: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.item-content {
  flex: 1;
}

.item-content h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.item-content h3.completed {
  text-decoration: line-through;
  color: var(--text-muted);
}

.item-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  line-height: 1.4;
}

.task-checkbox {
  margin-top: 0.25rem;
  width: 1.1rem;
  height: 1.1rem;
  accent-color: #10b981;
  cursor: pointer;
  flex-shrink: 0;
}

.btn-delete {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.4;
  transition: all 0.2s;
}

.item-card:hover .btn-delete {
  opacity: 1;
}

.btn-delete:hover {
  transform: scale(1.2);
}

 @media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .course-detail-header h1 {
    font-size: 1.75rem;
  }

  .sections-grid {
    grid-template-columns: 1fr;
  }
}

```

## client\src\pages\CourseDetail\CourseDetail.jsx

```javascript
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const { type, item } = itemToDelete;
    let deleteUrl = '';

    if (type === 'task') {
        deleteUrl = `http://localhost:5000/api/courses/${id}/tasks/${item._id}`;
    } else if (type === 'assignment') {
        deleteUrl = `http://localhost:5000/api/courses/${id}/assignments/${item._id}`;
    } else if (type === 'material') {
        deleteUrl = `http://localhost:5000/api/materials/${id}/${item._id}`;
    }

    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(deleteUrl, config);

        if (type === 'task') {
            setTasks(prev => prev.filter(t => t._id !== item._id));
        } else if (type === 'assignment') {
            setAssignments(prev => prev.filter(a => a._id !== item._id));
        } else if (type === 'material') {
            setMaterials(prev => prev.filter(m => m._id !== item._id));
        }
    } catch (err) {
        console.error(`Error deleting ${type}:`, err);
        setError(err.response?.data?.message || `Failed to delete ${type}.`);
    } finally {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
    }
  };

  const handleDeleteClick = (e, type, item) => {
      e.preventDefault();
      e.stopPropagation();
      setItemToDelete({ type, item });
      setShowDeleteConfirm(true);
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

        {showDeleteConfirm && itemToDelete && (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <h2>Confirm Deletion</h2>
                    </div>
                    <p>Are you sure you want to delete the {itemToDelete.type} "{itemToDelete.item.title}"?</p>
                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                        <button onClick={() => {setShowDeleteConfirm(false); setItemToDelete(null);}} className="btn-secondary">
                            Cancel
                        </button>
                        <button onClick={confirmDelete} className="btn-primary">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )}



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
                    <button onClick={(e) => handleDeleteClick(e, 'task', task)} className="btn-delete">
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
                    <button onClick={(e) => handleDeleteClick(e, 'assignment', assignment)} className="btn-delete">
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
                    <button onClick={(e) => handleDeleteClick(e, 'material', material)} className="btn-delete">
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
```

## client\src\pages\Courses\Courses.css

```css
:root {
  --bg-dark: #0b1020;
  --glow-color: #18224a;
}

.courses-page-wrapper {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
}

.courses-page-wrapper .container {
  width: 100%;
  min-height: 100vh;
  padding: 3rem 1rem 120px 1rem;
  box-sizing: border-box;
  background: transparent !important;
}

.courses-page-wrapper .content-limit {
  max-width: 1100px;
  margin: 0 auto;
}

.back-btn {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.back-btn:hover {
    background: var(--hover-bg);
    transform: translateX(-2px);
}

/* Header & Animated Buttons */
.courses-page-wrapper .header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 2rem;
  width: 100%;
  min-height: 80px;
}

.courses-page-wrapper .header-text {
  text-align: center;
}

.courses-page-wrapper .back-btn {
  position: absolute;
  left: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 60;
}

.courses-page-wrapper .back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-5px);
}

.courses-page-wrapper .floating-button-wrapper {
  position: absolute;
  right: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.courses-page-wrapper .add-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffe9a6 0%, #e6d08f 100%);
  border: none;
  color: #0b1020;
  cursor: pointer;
  z-index: 50;
  box-shadow: 0 8px 25px rgba(255, 233, 166, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* Centering the icon */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 0;
}

.courses-page-wrapper .add-button svg {
  display: block;
  margin: 0;
}

.courses-page-wrapper .add-button.plus-active {
  transform: rotate(45deg);
  background: #cccccc;
}

.courses-page-wrapper .action-btn {
  position: absolute;
  padding: 0.8rem 1.4rem;
  border-radius: 50px;
  border: none;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
  cursor: pointer;
  z-index: 40;
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  transition: all 0.3s ease;
}

.courses-page-wrapper .btn-left {
  right: 80px;
  /*background: linear-gradient(135deg, #a855f7, #4f46e5);*/
  /*background: linear-gradient(135deg, #c084fc, #9333ea);*/
  background: linear-gradient(135deg, #a855f7, #7e22ce, #581c87);
}

.courses-page-wrapper .btn-bottom {
  top: 80px;
  /*background: linear-gradient(135deg, #a855f7, #4f46e5);*/
  /*background: linear-gradient(135deg, #c084fc, #9333ea);*/
  background: linear-gradient(135deg, #a855f7, #7e22ce, #581c87);
}

.courses-page-wrapper .btn-right {
  left: 80px;
  /*background: linear-gradient(135deg, #a855f7, #4f46e5);*/
  /*background: linear-gradient(135deg, #c084fc, #9333ea);*/
  background: linear-gradient(135deg, #a855f7, #7e22ce, #581c87);
}

.courses-page-wrapper .btn-left:hover,
.courses-page-wrapper .btn-bottom:hover,
.courses-page-wrapper .btn-right:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.6), 
              0 0 25px rgba(168, 85, 247, 0.4);
  color: white;
}

@keyframes bounceIn {
  from {
    opacity: 0;
    transform: scale(0.4);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Course Rows */
.courses-page-wrapper .thin-line {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 233, 166, 0.3), transparent);
  margin-bottom: 3rem;
}

.courses-page-wrapper .course-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.courses-page-wrapper .course-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  padding: 1.5rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.courses-page-wrapper .course-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--course-color, rgba(255, 233, 166, 0.3));
  transform: translateX(10px);
  box-shadow: -5px 0 20px -5px var(--course-color);
}

.courses-page-wrapper .course-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  border-radius: 1.5rem 0 0 1.5rem;
}

.courses-page-wrapper .course-code {
  color: #ffe9a6; /* Default fallback */
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.courses-page-wrapper .course-title {
  font-size: 1.5rem;
  margin: 0;
}

.courses-page-wrapper .icon-group-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.courses-page-wrapper .stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.courses-page-wrapper .stat-icon {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.courses-page-wrapper .task-bg {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.courses-page-wrapper .task-bg:hover {
  color: #10b981;
  transform: scale(1.2);
}

.courses-page-wrapper .assignment-bg {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.courses-page-wrapper .assignment-bg:hover {
  color: #f59e0b;
  transform: scale(1.2);
}

.courses-page-wrapper .material-bg {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.courses-page-wrapper .material-bg:hover {
  color: #3b82f6;
  transform: scale(1.2);
}

.courses-page-wrapper .delete-row-btn {
  background: none;
  border: none;
  color: rgba(239, 68, 68, 0.4);
  cursor: pointer;
}

.courses-page-wrapper .delete-row-btn:hover {
  color: #ef4444;
  transform: scale(1.2);
}

/* Delete Confirmation Modal - Glassy Dark Theme */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: modalFadeIn 0.3s ease;
}

.modal {
  background: radial-gradient(circle at 50% 0%, #18224a 0%, #0b1020 100%) !important;
  background-color: #0b1020 !important;

  /* Glass effect */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

    /* Border & Shadow */
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 2rem;
  padding: 2.5rem;
  width: 90%;
  max-width: 480px;

  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 
              0 0 20px rgba(24, 34, 74, 0.6); 

  color: white !important;
  animation: modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #ffe9a6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.btn-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 50%;
  display: flex;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  transform: rotate(90deg) scale(1.1);
  border-color: rgba(239, 68, 68, 0.2);
}

.modal-body {
  margin-bottom: 2.5rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  font-size: 1.1rem;
}

.highlight-text {
  color: #ffe9a6;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: rgba(255, 233, 166, 0.3);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1.25rem;
}

.btn-modal-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.8rem 1.8rem;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-modal-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.btn-modal-danger {
  background: linear-gradient(135deg, #a855f7, #7e22ce); /* Matches your purple action buttons theme */
  border: none;
  color: white;
  padding: 0.8rem 1.8rem;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(126, 34, 206, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-modal-danger:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(126, 34, 206, 0.5),
              0 0 15px rgba(168, 85, 247, 0.4);
}

.btn-modal-danger:active {
  transform: translateY(0) scale(0.98);
}

.btn-modal-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## client\src\pages\Courses\Courses.jsx

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plus, BookOpen, FileText, CheckSquare, Trash2, FileQuestion, X, ArrowLeft } from 'lucide-react';
import './Courses.css';
import axios from 'axios';

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskCounts, setTaskCounts] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCoursesAndTasks = async () => {
      if (!user || !user.token) {
        setLoading(false);
        setError('User not authenticated.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        // Fetch courses and tasks in parallel
        const [coursesResponse, tasksResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/courses', config),
          axios.get('http://localhost:5000/api/tasks', config)
        ]);
        
        setCourses(coursesResponse.data);

        // Process tasks to get counts
        const counts = tasksResponse.data.reduce((acc, task) => {
          if (task.course) {
            const courseId = task.course._id || task.course;
            acc[courseId] = (acc[courseId] || 0) + 1;
          }
          return acc;
        }, {});
        setTaskCounts(counts);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch courses or tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndTasks();
  }, [user]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete || !user || !user.token) {
      setError('Course or user not identified for deletion.');
      setShowDeleteConfirm(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/courses/${courseToDelete._id}`, config);
      setCourses(courses.filter((course) => course._id !== courseToDelete._id));
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error('Error deleting course:', err);
      setError(err.response?.data?.message || 'Failed to delete course.');
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.floating-button-wrapper')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);


  return (
    <div className="courses-page-wrapper">
      <div className="container">
        <div className="content-limit">

          {/* Header Section */}
          <div className="header-section">
            <div className="header-content">
              <Link to="/dashboard" className="back-btn">
                <ArrowLeft size={20}/>
              </Link>
              <div className="header-text">
                <h1>My Courses</h1>
                <p>Manage your courses and learning materials</p>
              </div>

              <div
                className="floating-button-wrapper"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredButton(null);
                }}
              >
                {/* on click + button toggles menu open/closed */}
                <button
                  className={`add-button ${isHovered || isMenuOpen ? 'plus-active' : ''}`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Plus size={28} />
                </button>

                {/* Floating action buttons are shown if menu is open */}
                {isHovered || isMenuOpen ? (
                  <>
                    <button
                      className={`action-btn btn-left ${hoveredButton === 1 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(1)}
                      onClick={() => navigate('/courses/add')}
                    >
                      <BookOpen size={18} /> Add Course
                    </button>

                    <button
                      className={`action-btn btn-bottom ${hoveredButton === 2 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(2)}
                      onClick={() => navigate('/taskpicker')}
                    >
                      <CheckSquare size={18} /> Add Task
                    </button>

                    <button
                      className={`action-btn btn-right ${hoveredButton === 3 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(3)}
                    >
                      <FileQuestion size={18} />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div className="thin-line"></div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && courseToDelete && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Confirm Deletion</h2>
                  <button onClick={() => { setShowDeleteConfirm(false); setError(null); }} className="btn-close">
                    <X size={24} />
                  </button>
                </div>
                <div className="modal-body">
                  {error && <p className="error-message">{error}</p>}
                  <p>Are you sure you want to delete the course <span className="highlight-text">"{courseToDelete.courseTitle}"</span>?</p>
                </div>
                <div className="modal-actions">
                  <button onClick={() => { setShowDeleteConfirm(false); setCourseToDelete(null); }} className="btn-modal-secondary">
                    Cancel
                  </button>
                  <button onClick={confirmDelete} className="btn-modal-danger" disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete Course'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Course Rows */}
          <div className="course-list">
            {courses.map(course => (
              <div
                key={course._id}
                className="course-card"
                onClick={() => window.location.href = `/coursedetails?id=${course._id}`}
                style={{ '--course-color': course.color }}
              >
                <div className="course-accent" style={{ backgroundColor: course.color }}></div>
                <div className="course-info">
                  <p className="course-code" style={{ color: course.color }}>{course.courseCode}</p>
                  <h3 className="course-title">{course.courseTitle}</h3>
                  <p className="course-meta">{taskCounts[course._id] || 0} tasks total</p>
                </div>

                <div className="icon-group-container">
                  <div className="stat-item">
                    <div className="stat-icon task-bg"><CheckSquare size={18} /></div>
                    <span className="stat-count">{taskCounts[course._id] || 0}</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon assignment-bg"><FileText size={18} /></div>
                    <span className="stat-count">0</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon material-bg"><BookOpen size={18} /></div>
                    <span className="stat-count">0</span>
                  </div>
                  <button
                    className="delete-row-btn"
                    title="Delete Course"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course);
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;
```

## client\src\pages\Dashboard\Dashboard.css

```css
/* Dashboard CSS Variables - Themed to match PandaLamp */
:root {
    --bg-primary: #0b1020;
    --bg-secondary: rgba(255, 255, 255, 0.08);
    /* Card background */
    --text-primary: rgba(255, 255, 255, 0.9);
    --text-secondary: rgba(255, 255, 255, 0.65);
    --text-muted: rgba(255, 255, 255, 0.45);
    --border-color: rgba(255, 255, 255, 0.1);
    --hover-bg: rgba(255, 255, 255, 0.12);
    --divider-color: rgba(255, 255, 255, 0.1);
    --nav-bg: rgba(11, 16, 32, 0.85);
    /* Glassy dark */
    --card-hover: rgba(255, 255, 255, 0.15);
    --accent-blue: #3b82f6;
    --accent-indigo: #6366f1;
    --light-accent: #ffe9a6;
    /* PandaLamp light accent */
}

/* Base Styles */
.dashboard-container {
    min-height: 100vh;
    width: 100%;
    /* PandaLamp Radial Gradient Background */
    background: radial-gradient(1200px 700px at 50% 10%, #18224a 0%, #0b1020 60%);
    color: var(--text-primary);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    overflow-x: hidden;
    padding-bottom: 80px;
    /* Space for bottom nav */
    transition: background 0.5s ease;
}

/* Visual Modes */
.dashboard-container.mode-doom {
    background: radial-gradient(1200px 700px at 50% 10%, #450a0a 0%, #1a0505 60%);
}

.dashboard-container.mode-panic {
    background: radial-gradient(1200px 700px at 50% 10%, #431407 0%, #1a0a05 60%);
}

.dashboard-container.mode-grind {
    background: radial-gradient(1200px 700px at 50% 10%, #3f2c06 0%, #151004 60%);
}

/* Tooltips & Badges */
.mode-badge {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    border-radius: 99px;
    color: #fff;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-left: 0.8rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}



/* Header Section (Replaces Top Navbar) */
.dashboard-header {
    max-width: 72rem;
    margin: 0 auto;
    padding: 2rem 2rem 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-title h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #fff 0%, var(--light-accent) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.header-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
}

/* User Badge */
.user-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.2s;
}

.user-badge:hover {
    background: var(--hover-bg);
    border-color: rgba(255, 255, 255, 0.2);
}

.user-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Main Content Area */
.main-content {
    max-width: 72rem;
    margin: 0 auto;
    padding: 1rem 2rem 8rem 2rem;
}

/* Hero Section */
.hero-section {
    margin-bottom: 3rem;
}

.pain-score-header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.pain-score-value {
    font-size: 2.25rem;
    /* text-4xl */
    font-weight: 700;
    color: var(--text-primary);
}

.pain-score-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.025em;
}

.progress-bar-container {
    height: 0.5rem;
    background-color: var(--bg-secondary);
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.progress-bar-fill {
    height: 100%;
    background-color: var(--accent-blue);
    border-radius: 9999px;
    transition: width 0.7s ease-in-out, background-color 0.5s ease;
}

.active-tasks-text {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

/* Quick Actions */
.quick-actions {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2.5rem;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    background-color: transparent;
}

.action-btn.primary {
    color: var(--text-primary);
}

.action-btn.secondary {
    color: var(--text-secondary);
}

.action-btn:hover {
    background-color: var(--hover-bg);
}

/* Section Common */
.section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.025em;
    margin: 0;
}

.section-subtitle {
    font-size: 0.75rem;
    color: var(--text-muted);
}

/* Timeline */
.timeline-section {
    margin-bottom: 3rem;
    width: 100%;
    overflow: hidden;
}

.timeline-wrapper {
    padding: 1.5rem 0;
    border-top: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
    width: 100%;
}

.timeline-scroll-area {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    /* Firefox */
    -ms-overflow-style: auto;
    /* IE/Edge */
    padding-bottom: 10px;
    /* space for scrollbar */
    padding-top: 20px;
    /* space for hover cards at top */
}

/* Optional: Custom scrollbar for Webkit */
.timeline-scroll-area::-webkit-scrollbar {
    height: 6px;
    display: block;
}

.timeline-scroll-area::-webkit-scrollbar-track {
    background: transparent;
}

.timeline-scroll-area::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 20px;
}

.timeline-content {
    position: relative;
    height: 320px;
    /* Significantly increased to fit hover cards */
    /* min-width set inline */
}

.timeline-base-line {
    position: absolute;
    top: 2rem;
    left: 0;
    right: 0;
    width: 100%;
    height: 1px;
    background-color: var(--border-color);
}

.timeline-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    width: 100%;
}

.timeline-day {
    position: relative;
    width: 80px;
    /* Fixed width per day */
    flex-shrink: 0;
}

.today-indicator {
    position: absolute;
    top: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 100%;
    /* Will span the full height */
    background-color: rgba(59, 130, 246, 0.2);
    z-index: 0;
}

.date-marker {
    position: absolute;
    top: 1.75rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 5;
}

.marker-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #d1d5db;
    /* gray-300 default */
}

[data-theme='dark'] .marker-dot {
    background-color: #374151;
    /* gray-700 */
}

.marker-dot.today {
    background-color: var(--accent-blue);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.date-label {
    margin-top: 0.75rem;
    text-align: center;
    transition: transform 0.2s;
}

.date-label.today {
    transform: scale(1.05);
}

.day-name {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
}

.today .day-name {
    color: var(--accent-blue);
}

.day-num {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
}

.today .day-num {
    color: var(--text-primary);
}

.month-name {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.125rem;
}

/* Timeline Tasks */
.timeline-tasks-layer {
    position: absolute;
    top: 9rem;
    /* Pushed down significantly to give room for tooltips */
    left: 0;
    right: 0;
    height: 100%;
}

.timeline-task-marker {
    position: absolute;
    /* left and top set inline */
    z-index: 10;
    transition: z-index 0.2s;
    /* delay slightly to keep tooltip on top while transitioning out */
}

.timeline-task-marker:hover {
    z-index: 100;
    /* Bring to front on hover */
}

.task-connection-line {
    position: absolute;
    bottom: 50%;
    /* Connect from dot upwards */
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 7rem;
    /* Make it reach up to the date line roughly */
    background-color: var(--border-color);
    opacity: 0.2;
    transition: opacity 0.2s;
    pointer-events: none;
    transform-origin: bottom center;
}

.timeline-task-marker:hover .task-connection-line {
    opacity: 0.6;
    background-color: var(--accent-blue);
}

.task-dot {
    position: relative;
    width: 0.875rem;
    /* Slightly larger */
    height: 0.875rem;
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--bg-primary);
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
}

.timeline-task-marker:hover .task-dot {
    transform: scale(1.3);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.task-ping {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    opacity: 0.3;
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Hover Card for Timeline Task */
.task-hover-card {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 1.5rem;
    /* Position above the dot */
    width: 280px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    z-index: 100;
    margin-bottom: 10px;
}

.timeline-task-marker:hover .task-hover-card {
    opacity: 1;
    visibility: visible;
    bottom: 2rem;
    /* Slide up slightly */
    pointer-events: auto;
    /* Allow interaction if needed */
}

.card-content {
    background-color: var(--bg-primary);
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px var(--border-color);
    position: relative;
}

.card-arrow {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: var(--bg-primary) transparent transparent transparent;
}

/* Border for arrow requires specific handling or pseudo-element trick, keeping simple for now or using drop-shadow on parent */

.card-body {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
}

.course-stripe {
    width: 0.25rem;
    height: 3rem;
    border-radius: 9999px;
    flex-shrink: 0;
}

.card-details {
    flex: 1;
    min-width: 0;
}

.card-course {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 0.25rem;
}

.card-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
}

.card-meta {
    display: flex;
    gap: 0.75rem;
    font-size: 0.75rem;
}

.meta-item {
    display: flex;
    gap: 0.375rem;
    align-items: center;
}

.meta-label {
    color: var(--text-muted);
}

.meta-value {
    font-weight: 600;
    color: var(--text-secondary);
}

.card-date {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
}

/* Task List */
.task-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    /* space-y-px equivalent concept, usually needs a background for separators, or use margin */
}

.task-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s, opacity 0.2s;
}

.task-item:hover {
    background-color: var(--card-hover);
}

.task-item.completed {
    opacity: 0.5;
}

.task-checkbox {
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
    border: 2px solid #d1d5db;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    flex-shrink: 0;
}

.task-checkbox:checked {
    background-color: var(--accent-blue);
    border-color: var(--accent-blue);
}

.task-checkbox:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
}

.task-course-dot {
    width: 0.25rem;
    height: 2rem;
    border-radius: 9999px;
    flex-shrink: 0;
}

.task-content {
    flex: 1;
    min-width: 0;
}

.task-title {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.125rem;
}

.completed .task-title {
    text-decoration: line-through;
}

.task-subtitle {
    font-size: 0.75rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.task-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
}



@keyframes ping {

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}
```

## client\src\pages\Dashboard\Dashboard.jsx

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, CheckSquare,
    Plus, Calendar, Clock, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // State management
    const [tasks, setTasks] = useState([]);
    const [painScore, setPainScore] = useState(0);
    const [loading, setLoading] = useState(true);

    // Mode Configuration
    const getModeConfig = (score) => {
        if (score >= 80) return { mode: 'Doom', color: '#ef4444', class: 'mode-doom' }; // Red
        if (score >= 60) return { mode: 'Panic', color: '#f97316', class: 'mode-panic' }; // Orange
        if (score >= 30) return { mode: 'Grind', color: '#f59e0b', class: 'mode-grind' }; // Amber/Yellow
        return { mode: 'Relaxed', color: '#10b981', class: 'mode-relaxed' }; // Green/Teal
    };

    const currentMode = getModeConfig(painScore);

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/api/tasks', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    // Transform data to match UI needs
                    const formattedTasks = data.map(task => ({
                        id: task._id,
                        name: task.title,
                        deadline: task.deadline ? task.deadline.split('T')[0] : '', // Format date string
                        difficulty: task.difficulty,
                        weight: task.weight,
                        course: task.course ? task.course.courseCode : task.category || 'General',
                        courseColor: task.course ? task.course.color : '#6b7280', // Default gray for general
                        completed: task.status === 'completed',
                        createdAt: task.createdAt
                    }));

                    setTasks(formattedTasks);
                    calculatePainScore(formattedTasks);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);


//Pain score formula
const calculatePainScore = (taskList) => {
    const activeTasks = taskList.filter(t => !t.completed);

    if (activeTasks.length === 0) {
        setPainScore(0);
        return;
    }

    const MAX_DIFFICULTY = 5;
    const REFERENCE_TASK_COUNT = 10;

    const taskCount = activeTasks.length;

    let totalDifficulty = 0;
    let urgencySum = 0;
    let procrastinationSum = 0;

    const now = new Date();

    activeTasks.forEach(task => {

        const difficultyNorm = (task.difficulty || 1) / MAX_DIFFICULTY;
        const weightNorm = (task.weight || 1) / 100;  

        totalDifficulty += difficultyNorm;

        const deadlineDate = new Date(task.deadline || now);
        const timeDiff = deadlineDate - now;
        const daysRemaining = Math.max(
            1,
            Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
        );

        // Softer urgency growth
        const urgency =
            difficultyNorm *
            weightNorm *
            (1 / Math.sqrt(daysRemaining));

        urgencySum += urgency;

        // Panic boost when very close
        if (daysRemaining <= 2) {
            const procrastination =
                difficultyNorm *
                weightNorm *
                (1 / Math.sqrt(daysRemaining));

            procrastinationSum += procrastination;
        }
    });

    const avgDifficulty = totalDifficulty / taskCount;
    const avgUrgency = urgencySum / taskCount;
    const avgProcrastination = procrastinationSum / taskCount;

    // Workload grows slowly with more tasks
    const workloadPressure =
        Math.log(taskCount + 1) /
        Math.log(REFERENCE_TASK_COUNT + 1);

    const combined =
          (0.30 * avgDifficulty)
        + (0.35 * avgUrgency)
        + (0.25 * workloadPressure)
        + (0.10 * avgProcrastination);

    // Compression curve so 100 is rare
    let finalScore = Math.pow(combined, 0.8) * 100;

    finalScore = Math.round(finalScore);
    finalScore = Math.min(100, Math.max(1, finalScore));

    setPainScore(finalScore);
};

    // Toggle task completion
    const toggleTask = async (taskId, currentStatus) => {
       
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: !currentStatus } : task
        );
        setTasks(updatedTasks);
        calculatePainScore(updatedTasks);

        // API Call
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed: !currentStatus })
            });
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Get timeline data
    const getNotionTimeline = () => {
        const today = new Date();
        const timeline = [];

        for (let i = 0; i < 21; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            timeline.push({
                date: dateStr,
                dayNum: date.getDate(),
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                monthName: date.toLocaleDateString('en-US', { month: 'short' }),
                isToday: i === 0,
                isWeekend: date.getDay() === 0 || date.getDay() === 6,
            });
        }

        return timeline;
    };

    const timeline = getNotionTimeline();

    // Get tasks on timeline
    const getTasksOnTimeline = () => {
        const tasksWithPosition = [];

        tasks.filter(t => !t.completed).forEach(task => {
            if (!task.deadline) return;
            const deadlineIndex = timeline.findIndex(day => day.date === task.deadline);
            if (deadlineIndex !== -1) {
                tasksWithPosition.push({
                    ...task,
                    position: deadlineIndex,
                });
            }
        });

        return tasksWithPosition;
    };

    const timelineTasks = getTasksOnTimeline();

    if (loading) {
        return <div className="dashboard-container center-content">Loading your pain...</div>;
    }

    return (
        <div className={`dashboard-container ${currentMode.class}`} data-theme="dark">
            {/* New Header Section */}
            <header className="dashboard-header">
                <div className="header-title">
                    <h1>RPS Dashboard</h1>
                    <span className="mode-badge" style={{ backgroundColor: currentMode.color }}>
                        {currentMode.mode} Mode
                    </span>
                </div>
                <div className="header-controls">
                    {/* User Badge */}
                    <div className="user-badge">
                        <div className="user-avatar">{user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}</div>
                        <span className="user-name">{user?.name || 'User'}</span>
                    </div>
                </div>
            </header>

            <div className="main-content">
                {/* Hero Status - Notion Style */}
                <div className="hero-section">
                    <div className="pain-score-header">
                        <h2 className="pain-score-value" style={{ color: currentMode.color }}>
                            {painScore}
                        </h2>
                        <span className="pain-score-label">
                            Pain Score
                        </span>
                    </div>

                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${Math.min(painScore, 100)}%`,
                                backgroundColor: currentMode.color
                            }}
                        ></div>
                    </div>

                    <p className="active-tasks-text">
                        {tasks.filter(t => !t.completed).length} active tasks across your courses
                    </p>
                </div>

                {/* Quick Actions - Minimal Style */}
                <div className="quick-actions">
                    <button className="action-btn primary" onClick={() => navigate('/taskpicker')}>
                        <Plus size={16} />
                        New Task
                    </button>
                    <button className="action-btn secondary" onClick={() => console.log('Calendar clicked')}>
                        <Calendar size={16} />
                        Calendar
                    </button>
                </div>

                {/* Timeline Section - Notion Style */}
                <div className="timeline-section">
                    <div className="section-header">
                        <Clock size={18} className="text-muted" style={{ color: 'var(--text-muted)' }} />
                        <h3 className="section-title">
                            Timeline
                        </h3>
                        <span className="section-subtitle">• Next 3 weeks</span>
                    </div>

                    <div className="timeline-wrapper">
                        <div className="timeline-scroll-area">
                            <div className="timeline-content" style={{ minWidth: `${timeline.length * 80}px` }}>
                                {/* Timeline Base Line */}
                                <div className="timeline-base-line"></div>

                                {/* Date Markers */}
                                <div className="timeline-grid">
                                    {timeline.map((day, index) => (
                                        <div
                                            key={index}
                                            className="timeline-day"
                                        >
                                            {/* Today indicator */}
                                            {day.isToday && (
                                                <div className="today-indicator"></div>
                                            )}

                                            {/* Date marker */}
                                            <div className="date-marker">
                                                <div className={`marker-dot ${day.isToday ? 'today' : ''}`}></div>

                                                {/* Date label */}
                                                <div className={`date-label ${day.isToday ? 'today' : ''}`}>
                                                    <div className="day-name">
                                                        {day.dayName}
                                                    </div>
                                                    <div className="day-num">
                                                        {day.dayNum}
                                                    </div>
                                                    {(index === 0 || day.dayNum === 1) && (
                                                        <div className="month-name">{day.monthName}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Task Dots */}
                                <div className="timeline-tasks-layer">
                                    {timelineTasks.map((task, idx) => {
                                        const leftPosition = task.position * 80 + 30; // Center in 80px column (roughly)
                                        const sameDateTasks = timelineTasks.filter(t => t.position === task.position);
                                        const taskIndex = sameDateTasks.findIndex(t => t.id === task.id);
                                        // Increased spacing to 28px for better visual stacking
                                        const verticalOffset = taskIndex * 28;

                                        return (
                                            <div
                                                key={task.id}
                                                className="timeline-task-marker"
                                                style={{
                                                    left: `${leftPosition}px`,
                                                    top: `${verticalOffset}px`
                                                }}
                                            >
                                                {/* Connection line */}
                                                <div className="task-connection-line"
                                                    style={{ height: `${9 + (verticalOffset / 16)}rem` }}
                                                ></div>

                                                {/* Dot */}
                                                <div
                                                    className="task-dot"
                                                    style={{
                                                        backgroundColor: task.courseColor,
                                                    }}
                                                >
                                                    <div
                                                        className="task-ping"
                                                        style={{ backgroundColor: task.courseColor }}
                                                    ></div>
                                                </div>

                                                {/* Hover Card */}
                                                <div className="task-hover-card">
                                                    <div className="card-content">
                                                        {/* Arrow (optional, handled by CSS placement mostly) */}
                                                        {/* <div className="card-arrow"></div> */}

                                                        <div className="card-body">
                                                            <div
                                                                className="course-stripe"
                                                                style={{ backgroundColor: task.courseColor }}
                                                            ></div>
                                                            <div className="card-details">
                                                                <div className="card-course">
                                                                    {task.course}
                                                                </div>
                                                                <div className="card-title">
                                                                    {task.name}
                                                                </div>
                                                                <div className="card-meta">
                                                                    <div className="meta-item">
                                                                        <span className="meta-label">Diff:</span>
                                                                        <span className="meta-value">{task.difficulty}/10</span>
                                                                    </div>
                                                                    <div className="meta-item">
                                                                        <span className="meta-label">Weight:</span>
                                                                        <span className="meta-value">{task.weight}%</span>
                                                                    </div>
                                                                </div>
                                                                <div className="card-date">
                                                                    {new Date(task.deadline).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks List - Notion Style */}
                <div>
                    <div className="section-header">
                        <CheckSquare size={18} className="text-muted" style={{ color: 'var(--text-muted)' }} />
                        <h3 className="section-title">
                            Tasks
                        </h3>
                        <span className="section-subtitle">• Sorted by priority</span>
                    </div>

                    <div className="task-list">
                        {tasks.slice(0, 10).map((task, index) => (
                            <div
                                key={task.id}
                                className={`task-item ${task.completed ? 'completed' : ''}`}
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleTask(task.id, task.completed);
                                    }}
                                    className="task-checkbox"
                                />

                                {/* Course Color */}
                                <div
                                    className="task-course-dot"
                                    style={{ backgroundColor: task.courseColor }}
                                ></div>

                                {/* Task Info */}
                                <div className="task-content">
                                    <div className="task-title">
                                        {task.name}
                                    </div>
                                    <div className="task-subtitle">
                                        <span>{task.course}</span>
                                        <span>•</span>
                                        <span>{task.deadline}</span>
                                    </div>
                                </div>

                                {/* Stats - Minimal */}
                                <div className="task-stats">
                                    <div className="meta-item">
                                        <span className="meta-label">Diff</span>
                                        <span className="meta-value">{task.difficulty}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">Wt</span>
                                        <span className="meta-value">{task.weight}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && (
                            <div className="empty-state">
                                No tasks found. Create one to get started!
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};



export default Dashboard;
```

## client\src\pages\Login\Login.css

```css
/* client/src/styles/Login.css */
.login-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: #f5f5f5;
}

.login-page h2 {
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #333;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-form input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.login-form button {
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.login-form button:hover {
    background-color: #0056b3;
}
```

## client\src\pages\Login\Login.jsx

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login successful:', response.data);

      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      console.log('Login failed:', error.response?.data || error.message);
      // Handle error (e.g., show error message)
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

```

## client\src\pages\Signup\Signup.css

```css
/* client/src/pages/Signup/Signup.css */
.signup-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: #f5f5f5;
}

.signup-page h2 {
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #333;
}

.signup-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.signup-form input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.signup-form button {
    padding: 0.75rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.signup-form button:hover {
    background-color: #218838;
}
```

## client\src\pages\Signup\Signup.jsx

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      console.log('Sign Up successful:', response.data);

      if (response.data.token) {
        login(response.data.user, response.data.token);
        navigate('/');
      } else {
        navigate('/login');
      }

    } catch (error) {
      console.log('Sign Up failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Sign Up failed');
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;

```

## client\src\services\.gitkeep

```

```

## client\vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

## server\config\.gitkeep

```

```

## server\controllers\.gitkeep

```

```

## server\controllers\courseController.js

```javascript
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// Get all courses
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ user: req.user.id });
    res.json(courses);
});


const createCourse = asyncHandler(async (req, res) => {
    const { courseTitle, courseCode, color, semester } = req.body;

    // Check if course with this code already exists for the user
    const existingCourse = await Course.findOne({ user: req.user.id, courseCode: courseCode });
    if (existingCourse) {
        return res.status(400).json({ message: 'Course with this code already exists for this user.' });
    }

    const newCourse = new Course({
        courseTitle,
        courseCode,
        color,
        semester,
        user: req.user.id,
    });

    const course = await newCourse.save();
    res.status(201).json(course);
});

// Delete a course
const deleteCourse = asyncHandler(async (req, res) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course removed' });
});

// Get course by ID
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.json(course);
});

// Get all tasks for a course
const getTasks = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.json(course.tasks);
});

// Add a task to a course
const addTask = asyncHandler(async (req, res) => {
    const { title, description, completed } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const newTask = {
        title,
        description,
        completed: completed || false,
    };

    course.tasks.push(newTask);
    await course.save();

    res.status(201).json(course.tasks[course.tasks.length - 1]);
});

// Update a task in a course
const updateTask = asyncHandler(async (req, res) => {
    const { title, description, completed } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const task = course.tasks.id(req.params.taskId);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;

    await course.save();

    res.json(task);
});

// Delete a task from a course
const deleteTask = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const task = course.tasks.id(req.params.taskId);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    task.deleteOne();
    await course.save();

    res.json({ message: 'Task removed' });
});

// Get all assignments for a course
const getAssignments = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.json(course.assignments);
});

// Add an assignment to a course
const addAssignment = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const newAssignment = {
        title,
        description,
    };

    course.assignments.push(newAssignment);
    await course.save();

    res.status(201).json(course.assignments[course.assignments.length - 1]);
});

// Delete an assignment from a course
const deleteAssignment = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const assignment = course.assignments.id(req.params.assignmentId);

    if (!assignment) {
        res.status(404);
        throw new Error('Assignment not found');
    }

    assignment.deleteOne();
    await course.save();

    res.json({ message: 'Assignment removed' });
});

module.exports = {
    getCourses,
    createCourse,
    deleteCourse,
    getCourseById,
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    getAssignments,
    addAssignment,
    deleteAssignment,
};

```

## server\controllers\materialController.js

```javascript
const asyncHandler = require('express-async-handler');
const Material = require('../models/Material');
const Course = require('../models/Course');
const cloudinary = require('../utils/cloudinary'); 

const uploadMaterial = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { title, description } = req.body;


    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const course = await Course.findById(courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to add material to this course');
    }

    try {
        // Convert buffer to data URI
        const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: `course_materials/${courseId}`, 
            resource_type: 'auto', 
            public_id: req.file.originalname.split('.')[0] + '-' + Date.now(), 
        });

        const newMaterial = await Material.create({
            title,
            description: description || '', 
            fileUrl: result.secure_url,
            publicId: result.public_id,
            course: courseId,
            user: req.user.id,
        });

        res.status(201).json(newMaterial);
    } catch (error) {
        console.error('Cloudinary upload or material save failed:', error);
        res.status(500);
        throw new Error('Material upload failed');
    }
});

const getCourseMaterials = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to view materials for this course');
    }

    const materials = await Material.find({ course: courseId, user: req.user.id }).sort({ createdAt: -1 });
    res.json(materials);
});

const deleteMaterial = asyncHandler(async (req, res) => {
    const { courseId, materialId } = req.params;

    const material = await Material.findById(materialId);

    if (!material) {
        res.status(404);
        throw new Error('Material not found');
    }

    if (material.course.toString() !== courseId || material.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to delete this material');
    }

    try {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(material.publicId);

        // Delete from database
        await Material.findByIdAndDelete(materialId);

        res.json({ message: 'Material removed' });
    } catch (error) {
        console.error('Cloudinary deletion or material removal failed:', error);
        res.status(500);
        throw new Error('Material deletion failed');
    }
});

module.exports = {
    uploadMaterial,
    getCourseMaterials,
    deleteMaterial,
};

```

## server\middleware\.gitkeep

```

```

## server\middleware\auth.js

```javascript
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId }; // Match the payload structure from auth.js which is { userId: ... }
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

```

## server\middleware\authMiddleware.js

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
}

module.exports = { protect };

```

## server\models\.gitkeep

```

```

## server\models\Course.js

```javascript
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseTitle: {
        type: String,
        required: [true, 'Please add a course title'] // e.g., "Web Programming"
    },
    courseCode: {
        type: String,
        required: [true, 'Please add a course code'] // e.g., "CSE 4540"
    },
    color: {
        type: String,
        default: '#3b82f6' // Default blue if user doesn't pick one
    },
    semester: {
        type: String,
        default: 'Current'
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
```

## server\models\Material.js

```javascript
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String, // This will store the path/URL to the uploaded file
        required: true
    },
    fileType: {
        type: String,
        default: 'pdf'
    }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
```

## server\models\Task.js

```javascript
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['Exam', 'Assignment', 'Lab Task', 'Presentation', 'Project', 'General'],
        default: 'General',
        required: true
    },
    // --- PAIN SCORE METRICS ---
    deadline: {
        type: Date,
        required: true
    },
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 5
    },
    weight: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
        default: 10
    },
    materials: {
        type: String // URL or file path
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'overdue'],
        default: 'pending'
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);

```

## server\models\User.js

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare given password with stored password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

```

## server\package.json

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cloudinary": "^2.9.0",
    "cors": "^2.8.6",
    "dotenv": "^17.2.4",
    "express": "^5.2.1",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.1.6",
    "multer": "^2.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}

```

## server\routes\.gitkeep

```

```

## server\routes\auth.js

```javascript
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const debug = true;

// Sign Up Route
router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;

  if (email) email = email.toLowerCase().trim();

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      if (debug) {
        console.log("DEBUG: User already exists");
      }
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ name, email, password });

    // Save the user in the database
    await user.save();

    // Create JWT token after user is created
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response with the token
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error during sign up" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  if (email) email = email.toLowerCase().trim();

  try {

    if (debug) {
      console.log("DEBUG: Received login request");
      console.log("DEBUG: Login attempt with email:", email);
      console.log("DEBUG: Login attempt with password:", password);
    }
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      if (debug) {
        console.log("DEBUG: User not found");
      }
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      if (debug) {
        console.log("DEBUG: Password does not match");
      }
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token after successful login
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response with JWT
    res.status(200).json({ token });
    if (debug) {
      console.log("DEBUG: Login successful");
    }
  } catch (error) {
    if (debug) {
      console.log("DEBUG: Server error during login");
    }
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;

```

## server\routes\course.js

```javascript
const express = require('express');
const router = express.Router();
const {
    getCourses,
    createCourse,
    deleteCourse,
    getCourseById,
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    getAssignments,
    addAssignment,
    deleteAssignment
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCourses)
    .post(protect, createCourse);

router.route('/:id')
    .get(protect, getCourseById)
    .delete(protect, deleteCourse);

// Task routes
router.route('/:id/tasks')
    .get(protect, getTasks)
    .post(protect, addTask);

router.route('/:id/tasks/:taskId')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

// Assignment routes
router.route('/:id/assignments')
    .get(protect, getAssignments)
    .post(protect, addAssignment);

router.route('/:id/assignments/:assignmentId')
    .delete(protect, deleteAssignment);

module.exports = router;

```

## server\routes\courses.js

```javascript
const express = require('express');
const router = express.Router();
const { getCourses, createCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCourses).post(protect, createCourse);

module.exports = router;

```

## server\routes\material.js

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadMaterial, getCourseMaterials, deleteMaterial } = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');

// Configure Multer to store files in memory
const storage = multer.memoryStorage();

// Filter file types
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG, PDF, DOC, DOCX is allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 
    },
    fileFilter: fileFilter
});


router.post('/:courseId', protect, upload.single('materialFile'), uploadMaterial);

router.get('/:courseId', protect, getCourseMaterials);

router.delete('/:courseId/:materialId', protect, deleteMaterial);

module.exports = router;

```

## server\routes\tasks.js

```javascript
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/tasks  Get all tasks for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id })
            .populate('course', 'courseTitle courseCode color')
            .sort({ deadline: 1 }); // Sort by nearest deadline
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tasks Create a task
router.post('/', protect, async (req, res) => {
    const { title, description, deadline, date, category, difficulty, materials, weight, course } = req.body;

    // Use 'deadline' if present, otherwise 'date' (fallback for teammate's code)
    const taskDeadline = deadline || date;

    try {
        const newTask = new Task({
            user: req.user.id,
            title,
            description,
            deadline: taskDeadline,
            category,
            difficulty,
            weight,
            materials,
            course: course || null
        });

        const task = await newTask.save();
        // Populate course info for the response
        await task.populate('course', 'courseTitle courseCode color');
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/tasks/course/:courseId  Get all tasks for a specific course
router.get('/course/:courseId', protect, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id,
            course: req.params.courseId
        }).sort({ deadline: 1 }).populate('course', 'courseCode courseTitle color');
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/tasks/:id  Get a single task by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('course', 'courseCode courseTitle color');

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Check user
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(task);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tasks/:id  Update a task
router.put('/:id', protect, async (req, res) => {
    const { title, description, deadline, category, difficulty, weight, materials, course, status, completed } = req.body;

    // Build task object
    const taskFields = {};
    if (title) taskFields.title = title;
    if (description) taskFields.description = description;
    if (deadline) taskFields.deadline = deadline;
    if (category) taskFields.category = category;
    if (difficulty) taskFields.difficulty = difficulty;
    if (weight) taskFields.weight = weight;
    if (materials) taskFields.materials = materials;
    if (course !== undefined) taskFields.course = course; // allow clearing course
    if (status) {
        taskFields.status = status;
        if (status === 'completed') {
            taskFields.completedAt = Date.now();
        } else {
            taskFields.completedAt = null;
        }
    }

    // Handle 'completed' boolean from frontend toggle (legacy/teammate support)
    if (completed !== undefined) {
        taskFields.status = completed ? 'completed' : 'pending';
        if (completed) taskFields.completedAt = Date.now();
        else taskFields.completedAt = null;
    }

    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Make sure user owns task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true }
        ).populate('course', 'courseTitle courseCode color');

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/tasks/:id  Delete a task
router.delete('/:id', protect, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Make sure user owns task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;

```

## server\server.js

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const materialRoutes = require('./routes/material');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Project RPS API: The Pain Score is calculating...' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Use authentication routes
app.use('/api/auth', authRoutes);
// Use course routes
app.use('/api/courses', courseRoutes);

// Use task routes
app.use('/api/tasks', taskRoutes);

// Use material routes
app.use('/api/materials', materialRoutes);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

```

## server\utils\.gitkeep

```

```

## server\utils\cloudinary.js

```javascript
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '../.env' }); 

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = cloudinary;
```

