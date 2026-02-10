import React, { useState } from 'react';
import './CourseDetails.css'; // Make sure your CSS file is imported here

const CourseDetails = () => {
    // State for the active tab ('tasks' or 'materials')
    const [activeTab, setActiveTab] = useState('tasks');

    // State for tasks to handle the "is-completed" toggle logic
    const [tasks, setTasks] = useState([
        { id: 1, text: "Complete Module 1 Quiz", completed: false },
        { id: 2, text: "Read Chapter 4: State Management", completed: true }, // Pre-completed in original
        { id: 3, text: "Submit Project Proposal", completed: false },
        { id: 4, text: "Watch Lecture 5 Video", completed: false },
        { id: 5, text: "Peer Review Assignment", completed: false },
    ]);

    // Function to toggle task completion status
    const toggleTask = (id) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <div className="picker-container">

            <div className="header-section">
                <div className="header-content">
                    <div className="header-text">
                        <h1 className="header-title">Course Details</h1>
                        <p className="header-description">Manage your tasks and learning materials</p>
                    </div>
                </div>
            </div>

            <div className="thin-line"></div>

            <div className="stats-container">
                <div className="stats-box">
                    <h3>Total Tasks</h3>
                    <p>25</p>
                </div>
                <div className="stats-box">
                    <h3>Course progress</h3>
                    <p>12</p>
                </div>
                <div className="stats-box">
                    <h3>Pain Points</h3>
                    <p>5</p>
                </div>
                <div className="stats-box">
                    <h3>Nearest Deadline Deadlines</h3>
                    <p>3</p>
                </div>
            </div>

            {/* Main Glassmorphic Box */}
            <div className="glass-panel">

                {/* Toggle Switch */}
                <div className="toggle-container">
                    <button
                        id="btn-tasks"
                        className={`toggle-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tasks')}
                    >
                        Tasks
                    </button>
                    <button
                        id="btn-materials"
                        className={`toggle-btn ${activeTab === 'materials' ? 'active' : ''}`}
                        onClick={() => setActiveTab('materials')}
                    >
                        Course Materials
                    </button>

                    {/* Animated sliding background */}
                    <div
                        id="toggle-slider"
                        className={`toggle-slider ${activeTab === 'materials' ? 'slide-right' : ''}`}
                    ></div>
                </div>

                {/* Content Area */}
                <div className="panel-content">

                    {/* 1. TASKS LIST SECTION */}
                    {activeTab === 'tasks' && (
                        <div id="tasks-section" className="list-container" style={{ display: 'flex' }}>

                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`list-item task-item ${task.completed ? 'is-completed' : ''}`}
                                    onClick={() => toggleTask(task.id)}
                                >
                                    <div className="custom-checkbox">
                                        <svg viewBox="0 0 24 24" className="check-icon">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="item-text">{task.text}</span>
                                </div>
                            ))}

                        </div>
                    )}

                    {/* 2. MATERIALS LIST SECTION */}
                    {activeTab === 'materials' && (
                        <div id="materials-section" className="list-container" style={{ display: 'flex' }}>

                            {/* Material 1 */}
                            <div className="list-item material-item">
                                <div className="file-icon pdf">PDF</div>
                                <div className="material-info">
                                    <span className="item-text">Lecture 1 Slides</span>
                                    <span className="item-subtext">2.4 MB</span>
                                </div>
                                <button className="download-btn">↓</button>
                            </div>

                            {/* Material 2 */}
                            <div className="list-item material-item">
                                <div className="file-icon doc">DOC</div>
                                <div className="material-info">
                                    <span className="item-text">React Hooks Cheat Sheet</span>
                                    <span className="item-subtext">1.1 MB</span>
                                </div>
                                <button className="download-btn">↓</button>
                            </div>

                            {/* Material 3 */}
                            <div className="list-item material-item">
                                <div className="file-icon pdf">PDF</div>
                                <div className="material-info">
                                    <span className="item-text">Project Guidelines</span>
                                    <span className="item-subtext">500 KB</span>
                                </div>
                                <button className="download-btn">↓</button>
                            </div>

                            {/* Material 4 */}
                            <div className="list-item material-item">
                                <div className="file-icon zip">ZIP</div>
                                <div className="material-info">
                                    <span className="item-text">Source Code - Demo</span>
                                    <span class="item-subtext">12 MB</span>
                                </div>
                                <button className="download-btn">↓</button>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CourseDetails;