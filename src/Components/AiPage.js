import React, { useState, useEffect } from 'react';
import './AiPage.css';
import logo from './settings-gear-1.svg';
import { FaTimes, FaChevronLeft, FaCog, FaPaperPlane } from 'react-icons/fa'; 
import { BsChevronLeft } from "react-icons/bs";


function AiPage() {
  // Load sidebar states from localStorage (default to closed if not set)
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(
    localStorage.getItem("leftSidebarState") === "true"
  );
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(
    localStorage.getItem("rightSidebarState") === "true"
  );

  // Update localStorage when sidebar states change
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
      {/*
      Left sidebar code (if needed) – currently commented out 
      <nav className={`left-side-bar ${isLeftSidebarOpen ? 'open' : 'closed'}`}>
          ...
      </nav>
      {!isLeftSidebarOpen && (
          <button className='toggle-btn left-toggle' onClick={toggleLeftSidebar}>
              <FaBars />
          </button>
      )} 
      */}

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

      {/* Right Sidebar Toggle Button (only visible when the right sidebar is closed) */}
      {!isRightSidebarOpen && (
        <button className='toggle-btn right-toggle' onClick={toggleRightSidebar}>
          <BsChevronLeft />
        </button>
      )}

      {/* Main Content */}
      <main className='main-content'>
        <div className='search-area'>
          <h1>How can I help you today?</h1>
          <div className='search-bar'>
            {/* Settings Button */}
            <button className='settings-btn'>
              <FaCog />
            </button>

            {/* Search Input */}
            <input
              className='search-input'
              type='text'
              placeholder='Ask anything...'
            />
            {/* Send Button with Icon */}
            <button className='send-btn'>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AiPage;
