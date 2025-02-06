import React, { useState, useEffect, useRef } from 'react';
import './AiPage.css';
import logo from './settings-gear-1.svg';
import { FaTimes, FaChevronLeft, FaCog, FaPaperPlane } from 'react-icons/fa';
import { BsChevronLeft } from "react-icons/bs";
import IntialSetting from './IntialSetting';

function AiPage() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(
    localStorage.getItem("leftSidebarState") === "true"
  );
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(
    localStorage.getItem("rightSidebarState") === "true"
  );
  const [rightSidebarWidth, setRightSidebarWidth] = useState(300);
  const minWidth = 200;
  const maxWidth = 450;
  const [searchText, setSearchText] = useState("");
  const textAreaRef = useRef(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("leftSidebarState", isLeftSidebarOpen);
  }, [isLeftSidebarOpen]);

  useEffect(() => {
    localStorage.setItem("rightSidebarState", isRightSidebarOpen);
  }, [isRightSidebarOpen]);

  // Dynamically resize the text area
  useEffect(() => {
    if (textAreaRef.current) {
      // Reset height to auto so we can recalc proper scrollHeight
      textAreaRef.current.style.height = "auto";
      // Force no scrolling until we decide we need it
      textAreaRef.current.style.overflowY = "hidden";

      // Now calculate the new height
      const newHeight = textAreaRef.current.scrollHeight;

      // If it exceeds 200px, clamp to 200px and show scrollbar
      if (newHeight > 200) {
        textAreaRef.current.style.height = "200px";
        textAreaRef.current.style.overflowY = "auto";
      } else {
        textAreaRef.current.style.height = `${newHeight}px`;
      }
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

  /* 
  Handle sending the message. This function will be called on:
    1) Click on send icon.
    2) Pressing Enter (without Shift) in the text area. 
  */
  const handleSend = async () => {
    if (!searchText.trim()) return;
    try {
      // Construct the GET request with query param
      const endpoint = `http://127.0.0.1:8000/message-sse?user_message=${encodeURIComponent(searchText)}`;
      
      // Send GET request
      const response = await fetch(endpoint, {
        method: 'GET',
      });
      if (!response.ok) {
        console.error("Network response was not ok:", response.statusText);
      }
      // Handle the response here
      // const data = await response.text();
      // console.log("Response from server:", data);

      // Clear the input after sending
      setSearchText("");

    } catch (error) {
      console.error("Error while sending message:", error);
    }
  };

  /* 
  Handle key presses within the text area:- 
  1. Enter without Shift => Send message 
  2. Shift+Enter => New line 
  */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Check if SHIFT is pressed
      if (!e.shiftKey) {
        // Prevent default newline
        e.preventDefault();
        handleSend();
      }
      // if SHIFT is pressed, allow the default => new line
    }
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

      <main 
        className='main-content'
        style={{
          marginRight: isRightSidebarOpen ? rightSidebarWidth : 0
        }}
      >
        <div className='search-area'>
          <h1>How can I help you today?</h1>
          <div className='search-bar'>
            <div className="search-input-wrapper">
              <textarea
                rows="1"
                className='search-input'
                placeholder='Ask anything...'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={textAreaRef}
              />
            </div>
            <div className="icon-container">
              <button className='settings-btn' onClick={() => setShowSettingsModal(true)}>
                <FaCog />
              </button>
              <button 
                className='send-btn'
                onClick={handleSend}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {showSettingsModal && (
        <IntialSetting 
          trigger={true} 
          setTrigger={() => setShowSettingsModal(false)} 
          fromAiPage={true}
        />
      )}
    </div>
  );
}

export default AiPage;
