import React from "react";
import "./Sidebar.scss";
import headerLogo from "../../assets/header-logo.png";
import iconDashboard from "../../assets/icon-dashboard.png";
import iconProducts from "../../assets/icon-products.png";
import iconCustomers from "../../assets/icon-customers.png";
import iconPOS from "../../assets/icon-pos.png";
import iconInvoices from "../../assets/icon-invoice.png";
import iconSales from "../../assets/icon-sales.png";
import iconShop from "../../assets/icon-shop.png";
import iconLogout from "../../assets/icon-logout.png";
import { Link, useParams } from "react-router-dom";

const Sidebar = () => {
  const { id } = useParams();
  return (
    <div className="sidebar">
      <div className="logo">
        <Link to={`/services-dashboard/${id}/dashboard`}>
          <img src={headerLogo} alt="loading" />
        </Link>
      </div>
      <hr />
      <ul>
        <Link to={`/services-dashboard/${id}/dashboard`}>
          <li>
            <img src={iconDashboard} alt="loading" />
            Dashboard
          </li>
        </Link>

        <Link to={`/services-dashboard/${id}/products`}>
          <li>
            {" "}
            <img src={iconProducts} alt="loading" />
            Products/Services
          </li>
        </Link>

        <Link to={`/services-dashboard/${id}/customers`}>
          <li>
            <img src={iconCustomers} alt="loading" />
            Customers
          </li>
        </Link>

        <li>
          {" "}
          <img src={iconPOS} alt="loading" />
          POS
        </li>
        <li>
          {" "}
          <img src={iconInvoices} alt="loading" />
          Invoices
        </li>
        <li>
          {" "}
          <img src={iconSales} alt="loading" />
          Sales record
        </li>
        <li>
          {" "}
          <img src={iconShop} alt="loading" />
          Shop info
        </li>
        <li>
          {" "}
          <img src={iconLogout} alt="loading" />
          Log Out
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
