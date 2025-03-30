import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { Outlet, useParams } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

const AdminDashboardOutlet = () => {
  const { userId } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobileView = window.innerWidth < 1024;
      setIsMobile(mobileView);
      setSidebarOpen(!mobileView);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboardOutlet flex h-screen">
      <Sidebar userId={userId} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="main-content bg-gray-50 flex-grow overflow-y-auto min-h-screen">
        {/* Hamburger menu button next to navbar - visible only on mobile */}
        {isMobile && !sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden fixed top-4 left-4 z-50 bg-teal-700 rounded-lg p-2 shadow-lg"
            aria-label="Toggle navigation"
          >
            <FiMenu size={24} className="text-white" />
          </button>
        )}

        <div className={`${isMobile ? (sidebarOpen ? 'pl-[17.5rem]' : 'pl-16') : ''}`}>
          <Navbar userId={userId} />
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOutlet;