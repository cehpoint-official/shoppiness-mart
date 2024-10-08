import { Link } from 'react-router-dom';
import NGOSidebar from '../components/NGOSidebar'; // Adjust the path if necessary
import NGONavbar from '../components/NGONavbar'; // Adjust the path if necessary

const AboutUS = () => (
  <div className="flex">
    <NGOSidebar />

    <div className="flex-1 flex flex-col">
      <NGONavbar /> {/* Include the navbar component */}

      <div className="p-6 bg-gray-100">
        {/* Main Content Section */}
        <h2 className="text-2xl font-bold mb-4">About Us</h2>
        <p className="mb-6">Welcome to Shoppiness Mart where your shopping makes a difference</p>
        
        <p className="mb-6">
          At Shoppiness Mart, we believe that every purchase has the power to create positive change. Our platform is designed to connect your everyday shopping with meaningful causes and NGOs. By shopping with us, you not only get access to a wide range of products but also contribute to the betterment of communities and support causes that matter.
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
