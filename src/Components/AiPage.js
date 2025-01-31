import React, { useState, useEffect } from 'react';
import './AiPage.css';
import logo from './settings-gear-1.svg';
import { FaBars, FaTimes } from 'react-icons/fa'; // For toggle icons

function AiPage() {
    // Load sidebar states from localStorage (default to closed if not set)
    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(
        localStorage.getItem("leftSidebarState") === "true"
    );
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(
        localStorage.getItem("rightSidebarState") === "true"
    );

    // Effect to update localStorage when state changes
    useEffect(() => {
        localStorage.setItem("leftSidebarState", isLeftSidebarOpen);
    }, [isLeftSidebarOpen]);

    useEffect(() => {
        localStorage.setItem("rightSidebarState", isRightSidebarOpen);
    }, [isRightSidebarOpen]);

    const toggleLeftSidebar = () => {
        setLeftSidebarOpen(!isLeftSidebarOpen);
    };

    const toggleRightSidebar = () => {
        setRightSidebarOpen(!isRightSidebarOpen);
    };

    return (
        <div className='app-container'>
            {/* Left Sidebar */}
            <nav className={`left-side-bar ${isLeftSidebarOpen ? 'open' : 'closed'}`}>
                <div className='sidebar-header'>
                    <div className='logo'>hemangAI</div>
                    <button className='close-btn' onClick={toggleLeftSidebar}>
                        <FaTimes />
                    </button>
                </div>
                <button className='new-chat'>New Chat</button>
                <ul className='nav-links'>
                    <li>Home</li>
                    <li>Search</li>
                    <li>Discover</li>
                </ul>
                <div className='user-info'>
                    <span>user@123</span>
                </div>
            </nav>

            {/* Left Sidebar Toggle Button */}
            {!isLeftSidebarOpen && (
                <button className='toggle-btn left-toggle' onClick={toggleLeftSidebar}>
                    <FaBars />
                </button>
            )}

            {/* Right Sidebar */}
            <nav className={`right-side-bar ${isRightSidebarOpen ? 'open' : 'closed'}`}>
                <div className='sidebar-header'>
                    <h3>Quick Actions</h3>
                    <button className='close-btn' onClick={toggleRightSidebar}>
                        <FaTimes />
                    </button>
                </div>
                <ul className='nav-links'>
                    <li>What is the weather</li>
                    <li>Top 5 Places to live</li>
                    <li>Trump Election</li>
                </ul>
            </nav>

            {/* Right Sidebar Toggle Button */}
            {!isRightSidebarOpen && (
                <button className='toggle-btn right-toggle' onClick={toggleRightSidebar}>
                    <FaBars />
                </button>
            )}

            {/* Main Content */}
            <main className='main-content'>
                {/* <div className='logo'>
                    <img 
                        src={logo} 
                        className="App-logo" 
                        alt="logo" 
                        style={{ cursor: 'pointer' }}
                    />
                </div> */}
                <div className='search-area'>
                    <h1>How can I help you today?</h1>
                    <div className='search-bar'>
                        <input
                            className='search-input'
                            type='text'
                            placeholder='Ask anything...'
                        />
                        <button className='send-btn'>Send</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AiPage;
