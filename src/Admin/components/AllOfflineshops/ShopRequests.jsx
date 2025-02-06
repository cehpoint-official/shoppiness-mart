import { useState } from "react";
const shopData = [
  {
    id: 1,
    name: "Sonali Beauty Parlour",
    category: "Beauty shop",
    image: "https://placehold.co/400x400",
    logo: "https://placehold.co/100x100",
    location: "Bang Lamung District, Chon Buri 20150, Thailand",
    phone: "+66 966778788",
    email: "email@gmail.com",
    date: "02Jan,2024",
    status: "active",
    verified: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu.",
    ownerName: "Sujan Banerjee",
    type: "Offline",
    commission: "5",
    businessEmail: "offlineshop@gmail.com",
  },
  {
    id: 2,
    name: "Royal Spa & Salon",
    category: "Spa & Wellness",
    image: "https://placehold.co/400x400",
    logo: "https://placehold.co/100x100",
    location: "Sukhumvit Road, Bangkok 10110, Thailand",
    phone: "+66 945678901",
    email: "royal@gmail.com",
    date: "03Jan,2024",
    status: "active",
    verified: true,
    description: "Premium spa and salon services in the heart of Bangkok.",
    ownerName: "Sarah Johnson",
    type: "Offline",
    commission: "7",
    businessEmail: "royal.spa@gmail.com",
  },
  {
    id: 3,
    name: "Thai Massage Center",
    category: "Massage",
    image: "https://placehold.co/400x400",
    logo: "https://placehold.co/100x100",
    location: "Pattaya Beach Road, Chonburi 20150, Thailand",
    phone: "+66 934567890",
    email: "thaimassage@gmail.com",
    date: "04Jan,2024",
    status: "inactive",
    verified: false,
    description: "Traditional Thai massage and wellness treatments.",
    ownerName: "Somchai Thai",
    type: "Offline",
    commission: "6",
    businessEmail: "info.thaimassage@gmail.com",
  },
  {
    id: 4,
    name: "Glamour Studio",
    category: "Beauty shop",
    image: "https://placehold.co/400x400",
    logo: "https://placehold.co/100x100",
    location: "Siam Square, Bangkok 10330, Thailand",
    phone: "+66 923456789",
    email: "glamour@gmail.com",
    date: "05Jan,2024",
    status: "active",
    verified: true,
    description: "High-end beauty treatments and makeup services.",
    ownerName: "Lisa Park",
    type: "Offline",
    commission: "8",
    businessEmail: "glamour.studio@gmail.com",
  },
  {
    id: 5,
    name: "Zen Wellness",
    category: "Wellness Center",
    image: "https://placehold.co/400x400",
    logo: "https://placehold.co/100x100",
    location: "Silom Road, Bangkok 10500, Thailand",
    phone: "+66 912345678",
    email: "zen@gmail.com",
    date: "06Jan,2024",
    status: "inactive",
    verified: true,
    description: "Holistic wellness treatments and meditation services.",
    ownerName: "David Chen",
    type: "Online",
    commission: "5",
    businessEmail: "zen.wellness@gmail.com",
  },
];
function ShopRequests({ onViewDetails }) {
  const [activeTab, setActiveTab] = useState("active");

  const filteredData = shopData.filter((item) =>
    activeTab === "active"
      ? item.status === "active"
      : item.status === "inactive"
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        All Offline shops
      </h1>
      <div className="bg-white p-6 rounded-xl border shadow-md">
        {" "}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full border transition-all ${
              activeTab === "active"
                ? "bg-orange-400 text-white border-orange-400"
                : "border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Product/Service
          </button>
          <button
            className={`px-6 py-2 rounded-full border transition-all ${
              activeTab === "inactive"
                ? "bg-orange-400 text-white border-orange-400"
                : "border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("inactive")}
          >
            Inactive Product/Service
          </button>
        </div>
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full">
            <tbody className="space-y-4">
              {filteredData.map((shop) => (
                <tr key={shop.id} className="border-b">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <img
                    src={shop.image}
                    alt={shop.name}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{shop.name}</h3>
                        <p className="text-sm text-gray-500">
                        {shop.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-sm">{shop.phone}</p>
                        <p className="text-xs text-gray-500">Phone</p>
                      </div>
                      <div>
                        <p className="text-sm">{shop.email}</p>
                        <p className="text-xs text-gray-500">Email</p>
                      </div>
                      <div>
                        <p className="text-sm"> {shop.date}</p>
                        <p className="text-xs text-gray-500">Date</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onViewDetails(shop)}
                       className="ml-auto px-6 py-2 border border-blue-500 text-blue-500 rounded-md
                        hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShopRequests;
