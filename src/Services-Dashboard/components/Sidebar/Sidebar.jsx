import React from 'react';
import './Sidebar.scss';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">SHOPPINESSMART</div>
      <ul>
        <li>Dashboard</li>
        <li>Products/Services</li>
        <li>Customers</li>
        <li>POS</li>
        <li>Invoices</li>
        <li>Sales record</li>
        <li>Shop info</li>
        <li>Log Out</li>
      </ul>
    </div>
  );
};

export default Sidebar;
