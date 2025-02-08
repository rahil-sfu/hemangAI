import React, { useState, useEffect, useRef } from 'react';
import './AiPage.css';
import { FaCog, FaPaperPlane } from 'react-icons/fa';
import IntialSetting from './IntialSetting';
import ChatWindow from './AiComponents/ChatWindow';
import RightSidebar from './AiComponents/RightSidebar';
// Uncomment the following line to enable the left sidebar in the future:
// import LeftSidebar from './LeftSidebar';

function AiPage() {
  // (Right sidebar state and functions have been lifted here)
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(
    localStorage.getItem("rightSidebarState") === "true"
  );
  const [rightSidebarWidth, setRightSidebarWidth] = useState(300);

  const [searchText, setSearchText] = useState("");
  const textAreaRef = useRef(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // State to track if the ChatWindow (chat mode) is shown
  const [showChatWindow, setShowChatWindow] = useState(false);

  // New state: Array of chat blocks (each block represents a ChatWindow)
  const [chatBlocks, setChatBlocks] = useState([]);

  // States for dynamic resizing and dynamic bottom padding in chat mode
  const [defaultChatHeight, setDefaultChatHeight] = useState(null);
  const [chatBottomPadding, setChatBottomPadding] = useState("60px");

  useEffect(() => {
    localStorage.setItem("rightSidebarState", isRightSidebarOpen);
  }, [isRightSidebarOpen]);

  // Update CSS variable for the right sidebar width so that the CSS can use it
  useEffect(() => {
    document.documentElement.style.setProperty('--right-sidebar-width', rightSidebarWidth + 'px');
  }, [rightSidebarWidth]);

  // Dynamically resize the textarea (applies to both modes, but especially used for chat mode)
  useEffect(() => {
    if (textAreaRef.current) {
      // On first run, store the default (one-line) height if not already set
      if (!defaultChatHeight) {
        setDefaultChatHeight(textAreaRef.current.scrollHeight);
      }
      
      // Reset the height so we can remeasure
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.overflowY = "hidden";

      const newHeight = textAreaRef.current.scrollHeight;
      let finalHeight = newHeight;

      // Clamp height at 200px and enable scrolling on the textarea if needed
      if (newHeight > 200) {
        finalHeight = 200;
        textAreaRef.current.style.overflowY = "auto";
      }
      textAreaRef.current.style.height = `${finalHeight}px`;

      // Calculate dynamic bottom padding:
      //   - Minimum padding = 0px when at one line (i.e. defaultChatHeight)
      //   - Maximum padding = 59px when the textarea reaches 200px
      const minPaddingPx = 0;
      const maxPaddingPx = 59;
      let newPaddingPx = minPaddingPx;

      if (defaultChatHeight && finalHeight > defaultChatHeight) {
        newPaddingPx =
          minPaddingPx +
          ((finalHeight - defaultChatHeight) / (200 - defaultChatHeight)) *
            (maxPaddingPx - minPaddingPx);
        if (newPaddingPx > maxPaddingPx) {
          newPaddingPx = maxPaddingPx;
        }
      }
      setChatBottomPadding(`${newPaddingPx}px`);
    }
  }, [searchText, defaultChatHeight]);

  /* 
    Handle sending the message on:
      - Click on send icon.
      - Pressing Enter (without Shift) in the textarea.
  */
  const handleSend = async () => {
    // If the input is empty, do nothing and do not proceed to chat mode
    if (!searchText.trim()) return;

    // If chat mode is not enabled, enable it and add the first chat block
    if (!showChatWindow) {
      setShowChatWindow(true);
      setChatBlocks([{ id: new Date().getTime() }]);
    } else {
      // If chat mode is already enabled, add a new chat block
      setChatBlocks(prevBlocks => [...prevBlocks, { id: new Date().getTime() }]);
    }
    
    // Clear the input immediately after sending the message
    setSearchText("");

    try {
      const endpoint = `http://127.0.0.1:8000/message-sse?user_message=${encodeURIComponent(
        searchText
      )}`;
      const response = await fetch(endpoint, { method: "GET" });
      if (!response.ok) {
        console.error("Network response was not ok:", response.statusText);
      }
      // Optionally process the response here
    } catch (error) {
      console.error("Error while sending message:", error);
    }
  };

  /* 
    Handle key presses within the textarea:
      - Enter without Shift: Send message and add new chat block.
      - Shift+Enter: New line
  */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  // When the send button is pressed:
  const handleSendButtonClick = () => {
    // Only proceed if the input is not empty
    if (searchText.trim()) {
      handleSend();
    }
  };

  return (
    <div 
      className="app-container"
      style={{
        paddingRight: isRightSidebarOpen
          ? Math.max(0, rightSidebarWidth - 250) + 'px'
          : 0,
      }}
    >
      {showChatWindow && (
        <div className="floating-sidebar">
          <RightSidebar 
            isOpen={isRightSidebarOpen}
            rightSidebarWidth={rightSidebarWidth}
            setRightSidebarWidth={setRightSidebarWidth}
            toggleRightSidebar={() => setRightSidebarOpen(!isRightSidebarOpen)}
          />
        </div>
      )}
      
      <main className="main-content">
        {showChatWindow ? (
          <>
            <div className="chat-container">
              {chatBlocks.map((block) => (
                <ChatWindow
                  key={block.id}
                  openLeftSidebar={() => {}} // Placeholder function
                  openRightSidebar={() => { setRightSidebarOpen(true); }}
                />
              ))}
            </div>
            <div 
              className="floating-chat-search-bar"
              style={{
                transform: isRightSidebarOpen
                  ? `translateX(calc(-50% - ${Math.max(0, (rightSidebarWidth - 250) / 2)}px))`
                  : 'translateX(-50%)'               
              }}
            >
              <div className="chat-search-input-wrapper" style={{ paddingBottom: chatBottomPadding }}>
                <textarea
                  rows="1"
                  className="chat-search-input"
                  placeholder="Message..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  ref={textAreaRef}
                />
              </div>
              <div className="chat-icon-container">
                <button
                  className="chat-settings-btn"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <FaCog />
                </button>
                <button className="chat-send-btn" onClick={handleSendButtonClick}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="search-area">
            <h1>How can I help you today?</h1>
            <div className="search-bar">
              <div className="search-input-wrapper">
                <textarea
                  rows="1"
                  className="search-input"
                  placeholder="Message..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  ref={textAreaRef}
                />
              </div>
              <div className="icon-container">
                <button
                  className="settings-btn"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <FaCog />
                </button>
                <button className="send-btn" onClick={handleSendButtonClick}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showSettingsModal && (
        <IntialSetting
          trigger={true}
          setTrigger={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}

export default AiPage;
