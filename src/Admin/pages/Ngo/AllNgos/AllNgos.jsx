import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const ngoRequests = [
  {
    id: 1,
    name: "Care Foundation",
    location: "Pravat Sarani, opposite to Bolpur..",
    phone: "9564076906",
    email: "care@gmail.com",
    date: "02Jan,2024",
    logo: "/placeholder.svg",
    status: "Active",
  },
  {
    id: 2,
    name: "Hope Trust",
    location: "Tourist lodge, Pravat Sarani, opposite to Bolpur..",
    phone: "9564076907",
    email: "hope@gmail.com",
    date: "03Jan,2024",
    logo: "/placeholder.svg",
    status: "Active",
  },
  {
    id: 7,
    name: "Invalid Foundation",
    location: "Unknown Location, Bolpur",
    phone: "9564076912",
    email: "invalid@gmail.com",
    date: "01Jan,2024",
    logo: "/placeholder.svg",
    status: "Inactive",
  },
];
const AllNgos = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [viewMode, setViewMode] = useState("list");
  const [selectedNGO, setSelectedNGO] = useState(null);

  const displayData = ngoRequests.filter((ngo) => ngo.status === activeTab);

  const handleViewDetails = (ngo) => {
    setSelectedNGO(ngo);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedNGO(null);
  };

  if (viewMode === "detail" && selectedNGO) {
    return (
      <div className="p-6">
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <FaArrowLeft className="w-4 h-4" />
            View request
                </button>
                
        </div>

        <div className="bg-white border rounded-lg p-8 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img
                src={selectedNGO.featuredImage || "/placeholder.svg"}
                alt="NGO Featured Image"
                className="object-cover"
              />
            </div>

            {/* Right column - Details */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-semibold mb-1">
                    {selectedNGO.name}
                  </h1>
                  <p className="text-gray-600">{selectedNGO.groupType}</p>
                </div>
                <div className="w-20 h-20 relative">
                  <img
                    src={selectedNGO.logo || "/placeholder.svg"}
                    alt="NGO Logo"
                    className="object-contain"
                  />
                </div>
              </div>

              <div>
                <h2 className="font-medium mb-2">About Cause</h2>
                <p className="text-gray-600">{selectedNGO.aboutCause}</p>
              </div>

              <div>
                <h2 className="font-medium mb-2">Cause / NGO Description</h2>
                <p className="text-gray-600">{selectedNGO.description}</p>
              </div>

              <div>
                <h2 className="font-medium mb-2">Location</h2>
                <p className="text-gray-600">{selectedNGO.location}</p>
              </div>

              <div>
                <h2 className="font-medium mb-2">PIN</h2>
                <p className="text-gray-600">{selectedNGO.pin}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h2 className="font-medium mb-2">Account Created by</h2>
                  <p className="text-gray-600">{selectedNGO.createdBy}</p>
                </div>
                <div>
                  <h2 className="font-medium mb-2">Phone Number</h2>
                  <p className="text-gray-600">{selectedNGO.phone}</p>
                </div>
                <div>
                  <h2 className="font-medium mb-2">Email ID</h2>
                  <p className="text-gray-600">{selectedNGO.email}</p>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                  Reject Request
                </button>
                <button className="px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  Accept Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-normal mb-8">All NGOs/Causes</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("Active")}
          className={`px-6 py-2 rounded-md transition-colors ${
            activeTab === "Active"
              ? "bg-[#F7941D] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          Active NGOs/Causes
        </button>
        <button
          onClick={() => setActiveTab("Inactive")}
          className={`px-6 py-2 rounded-md transition-colors ${
            activeTab === "Inactive"
              ? "bg-[#F7941D] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          Inactive NGOs/Causes
        </button>
      </div>

      <div className="bg-white rounded-lg p-3 shadow-sm">
        <div className="space-y-8">
          {displayData.map((ngo) => (
            <div
              key={ngo.id}
              className="flex border p-3 rounded-xl items-center gap-6"
            >
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={ngo.logo || "/placeholder.svg"}
                  alt={`${ngo.name} logo`}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg">{ngo.name}</h3>
                <p className="text-gray-500 text-sm">{ngo.location}</p>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-gray-900">{ngo.phone}</p>
                <p className="text-gray-500 text-sm">Phone</p>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-gray-900">{ngo.email}</p>
                <p className="text-gray-500 text-sm">Email</p>
              </div>

              <button
                onClick={() => handleViewDetails(ngo)}
                className="text-blue-500 border border-blue-600 px-2 py-1 hover:text-blue-600 transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AllNgos;
