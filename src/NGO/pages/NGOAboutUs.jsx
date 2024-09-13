// HelpAndSupportPage.jsx
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import NGOsidebar from '../components/NGOsidebar';
import ShoppingBag from '../../assets/googleicon.png'; // Replace with actual path
import ProfilePic from '../../assets/googleicon.png'; // Replace with actual path
import NotificationIcon from '../../assets/googleicon.png'; // Replace with actual path
import MessageUsIcon from '../../assets/googleicon.png'; // Replace with actual path
import EmailUsIcon from '../../assets/googleicon.png'; // Replace with actual path
import CallUsIcon from '../../assets/googleicon.png'; // Replace with actual path
import HowItWorksIcon from '../../assets/googleicon.png'; // Replace with actual path

const AboutUS = () => (
  <div className="flex">
    <NGOsidebar />

    <div className="flex-1 p-6 bg-gray-100">
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
        <h2 className="text-2xl font-bold mb-4">About Us</h2>
        <p className="mb-6">Welcome to Shoppiness Mart where your shopping makes a difference</p>
        
        {/* Space for additional paragraph */}
        <p className="mb-6">At Shoppiness Mart, we believe that every purchase has the power to create positive change. Our platform is designed to connect your everyday shopping with meaningful causes and NGOs. By shopping with us, you not only get access to a wide range of products but also contribute to the betterment of communities and support causes that matter.
        </p>

        <p className="mb-6">
             Our unique feature allows anyone to register their causes and raise funds directly through our platform. Whether you're an individual with a personal cause, an NGO, or a community group, Shoppiness Mart provides you with the tools and visibility to reach a larger audience and garner support.
        </p>

<p className="mb-6">
  Join us in making the world a better place, one purchase at a time. Together, we can turn shopping into a powerful force for good.
</p>

<p className="mb-6">
  Welcome to the Shoppiness Mart community, where your choices matter.
</p>


        {/* Button */}
        <Link 
          to="/learn-more" 
          className="inline-block py-2 px-4 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Know More
        </Link>
      </div>
    </div>
  </div>
);

export default AboutUS;
