import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { BsChevronLeft } from 'react-icons/bs';
import './RightSidebar.css';

function RightSidebar({ isOpen, rightSidebarWidth, setRightSidebarWidth, toggleRightSidebar }) {
  const minWidth = 200;
  const maxWidth = 450;

  // Called when the user starts resizing the sidebar.
  const startResize = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", resizeSidebar);
    document.addEventListener("mouseup", stopResize);
  };

  // Calculates the new width based on the mouse position.
  const resizeSidebar = (e) => {
    let newWidth = window.innerWidth - e.clientX;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;
    setRightSidebarWidth(newWidth);
  };

  // Removes the mousemove and mouseup event listeners.
  const stopResize = () => {
    document.removeEventListener("mousemove", resizeSidebar);
    document.removeEventListener("mouseup", stopResize);
  };

  return (
    <>
      <nav
        className={`right-side-bar ${isOpen ? "open" : "closed"}`}
        style={{ width: isOpen ? rightSidebarWidth : undefined }}
      >
        <div className="sidebar-header">
          <h3>Quick Actions</h3>
          <button className="close-btn" onClick={toggleRightSidebar}>
            <FaTimes />
          </button>
        </div>
        <ul className="nav-links">
          <li>What is the weather</li>
          <li>Top 5 Places to live</li>
          <li>Trump Election</li>
        </ul>
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
