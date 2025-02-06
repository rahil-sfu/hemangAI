import React, { useState, useEffect, useRef } from 'react';
import './AiPage.css';
import logo from './settings-gear-1.svg';
import { FaTimes, FaChevronLeft, FaCog, FaPaperPlane } from 'react-icons/fa';
import { BsChevronLeft } from "react-icons/bs";

import IntialSetting from './IntialSetting'; // Import the settings modal component
import ChatWindow from './AiComponents/ChatWindow'; // Import the ChatWindow component

function AiPage() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(
    localStorage.getItem("leftSidebarState") === "true"
  );
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(
    localStorage.getItem("rightSidebarState") === "true"
  );
  const [rightSidebarWidth, setRightSidebarWidth] = useState(240);
  const minWidth = 200;
  const maxWidth = 400;
  const [searchText, setSearchText] = useState("");
  const textAreaRef = useRef(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // State to track if the ChatWindow is shown
  const [showChatWindow, setShowChatWindow] = useState(false);

  useEffect(() => {
    localStorage.setItem("leftSidebarState", isLeftSidebarOpen);
  }, [isLeftSidebarOpen]);

  useEffect(() => {
    localStorage.setItem("rightSidebarState", isRightSidebarOpen);
  }, [isRightSidebarOpen]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      const newHeight = Math.min(textAreaRef.current.scrollHeight, 200);
      textAreaRef.current.style.height = newHeight + "px";
    }
  }, [searchText]);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!isRightSidebarOpen);
  };

  const startResize = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", resizeSidebar);
    document.addEventListener("mouseup", stopResize);
  };

  const resizeSidebar = (e) => {
    let newWidth = window.innerWidth - e.clientX;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;
    setRightSidebarWidth(newWidth);
  };

  const stopResize = () => {
    document.removeEventListener("mousemove", resizeSidebar);
    document.removeEventListener("mouseup", stopResize);
  };

  // When the send button is pressed:
  const handleSendButtonClick = () => {
    // Optionally process searchText here if needed
    setShowChatWindow(true);
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
      
      <nav
        className={`right-side-bar ${isRightSidebarOpen ? 'open' : 'closed'}`}
        style={{ width: isRightSidebarOpen ? rightSidebarWidth : undefined }}
      >
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
        <div className="resizer" onMouseDown={startResize}></div>
      </nav>

      {!isRightSidebarOpen && (
        <button className='toggle-btn right-toggle' onClick={toggleRightSidebar}>
          <BsChevronLeft />
        </button>
      )}

      <main className='main-content'>
        {showChatWindow ? (
          // Chat mode: ChatWindow on top and the search bar fixed at the bottom
          <>
            <div className="chat-container" style={{ flexGrow: 1 }}>
              <ChatWindow openRightSidebar={() => setRightSidebarOpen(true)} />
            </div>
            <div className="search-bar search-bar-fixed">
              <div className="search-input-wrapper">
                <textarea
                  className='search-input'
                  placeholder='Ask follow-up'
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  ref={textAreaRef}
                />  
              </div>
              <div className="icon-container">
                <button className='settings-btn' onClick={() => setShowSettingsModal(true)}>
                  <FaCog />
                </button>
                <button 
                  className='send-btn'
                  onClick={handleSendButtonClick}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Initial mode: Show header and centered search bar
          <div className='search-area'>
            <h1>How can I help you today?</h1>
            <div className='search-bar'>
              <div className="search-input-wrapper">
                <textarea
                  className='search-input'
                  placeholder='Ask anything...'
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  ref={textAreaRef}
                />
              </div>
              <div className="icon-container">
                <button className='settings-btn' onClick={() => setShowSettingsModal(true)}>
                  <FaCog />
                </button>
                <button 
                  className='send-btn'
                  onClick={handleSendButtonClick}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {showSettingsModal && (
        <IntialSetting trigger={true} setTrigger={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}

export default AiPage;
