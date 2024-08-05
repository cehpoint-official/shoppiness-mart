import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

const NgoRequest = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const data = [
    {
      logo: "https://via.placeholder.com/50",
      name: "NGO Name",
      location: "Pravat Sarani, opposite to Bolpur..",
      phone: "9564076906",
      email: "admin@gmail.com",
      date: "02Jan,2024",
    },
    {
      logo: "https://via.placeholder.com/50",
      name: "NGO Name",
      location: "Tourist lodge, Pravat Sarani, opposite to Bolpur..",
      phone: "9564076906",
      email: "admin@gmail.com",
      date: "02Jan,2024",
    },
  ];
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />

          {/*ADD FAQ QUES  */}
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">NGO/Cause Request</h1>
            <div className="flex mb-4 gap-4">
              <button
                className={`px-2 text-sm py-2 rounded-lg ${
                  activeTab === "requests" ? "bg-yellow-400" : "bg-gray-200"
                } `}
                onClick={() => setActiveTab("requests")}
              >
                NGO/Cause Requests
              </button>
              <button
                className={`px-2 text-sm py-2 rounded-lg ${
                  activeTab === "rejected" ? "bg-yellow-400" : "bg-gray-200"
                } `}
                onClick={() => setActiveTab("rejected")}
              >
                Rejected NGO/Cause Requests
              </button>
            </div>
            {activeTab === "requests" && (
              <div>
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 mb-4 bg-white rounded shadow"
                  >
                    <img
                      src={item.logo}
                      alt="NGO Logo"
                      className="w-12 h-12 mr-4"
                    />
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold">{item.name}</h2>
                      <p className="text-gray-600">{item.location}</p>
                    </div>
                    <div className="mr-4">
                      <p className="font-bold">{item.phone}</p>
                      <p className="text-gray-600">{item.email}</p>
                    </div>
                    <div className="mr-4">
                      <p className="font-bold">{item.date}</p>
                    </div>
                    <Link to="/admin/shoppiness/ngo/cause/requests/see">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded">
                        View Details
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "rejected" && (
              <div>
                <p>No rejected requests.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default NgoRequest;
