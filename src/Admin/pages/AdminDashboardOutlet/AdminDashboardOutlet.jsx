import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { Outlet, useParams } from 'react-router-dom'

const AdminDashboardOutlet = () => {
  const { userId } = useParams();
  return (
    <div className="dashboardOutlet flex">
    <Sidebar userId={userId}/>
    <div className="main-content bg-gray-50 w-full overflow-y-auto h-screen">
      <Navbar userId={userId} />
      <Outlet />
    </div>
  </div>
  )
}

export default AdminDashboardOutlet