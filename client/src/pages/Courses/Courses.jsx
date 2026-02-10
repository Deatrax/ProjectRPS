import React, { useState } from 'react';
import { Plus, BookOpen, FileText, CheckSquare, Trash2, FileQuestion } from 'lucide-react';
import './Courses.css';

export default function CoursesDemo() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  const [courses] = useState([
    { id: 1, name: 'Introduction to React', code: 'CS-101', tasks: 5, assignments: 8, materials: 12 },
    { id: 2, name: 'Advanced JavaScript', code: 'CS-202', tasks: 3, assignments: 6, materials: 9 },
    { id: 3, name: 'Web Development', code: 'CS-303', tasks: 7, assignments: 10, materials: 15 }
  ]);

  return (
    <div className="courses-page-wrapper">
      <div className="container">
        <div className="content-limit">
          
          {/* Header Section */}
          <div className="header-section">
            <div className="header-content">
              <div className="header-text">
                <h1 className="header-title">My Courses</h1>
                <p className="header-description">Manage your courses and learning materials</p>
              </div>
              
              <div 
                className="floating-button-wrapper"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredButton(null);
                }}
              >
                <button className={`add-button ${isHovered ? 'plus-active' : ''}`}>
                  <Plus size={28} />
                </button>

                {isHovered && (
                  <>
                    <button 
                      className={`action-btn btn-left ${hoveredButton === 1 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(1)}
                    >
                      <BookOpen size={18} /> Add Course
                    </button>

                    <button 
                      className={`action-btn btn-bottom ${hoveredButton === 2 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(2)}
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
                )}
              </div>
            </div>
          </div>

          <div className="thin-line"></div>

          {/* Course Rows */}
          <div className="course-list">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-info">
                  <p className="course-code">{course.code}</p>
                  <h3 className="course-title">{course.name}</h3>
                  <p className="course-meta">{course.assignments} assignments total</p>
                </div>

                <div className="icon-group-container">
                  <div className="stat-item">
                    <div className="stat-icon task-bg"><CheckSquare size={18} /></div>
                    <span className="stat-count">{course.tasks}</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon assignment-bg"><FileText size={18} /></div>
                    <span className="stat-count">{course.assignments}</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon material-bg"><BookOpen size={18} /></div>
                    <span className="stat-count">{course.materials}</span>
                  </div>
                  <button className="delete-row-btn" title="Delete Course">
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