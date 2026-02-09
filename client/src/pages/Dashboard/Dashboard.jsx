import React, { useState, useEffect } from 'react';
import {
    Home, BookOpen, CheckSquare, TrendingUp, Award, Settings, User,
    Plus, Calendar, Clock, Moon, Sun
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    // State management
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [painScore, setPainScore] = useState(45);
    const [tasks, setTasks] = useState([
        { id: 1, name: 'Database Lab Report', deadline: '2026-02-10', difficulty: 8, weight: 15, course: 'CSE 4541', courseColor: '#3b82f6', completed: false },
        { id: 2, name: 'Web Programming Midterm Prep', deadline: '2026-02-12', difficulty: 7, weight: 20, course: 'CSE 4540', courseColor: '#8b5cf6', completed: false },
        { id: 3, name: 'Algorithm Assignment 3', deadline: '2026-02-09', difficulty: 9, weight: 10, course: 'CSE 3501', courseColor: '#06b6d4', completed: false },
        { id: 4, name: 'Software Engineering UML Diagrams', deadline: '2026-02-14', difficulty: 5, weight: 8, course: 'CSE 4503', courseColor: '#10b981', completed: false },
        { id: 5, name: 'Computer Networks Quiz Study', deadline: '2026-02-11', difficulty: 6, weight: 5, course: 'CSE 4561', courseColor: '#f59e0b', completed: false },
        { id: 6, name: 'Machine Learning Lab 4', deadline: '2026-02-15', difficulty: 8, weight: 12, course: 'CSE 4643', courseColor: '#ec4899', completed: false },
        { id: 7, name: 'Read Chapter 8 - OS Concepts', deadline: '2026-02-13', difficulty: 4, weight: 3, course: 'CSE 4521', courseColor: '#6366f1', completed: false },
        { id: 8, name: 'Project Proposal Presentation', deadline: '2026-02-18', difficulty: 7, weight: 15, course: 'CSE 4540', courseColor: '#8b5cf6', completed: false },
        { id: 9, name: 'Compiler Design Assignment', deadline: '2026-02-16', difficulty: 9, weight: 12, course: 'CSE 4641', courseColor: '#14b8a6', completed: false },
        { id: 10, name: 'Weekly Problem Set', deadline: '2026-02-10', difficulty: 5, weight: 5, course: 'CSE 3501', courseColor: '#06b6d4', completed: false },
    ]);

    // Dock items
    const dockItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: BookOpen, label: 'Courses', path: '/courses' },
        { icon: CheckSquare, label: 'All Tasks', path: '/tasks' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: Award, label: 'Achievements', path: '/achievements' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    // Toggle task completion
    const toggleTask = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    // Theme classes
    const theme = {
        bg: isDarkMode ? 'bg-[#191919]' : 'bg-white',
        secondaryBg: isDarkMode ? 'bg-[#252525]' : 'bg-gray-50',
        text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
        textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        textMuted: isDarkMode ? 'text-gray-500' : 'text-gray-500',
        border: isDarkMode ? 'border-gray-800' : 'border-gray-200',
        hover: isDarkMode ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100',
        divider: isDarkMode ? 'border-gray-800' : 'border-gray-100',
        navBg: isDarkMode ? 'bg-[#191919]/95' : 'bg-white/95',
        cardHover: isDarkMode ? 'hover:bg-[#212121]' : 'hover:bg-gray-50/80',
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

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme.bg}`}>
            {/* Minimal Navbar */}
            <nav className={`sticky top-0 z-40 ${theme.navBg} backdrop-blur-xl border-b ${theme.border}`}>
                <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className={`text-lg font-semibold ${theme.text}`}>
                            RPS Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-lg ${theme.hover} transition-colors ${theme.textSecondary}`}
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* User */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${theme.hover} transition-colors cursor-pointer`}>
                            <div className={`w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs font-semibold`}>
                                SM
                            </div>
                            <span className={`text-sm font-medium ${theme.text}`}>Sadman</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-8 py-8 pb-32">
                {/* Hero Status - Notion Style (No Card) */}
                <div className="mb-12">
                    <div className="flex items-baseline gap-3 mb-4">
                        <h2 className={`text-4xl font-bold ${theme.text}`}>
                            {painScore}
                        </h2>
                        <span className={`text-sm font-medium ${theme.textMuted} uppercase tracking-wide`}>
                            Pain Score
                        </span>
                    </div>

                    <div className={`h-2 ${theme.secondaryBg} rounded-full overflow-hidden mb-4`}>
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                            style={{ width: `${painScore}%` }}
                        ></div>
                    </div>

                    <p className={`${theme.textSecondary} text-sm`}>
                        {tasks.filter(t => !t.completed).length} active tasks across your courses
                    </p>
                </div>

                {/* Quick Actions - Minimal Style */}
                <div className="flex gap-2 mb-10">
                    <button className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${theme.text} ${theme.hover} rounded-lg transition-colors`}>
                        <Plus size={16} />
                        New Task
                    </button>
                    <button className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${theme.textSecondary} ${theme.hover} rounded-lg transition-colors`}>
                        <BookOpen size={16} />
                        Add Course
                    </button>
                    <button className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${theme.textSecondary} ${theme.hover} rounded-lg transition-colors`}>
                        <Calendar size={16} />
                        Calendar
                    </button>
                </div>

                {/* Timeline Section - Notion Style */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock size={18} className={theme.textMuted} />
                        <h3 className={`text-sm font-semibold ${theme.text} uppercase tracking-wide`}>
                            Timeline
                        </h3>
                        <span className={`text-xs ${theme.textMuted}`}>• Next 3 weeks</span>
                    </div>

                    <div className={`py-6 border-t border-b ${theme.divider}`}>
                        <div className="overflow-x-auto scrollbar-hide">
                            <div className="relative" style={{ minWidth: `${timeline.length * 80}px`, height: '180px' }}>
                                {/* Timeline Base Line */}
                                <div className={`absolute top-8 left-0 right-0 h-px ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

                                {/* Date Markers */}
                                <div className="absolute top-0 left-0 right-0 flex">
                                    {timeline.map((day, index) => (
                                        <div
                                            key={index}
                                            className="relative"
                                            style={{ width: '80px' }}
                                        >
                                            {/* Today indicator */}
                                            {day.isToday && (
                                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-px h-full bg-blue-500/20"></div>
                                            )}

                                            {/* Date marker */}
                                            <div className="absolute top-7 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                                <div className={`w-2 h-2 rounded-full ${day.isToday
                                                    ? 'bg-blue-500 ring-2 ring-blue-500/20'
                                                    : isDarkMode
                                                        ? 'bg-gray-700'
                                                        : 'bg-gray-300'
                                                    }`}></div>

                                                {/* Date label */}
                                                <div className={`mt-3 text-center ${day.isToday ? 'scale-105' : ''}`}>
                                                    <div className={`text-xs font-medium ${day.isToday ? 'text-blue-500' : theme.textMuted
                                                        }`}>
                                                        {day.dayName}
                                                    </div>
                                                    <div className={`text-sm font-semibold ${day.isToday ? theme.text : theme.textSecondary
                                                        }`}>
                                                        {day.dayNum}
                                                    </div>
                                                    {(index === 0 || day.dayNum === 1) && (
                                                        <div className={`text-xs ${theme.textMuted} mt-0.5`}>{day.monthName}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Task Dots */}
                                <div className="absolute top-20 left-0 right-0">
                                    {timelineTasks.map((task, idx) => {
                                        const leftPosition = task.position * 80 + 30;
                                        const sameDateTasks = timelineTasks.filter(t => t.position === task.position);
                                        const taskIndex = sameDateTasks.findIndex(t => t.id === task.id);
                                        const verticalOffset = taskIndex * 8;

                                        return (
                                            <div
                                                key={task.id}
                                                className="absolute group cursor-pointer"
                                                style={{
                                                    left: `${leftPosition}px`,
                                                    top: `${verticalOffset}px`,
                                                    zIndex: 10
                                                }}
                                            >
                                                {/* Connection line */}
                                                <div
                                                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                                                        } opacity-40 group-hover:opacity-70 transition-opacity`}
                                                ></div>

                                                {/* Dot */}
                                                <div
                                                    className="relative w-3 h-3 rounded-full shadow-sm transform transition-all duration-200 group-hover:scale-150"
                                                    style={{
                                                        backgroundColor: task.courseColor,
                                                        boxShadow: `0 0 0 2px ${isDarkMode ? '#191919' : '#ffffff'}`
                                                    }}
                                                >
                                                    <div
                                                        className="absolute inset-0 rounded-full animate-ping opacity-20"
                                                        style={{ backgroundColor: task.courseColor }}
                                                    ></div>
                                                </div>

                                                {/* Hover Card - Notion Style */}
                                                <div
                                                    className="absolute left-1/2 transform -translate-x-1/2 bottom-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:bottom-10 transition-all duration-300 pointer-events-none z-50"
                                                    style={{ width: '280px' }}
                                                >
                                                    <div
                                                        className={`${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'} rounded-lg p-4 shadow-2xl border ${theme.border} relative`}
                                                    >
                                                        {/* Arrow */}
                                                        <div
                                                            className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent`}
                                                            style={{ borderTopColor: isDarkMode ? '#2a2a2a' : '#ffffff' }}
                                                        ></div>

                                                        <div className="flex items-start gap-3">
                                                            <div
                                                                className="w-1 h-12 rounded-full flex-shrink-0"
                                                                style={{ backgroundColor: task.courseColor }}
                                                            ></div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className={`text-xs font-semibold ${theme.textMuted} mb-1 uppercase tracking-wide`}>
                                                                    {task.course}
                                                                </div>
                                                                <div className={`text-sm font-semibold ${theme.text} mb-3`}>
                                                                    {task.name}
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className={theme.textMuted}>Diff:</span>
                                                                        <span className={`font-semibold ${theme.textSecondary}`}>{task.difficulty}/10</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className={theme.textMuted}>Weight:</span>
                                                                        <span className={`font-semibold ${theme.textSecondary}`}>{task.weight}%</span>
                                                                    </div>
                                                                </div>
                                                                <div className={`text-xs ${theme.textMuted} mt-2`}>
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
                    <div className="flex items-center gap-2 mb-6">
                        <CheckSquare size={18} className={theme.textMuted} />
                        <h3 className={`text-sm font-semibold ${theme.text} uppercase tracking-wide`}>
                            Tasks
                        </h3>
                        <span className={`text-xs ${theme.textMuted}`}>• Sorted by priority</span>
                    </div>

                    <div className="space-y-px">
                        {tasks.slice(0, 10).map((task, index) => (
                            <div
                                key={task.id}
                                className={`group flex items-center gap-4 px-3 py-3 -mx-3 rounded-lg transition-colors ${theme.cardHover} ${task.completed ? 'opacity-50' : ''
                                    }`}
                            >
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task.id)}
                                    className="w-4 h-4 rounded border-2 border-gray-300 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                />

                                {/* Course Color */}
                                <div
                                    className="w-1 h-8 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: task.courseColor }}
                                ></div>

                                {/* Task Info */}
                                <div className="flex-1 min-w-0">
                                    <div className={`font-medium ${theme.text} mb-0.5 ${task.completed ? 'line-through' : ''}`}>
                                        {task.name}
                                    </div>
                                    <div className={`text-xs ${theme.textSecondary} flex items-center gap-2`}>
                                        <span>{task.course}</span>
                                        <span className={theme.textMuted}>•</span>
                                        <span>{task.deadline}</span>
                                    </div>
                                </div>

                                {/* Stats - Minimal */}
                                <div className="flex items-center gap-4 text-xs">
                                    <div className={`flex items-center gap-1.5 ${theme.textSecondary}`}>
                                        <span className={theme.textMuted}>Diff</span>
                                        <span className="font-semibold">{task.difficulty}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${theme.textSecondary}`}>
                                        <span className={theme.textMuted}>Wt</span>
                                        <span className="font-semibold">{task.weight}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Minimal Dock */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className={`${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'} rounded-xl shadow-2xl px-2 py-2 border ${theme.border}`}>
                    <div className="flex items-center gap-1">
                        {dockItems.map((item, index) => (
                            <DockItem key={index} {...item} isDarkMode={isDarkMode} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Dock Item
const DockItem = ({ icon: Icon, label, isDarkMode }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="relative">
            <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`p-2.5 rounded-lg ${isDarkMode ? 'hover:bg-[#353535]' : 'hover:bg-gray-100'
                    } transition-all transform hover:scale-110 duration-200`}
            >
                <Icon size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>

            {isHovered && (
                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 ${isDarkMode ? 'bg-[#353535]' : 'bg-gray-800'
                    } text-white text-xs font-medium rounded-md whitespace-nowrap animate-fadeIn`}>
                    {label}
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${isDarkMode ? 'border-t-[#353535]' : 'border-t-gray-800'
                        }`}></div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;