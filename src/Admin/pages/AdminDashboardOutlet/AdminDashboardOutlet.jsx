import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'

const AdminDashboardOutlet = () => {
  return (
    <div className="dashboardOutlet flex">
    <Sidebar/>
    <div className="main-content w-full overflow-y-auto h-screen">
      <Navbar />
      <Outlet />
    </div>
  </div>
  )
}

export default AdminDashboardOutlet