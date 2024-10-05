import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import ShoppingBag from '../../assets/ShoppingBag.png'; 

const NGOSidebar = () => {
  return (
    <div className="w-64 bg-[#059d8e] min-h-screen text-white">
      <div className="py-4 px-6">
        <Link to="/" className="text-2xl font-bold">
          <img src={ShoppingBag} alt="Logo" />
        </Link>
      </div>
      <nav className="flex flex-col py-4">
        <Link to="/pages/NGODashboard" className="py-2 px-6 hover:bg-teal-600">
          Dashboard
        </Link>
        <Link to="/ngo/details" className="py-2 px-6 hover:bg-teal-600">
          Cause/NGO Details
        </Link>
        <Link to="/ngo/performance" className="py-2 px-6 hover:bg-teal-600">
          NGO Performance
        </Link>
        <Link to="/help-support" className="py-2 px-6 hover:bg-teal-600">
          Help & Support
        </Link>
        <Link to="/about-us" className="py-2 px-6 hover:bg-teal-600">
          About Us
        </Link>
        <Link to="/faqs" className="py-2 px-6 hover:bg-teal-600">
          FAQ's
        </Link>
        
        <div className="py-2 px-6 mt-auto cursor-pointer flex items-center hover:bg-teal-600">
          <span className="mr-2">Log Out</span>
          <FiLogOut />
        </div>
      </nav>
    </div>
  );
};

export default NGOSidebar;
