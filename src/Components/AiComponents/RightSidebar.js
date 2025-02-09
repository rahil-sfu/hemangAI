import React from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { BsChevronLeft } from 'react-icons/bs';
import CircularProgress from '@mui/material/CircularProgress';
import './RightSidebar.css';
// Import the separate Sources component
import Sources from './Sources';

function RightSidebar({
  isOpen,
  rightSidebarWidth,
  setRightSidebarWidth,
  toggleRightSidebar,
  sidebarContent,
  tasks = [],
  tasksLoading,
  sources = [],
  sourcesLoading,
  onTaskClick,
  onSourceClick, // optional: if not provided, a default will be used
}) {
  const minWidth = 200;
  const maxWidth = 450;

  // Called when the user starts resizing the sidebar.
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

  // Default handler for source clicks: open the link in a new tab.
  const handleSourceClick = (source) => {
    if (source && source.link) {
      window.open(source.link, '_blank');
    }
  };

  return (
    <>
      <nav
        className={`right-side-bar ${isOpen ? "open" : "closed"}`}
        style={{ width: isOpen ? rightSidebarWidth : undefined }}
      >
        <div className="sidebar-header">
          <h3>{sidebarContent === "sources" ? "Sources" : "Tasks"}</h3>
          <button className="close-btn" onClick={toggleRightSidebar}>
            <FaTimes />
          </button>
        </div>
        <div className="sidebar-content">
          {sidebarContent === "sources" ? (
            sourcesLoading ? (
              <div className="tasks-loading">
                <CircularProgress size={20} sx={{ color: '#ccc' }} />
                <span className="loading-tasks-text">Generating sources...</span>
              </div>
            ) : (
              <Sources sources={sources} handleSourceClick={onSourceClick || handleSourceClick} />
            )
          ) : (
            tasksLoading ? (
              <div className="tasks-loading">
                <CircularProgress size={20} sx={{ color: '#ccc' }} />
                <span className="loading-tasks-text">Generating tasks...</span>
              </div>
            ) : (
              <ul className="nav-links">
                {tasks.map((task, index) => (
                  <li
                    key={index}
                    className="task-item"
                    onClick={() => onTaskClick(task)}
                  >
                    {task} <span className="task-complete"><FaCheck /></span>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
        <div className="resizer" onMouseDown={startResize}></div>
      </nav>
      {!isOpen && (
        <button className="toggle-btn right-toggle" onClick={toggleRightSidebar}>
          <BsChevronLeft />
        </button>
      )}
    </>
  );
}

export default RightSidebar;
