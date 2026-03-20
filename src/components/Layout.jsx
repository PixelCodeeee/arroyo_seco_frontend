import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../styles/Sidebar.css';

function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout-with-sidebar">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        isOpen={sidebarOpen}
        onMobileToggle={toggleMobileSidebar}
      />
      
      {/* Mobile overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleMobileSidebar}
      />
      
      {/* Mobile menu button */}
      <button 
        className="mobile-menu-button"
        onClick={toggleMobileSidebar}
      >
        ☰
      </button>

      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {children}
      </main>
    </div>
  );
}

export default Layout;