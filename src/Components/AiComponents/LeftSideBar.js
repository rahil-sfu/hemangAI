import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import './LeftSidebar.css';

function LeftSidebar() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(
    localStorage.getItem("leftSidebarState") === "true"
  );

  useEffect(() => {
    localStorage.setItem("leftSidebarState", isLeftSidebarOpen);
  }, [isLeftSidebarOpen]);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!isLeftSidebarOpen);
  };

  return (
    <>
      <nav className={`left-side-bar ${isLeftSidebarOpen ? 'open' : 'closed'}`}>
        ... (left sidebar content)
      </nav>
      {!isLeftSidebarOpen && (
        <button className='toggle-btn left-toggle' onClick={toggleLeftSidebar}>
          <FaBars />
        </button>
      )}
    </>
  );
//   return (
//     <div className="left-side-bar-placeholder">
//       {/* Left sidebar is currently disabled. Uncomment the code in LeftSidebar.js to enable it. */}
//       Left sidebar is disabled.
//     </div>
//   );
}

export default LeftSidebar;
