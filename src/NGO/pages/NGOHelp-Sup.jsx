import { Link } from 'react-router-dom';
import NGOSidebar from '../components/NGOSidebar'; // Adjust the path if necessary
import NGONavbar from '../components/NGONavbar'; // Adjust the path if necessary
import ShoppingBag from '../../assets/googleicon.png';
import ProfilePic from '../../assets/googleicon.png'; // Replace with actual path
import NotificationIcon from '../../assets/googleicon.png'; // Replace with actual path
import MessageUsIcon from '../../assets/googleicon.png'; // Replace with actual path
import EmailUsIcon from '../../assets/googleicon.png'; // Replace with actual path
import CallUsIcon from '../../assets/googleicon.png'; // Replace with actual path
import HowItWorksIcon from '../../assets/googleicon.png'; // Replace with actual path

const NGOHelp = () => (
  <div className="flex">
    <NGOSidebar />

    <div className="flex-1 flex flex-col">
      <NGONavbar /> {/* Include the navbar component */}

      <div className="p-6 bg-gray-100">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Welcome Jit</span>
          <div className="flex items-center space-x-4">
            <img src={ProfilePic} alt="Profile" className="w-10 h-10 rounded-full border border-gray-300" />
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search here" 
                className="p-2 pl-10 border rounded-lg bg-white text-gray-700 focus:outline-none focus:border-teal-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 4a7 7 0 0114 14 7 7 0 01-14-14zM10 11l2 2 2-2"
                />
              </svg>
            </div>
            <img src={NotificationIcon} alt="Notifications" className="w-6 h-6" />
          </div>
        </div>

        {/* Main Content Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Help and Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Message Us Box */}
            <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
              <img src={MessageUsIcon} alt="Message Us" className="w-8 h-8 mr-4" />
              <span className="text-lg font-medium">Message Us</span>
            </div>

            {/* Email Us Box */}
            <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
              <img src={EmailUsIcon} alt="Email Us" className="w-8 h-8 mr-4" />
              <span className="text-lg font-medium">Email Us</span>
            </div>

            {/* Call Us Box */}
            <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
              <img src={CallUsIcon} alt="Call Us" className="w-8 h-8 mr-4" />
              <span className="text-lg font-medium">Call Us</span>
            </div>

            {/* How It Works Box */}
            <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
              <img src={HowItWorksIcon} alt="How It Works" className="w-8 h-8 mr-4" />
              <span className="text-lg font-medium">How It Works</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NGOHelp;
