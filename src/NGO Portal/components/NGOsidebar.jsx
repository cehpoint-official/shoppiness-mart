// NGOSidebar.jsx
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi'; // Import log out icon
import ShoppingBag from '../../assets/ShoppingBag.png'; 

const NGOsidebar = () => (
  <div className="w-64 bg-[#059d8e] min-h-screen text-white">
    <div className="py-4 px-6 flex items-center">
      <img src={ShoppingBag} alt="Shoppiness Mart" className="w-12 h-12 mr-2" />
      <span className="text-2xl font-bold">Shoppiness Mart</span>
    </div>
    <nav className="flex flex-col py-4">
      <Link to="/dashboard" className="py-2 px-6 hover:bg-teal-600">
        Dashboard
      </Link>
      <Link to="/ngo/details" className="py-2 px-6 hover:bg-teal-600">
        Cause/NGO Details
      </Link>
      <Link to="/ngo/performance" className="py-2 px-6 hover:bg-teal-600">
        Cause/NGO Performance
      </Link>
      <Link to="/help-support" className="py-2 px-6 hover:bg-teal-600">
        Help & Support
      </Link>
      <Link to="/about-us" className="py-2 px-6 hover:bg-teal-600">
        About Us
      </Link>
      <Link to="/faqs" className="py-2 px-6 hover:bg-teal-600">
        FAQ'S
      </Link>
      <Link to="/privacy-policy" className="py-2 px-6 hover:bg-teal-600">
        Privacy Policy
      </Link>
      <div className="py-2 px-6 mt-auto cursor-pointer flex items-center hover:bg-teal-600">
        <span className="mr-2">Log Out</span>
        <FiLogOut />
      </div>
    </nav>
  </div>
);

export default NGOsidebar;
