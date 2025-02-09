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

  // New states for tasks and sources
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const [sourcesLoading, setSourcesLoading] = useState(false);

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

  // Function to get the AI response using Gemini API
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

  // New function to generate tasks
  const generateTasks = async (prompt) => {
    setTasksLoading(true);
    try {
      const tasksPrompt = `Based on the prompt: "${prompt}", generate 9 interesting questions for further exploration. Return them as a numbered list, one per line.`;
      const tasksResponse = await getAIResponse(tasksPrompt);
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

  const generateSources = async (prompt) => {
    setSourcesLoading(true);
    try {
      const sourcesPrompt = `Based on the prompt: "${prompt}", generate 3 reliable sources in JSON format. The JSON should be an array of objects with keys "title", "description", and "link".`;
      // const sourcesResponse = await getAIResponse(sourcesPrompt);

      const sourcesResponse = `[
        {
          "title": "National Geographic – Nature",
          "description": "National Geographic offers a wealth of articles and essays that explore the beauty...",
          "link": "https://www.nationalgeographic.com/environment"
        },
        {
          "title": "The Nature Conservancy – Conservation Insights",
          "description": "The Nature Conservancy delivers reliable research and commentary on nature conservation...",
          "link": "https://www.nature.org/en-us/what-we-do/our-insights/"
        },
        {
          "title": "World Wildlife Fund (WWF) – Ecosystem and Wildlife",
          "description": "WWF provides comprehensive resources on ecosystem health and wildlife conservation, featuring...",
          "link": "https://www.worldwildlife.org/places"
        },
        {
          "title": "National Geographic – Nature",
          "description": "National Geographic offers a wealth of articles and essays that explore the beauty...",
          "link": "https://www.nationalgeographic.com/environment"
        },
        {
          "title": "The Nature Conservancy – Conservation Insights",
          "description": "The Nature Conservancy delivers reliable research and commentary on nature conservation...",
          "link": "https://www.nature.org/en-us/what-we-do/our-insights/"
        },
        {
          "title": "World Wildlife Fund (WWF) – Ecosystem and Wildlife",
          "description": "WWF provides comprehensive resources on ecosystem health and wildlife conservation, featuring...",
          "link": "https://www.worldwildlife.org/places"
        },
        {
          "title": "National Geographic – Nature",
          "description": "National Geographic offers a wealth of articles and essays that explore the beauty...",
          "link": "https://www.nationalgeographic.com/environment"
        },
        {
          "title": "The Nature Conservancy – Conservation Insights",
          "description": "The Nature Conservancy delivers reliable research and commentary on nature conservation...",
          "link": "https://www.nature.org/en-us/what-we-do/our-insights/"
        },
        {
          "title": "World Wildlife Fund (WWF) – Ecosystem and Wildlife",
          "description": "WWF provides comprehensive resources on ecosystem health and wildlife conservation, featuring...",
          "link": "https://www.worldwildlife.org/places"
        }
      ]`;
  
      let parsedSources = [];
      try {
        parsedSources = JSON.parse(sourcesResponse);
        // Ensure we have an array. If not, throw an error to trigger fallback.
        if (!Array.isArray(parsedSources)) {
          throw new Error("Parsed JSON is not an array");
        }
        // Optionally, validate or normalize each object in the array:
        parsedSources = parsedSources.map((source) => ({
          title: source.title || "Untitled",
          description: source.description || "",
          link: source.link || "#",
        }));
      } catch (e) {
        console.error("Error parsing JSON, falling back to line parsing:", e);
        // Fallback: assume each non-empty line is in "Title - Description - Link" format.
        parsedSources = sourcesResponse.split("\n")
          .filter((line) => line.trim() !== "")
          .map((line) => {
            const parts = line.split(" - ");
            return {
              title: parts[0] ? parts[0].trim() : "Untitled",
              description: parts[1] ? parts[1].trim() : "",
              link: parts[2] ? parts[2].trim() : "#",
            };
          });
      }
      setSources(parsedSources);
    } catch (error) {
      console.error("Error generating sources:", error);
      setSources([]);
    } finally {
      setSourcesLoading(false);
    }
  };
  

  // New function that opens the right sidebar with the desired content.
  const handleOpenRightSidebar = (content) => {
    if (content) {
      setSidebarContent(content);
    } else {
      setSidebarContent("default");
    }
    setRightSidebarOpen(true);
  };

  // New function for handling a task click (sends the task as prompt to generate an answer)
  const handleTaskClick = async (task) => {
    if (!task.trim()) return;
    const blockId = new Date().getTime();
    const startTime = Date.now();
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

  // (Optional: You can also add a similar handler for sources if you want clicking a source to send its title as a prompt.)
  const handleSourceClick = (source) => {
    if (!source || !source.link) return;
    window.open(source.link, '_blank');
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
  
    // Start generating tasks and sources concurrently
    generateTasks(prompt);
    generateSources(prompt);
  
    // Get the AI answer for the chat
    const aiAnswer = await getAIResponse(prompt);
    const endTime = Date.now();
    const thinkingTime = ((endTime - startTime) / 1000).toFixed(1);
  
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
            sources={sources}               // new prop for sources
            sourcesLoading={sourcesLoading} // new prop for sources loading state
            onTaskClick={handleTaskClick}   // handler for task clicks
            onSourceClick={handleSourceClick} // handler for source clicks (if needed)
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
