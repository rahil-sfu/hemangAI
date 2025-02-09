// AiPage.js
import React, { useState, useEffect, useRef } from 'react';
import './AiPage.css';
import { FaCog, FaPaperPlane } from 'react-icons/fa';
import IntialSetting from './IntialSetting';
import ChatWindow from './AiComponents/ChatWindow';
import RightSidebar from './AiComponents/RightSidebar';
// import LeftSidebar from './LeftSidebar';

function AiPage() {
  // Right sidebar state
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(
    localStorage.getItem("rightSidebarState") === "true"
  );
  const [rightSidebarWidth, setRightSidebarWidth] = useState(300);
  const [sidebarContent, setSidebarContent] = useState("default"); // new state

  const [searchText, setSearchText] = useState("");
  const textAreaRef = useRef(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Chat mode states
  const [showChatWindow, setShowChatWindow] = useState(false);
  // Each chat block now has userMessage and aiAnswer properties.
  const [chatBlocks, setChatBlocks] = useState([]);

  // New states for tasks
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

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

  // Dynamically resize the textarea
  useEffect(() => {
    if (textAreaRef.current) {
      if (!defaultChatHeight) {
        setDefaultChatHeight(textAreaRef.current.scrollHeight);
      }
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.overflowY = "hidden";

      const newHeight = textAreaRef.current.scrollHeight;
      let finalHeight = newHeight;
      if (newHeight > 200) {
        finalHeight = 200;
        textAreaRef.current.style.overflowY = "auto";
      }
      textAreaRef.current.style.height = `${finalHeight}px`;

      const minPaddingPx = 0;
      const maxPaddingPx = 59;
      let newPaddingPx = minPaddingPx;
      if (defaultChatHeight && finalHeight > defaultChatHeight) {
        newPaddingPx =
          minPaddingPx +
          ((finalHeight - defaultChatHeight) / (200 - defaultChatHeight)) *
            (maxPaddingPx - minPaddingPx);
        if (newPaddingPx > maxPaddingPx) newPaddingPx = maxPaddingPx;
      }
      setChatBottomPadding(`${newPaddingPx}px`);
    }
  }, [searchText, defaultChatHeight]);

  // Function to get the AI response (Gemini API call)
  const getAIResponse = async (prompt) => {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI("AIzaSyCx3MefHEMw2MNfzB2fI2IvpBnWBGLirmg");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error calling the Generative AI API:", error);
      return "Error generating response.";
    }
  };

  // New function to generate tasks based on the prompt
  const generateTasks = async (prompt) => {
    setTasksLoading(true);
    try {
      // Modify the prompt as needed to instruct Gemini to output 9 numbered tasks.
      const tasksPrompt = `Based on the prompt: "${prompt}", generate 9 interesting questions for further exploration. Return them as a numbered list with each item on a new line.`;
      const tasksResponse = await getAIResponse(tasksPrompt);
      // Assume tasksResponse is a numbered list separated by newlines.
      const tasksArray = tasksResponse
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      setTasks(tasksArray);
    } catch (error) {
      console.error("Error generating tasks:", error);
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  // Function to open the right sidebar with desired content.
  const handleOpenRightSidebar = (content) => {
    if (content) {
      setSidebarContent(content);
    } else {
      setSidebarContent("default");
    }
    setRightSidebarOpen(true);
  };

  const handleTaskClick = async (task) => {
    if (!task.trim()) return;
    const blockId = new Date().getTime();
    const startTime = Date.now();
    // Create a new chat block using the task text as the prompt.
    setChatBlocks(prev => [
      ...prev,
      { id: blockId, userMessage: task, aiAnswer: "Loading...", thinkingTime: null }
    ]);
    const aiAnswer = await getAIResponse(task);
    const endTime = Date.now();
    const thinkingTime = ((endTime - startTime) / 1000).toFixed(1);
    setChatBlocks(prev =>
      prev.map(block =>
        block.id === blockId ? { ...block, aiAnswer, thinkingTime } : block
      )
    );
  };
  

  const handleSend = async () => {
    if (!searchText.trim()) return;
    const blockId = new Date().getTime();
    const startTime = Date.now(); // record start time
  
    // Add a new chat block with a loading placeholder and no thinkingTime yet
    if (!showChatWindow) {
      setShowChatWindow(true);
      setChatBlocks([{ id: blockId, userMessage: searchText, aiAnswer: "Loading...", thinkingTime: null }]);
    } else {
      setChatBlocks(prev => [
        ...prev,
        { id: blockId, userMessage: searchText, aiAnswer: "Loading...", thinkingTime: null },
      ]);
    }
    
    const prompt = searchText;
    setSearchText("");
  
    // Start generating tasks concurrently
    generateTasks(prompt);
  
    // Get the AI answer for the chat
    const aiAnswer = await getAIResponse(prompt);
    const endTime = Date.now();
    const thinkingTime = ((endTime - startTime) / 1000).toFixed(1); // seconds with one decimal
  
    // Update the chat block with the AI answer and thinking time
    setChatBlocks(prev =>
      prev.map(block =>
        block.id === blockId ? { ...block, aiAnswer, thinkingTime } : block
      )
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSendButtonClick = () => {
    if (searchText.trim()) handleSend();
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
          sidebarContent={sidebarContent}  // pass sidebar content state
          tasks={tasks}
          tasksLoading={tasksLoading}
          onTaskClick={handleTaskClick}  // pass our new task click handler
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
                  userMessage={block.userMessage}
                  aiAnswer={block.aiAnswer}
                  thinkingTime={block.thinkingTime}
                  openRightSidebar={handleOpenRightSidebar}
                  openLeftSidebar={() => { /* if needed */ }}
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
