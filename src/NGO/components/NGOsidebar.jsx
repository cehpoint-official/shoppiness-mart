import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiLogOut } from 'react-icons/fi'; // Import icons
import ShoppingBag from '../../assets/ShoppingBag.png'; 

const NGOSidebar = () => {
  const [isNgoOpen, setIsNgoOpen] = useState(true); // Default to open for demonstration
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="w-64 bg-[#059d8e] min-h-screen text-white">
      <div className="py-4 px-6">
        <Link to="/" className="text-2xl font-bold">
          <img src={ShoppingBag} alt="" />
        </Link>
      </div>
      <nav className="flex flex-col py-4">
        <Link to="/pages/NGODashboard" className="py-2 px-6 hover:bg-teal-600">
          Dashboard
        </Link>
        
        <div>
          <div
            onClick={() => setIsNgoOpen(!isNgoOpen)}
            className="flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600"
          >
            <span>NGO/CAUSES</span>
            {isNgoOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isNgoOpen && (
            <div className="flex flex-col pl-6">
              <Link to="/ngo/details" className="py-2 px-6 hover:bg-teal-600">
                Cause/NGO Details
              </Link>
              <Link to="/ngo/performance" className="py-2 px-6 hover:bg-teal-600">
                Cause/NGO Performance
              </Link>
            </div>
          )}
        </div>
        
        <div>
          <div
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600"
          >
            <span>Help & Support</span>
            {isHelpOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isHelpOpen && (
            <div className="flex flex-col pl-6">
              <Link to="/help-support" className="py-2 px-6 hover:bg-teal-600">
                Help & Support
              </Link>
            </div>
          )}
        </div>
        
        <div>
          <div
            onClick={() => setIsAboutOpen(!isAboutOpen)}
            className="flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600"
          >
            <span>About</span>
            {isAboutOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isAboutOpen && (
            <div className="flex flex-col pl-6">
              <Link to="/about-us" className="py-2 px-6 hover:bg-teal-600">
                About Us
              </Link>
              <Link to="/faqs" className="py-2 px-6 hover:bg-teal-600">
                FAQ's
              </Link>
              <Link to="/privacy-policy" className="py-2 px-6 hover:bg-teal-600">
                Privacy Policy
              </Link>
            </div>
          )}
        </div>
        
        <div className="py-2 px-6 mt-auto cursor-pointer flex items-center hover:bg-teal-600">
          <span className="mr-2">Log Out</span>
          <FiLogOut />
        </div>
      </nav>
    </div>
  );
};

export default NGOSidebar;
