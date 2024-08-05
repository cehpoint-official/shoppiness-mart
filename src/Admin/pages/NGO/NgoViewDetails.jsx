import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const NgoViewDetails = () => {
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          {/* {} */}
          <div className="container mx-auto p-4">
            <button className="text-blue-500 mb-4">&larr; View request</button>
            <div className="bg-white p-6 rounded-lg shadow-md flex">
              <img
                src="https://via.placeholder.com/150"
                alt="NGO"
                className="w-48 h-48 object-cover rounded-lg mr-6"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">NGO Name</h2>
                    <p className="text-gray-600">Group / Organisation</p>
                  </div>
                  <img
                    src="https://via.placeholder.com/50"
                    alt="NGO Logo"
                    className="w-12 h-12"
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold">About Cause</h3>
                  <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc vulputate libero et velit interdum.
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Cause / NGO Description</h3>
                  <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc vulputate libero et velit interdum, ac aliquet odio
                    mattis. Class aptent taciti sociosqu a.
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Location</h3>
                  <p className="text-gray-700">
                    Bang Lamung District, Chon Buri 20150, Thailand
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold">PIN</h3>
                  <p className="text-gray-700">788389</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Account Created by</h3>
                    <p className="text-gray-700">Arun Mondal</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Phone Number</h3>
                    <p className="text-gray-700">+66 9667788788</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Email ID</h3>
                    <p className="text-gray-700">email@gmail.com</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2">
                    Reject Request
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded">
                    Accept Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoViewDetails;
