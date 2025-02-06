import { BsArrowLeft } from "react-icons/bs";
import { useState } from "react";

const OnlineShopRequests = () => {
   const [activeTab, setActiveTab] = useState("Pending");
   const [selectedShop, setSelectedShop] = useState(null);
 
   // Sample data with both pending and rejected requests
   const shopRequests = [
     {
       id: 1,
       status: "Pending",
       shopName: "Sonali Beauty Parlour",
       location: "Bang Lamung District, Chon Buri 20150, Thailand",
       phone: "+66 9667788788",
       email: "email@gmail.com",
       date: "02 Jan, 2024",
       image:
         "https://example.com/fashion-hub-image.jpg",
       description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
       category: "Beauty Shop",
       ownerName: "Sujan Banerjee",
       businessType: "Offline",
       commission: "5%",
       logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZILqxyDtKtjzPhSIhEhhZSWas5zz9g.png",
     },
     {
       id: 2,
       status: "Pending",
       shopName: "Elegant Fashion Hub",
       location: "Mumbai, Maharashtra, India",
       phone: "+91 9876543210",
       email: "fashionhub@gmail.com",
       date: "05 Jan, 2024",
       image: "https://example.com/fashion-hub-image.jpg",
       description:
         "Trendy and stylish clothing for all occasions. Explore our latest collections with great discounts.",
       category: "Clothing Store",
       ownerName: "Anjali Sharma",
       businessType: "Online",
       commission: "7%",
       logo: "https://example.com/fashion-hub-logo.jpg",
     },
     {
       id: 3,
       status: "Rejected",
       shopName: "TechGear Electronics",
       location: "Singapore",
       phone: "+65 81234567",
       email: "techgear@gmail.com",
       date: "10 Jan, 2024",
       image: "https://example.com/techgear-image.jpg",
       description:
         "Leading provider of cutting-edge electronics, including laptops, smartphones, and accessories.",
       category: "Electronics",
       ownerName: "Rajesh Kumar",
       businessType: "Offline",
       commission: "4%",
       logo: "https://example.com/techgear-logo.jpg",
     },
     {
       id: 4,
       status: "Pending",
       shopName: "GreenFresh Organic Store",
       location: "Los Angeles, California, USA",
       phone: "+1 323-555-7890",
       email: "greenfresh@gmail.com",
       date: "12 Jan, 2024",
       image: "https://example.com/greenfresh-image.jpg",
       description:
         "Fresh and organic groceries delivered straight to your doorstep. Eat healthy, live better!",
       category: "Grocery Store",
       ownerName: "Emily Johnson",
       businessType: "Online",
       commission: "6%",
       logo: "https://example.com/greenfresh-logo.jpg",
     },
     {
       id: 5,
       status: "Rejected",
       shopName: "Speedy Auto Services",
       location: "Sydney, Australia",
       phone: "+61 412 345 678",
       email: "speedyauto@gmail.com",
       date: "15 Jan, 2024",
       image: "https://example.com/speedyauto-image.jpg",
       description:
         "Professional auto repair and maintenance services. Your car’s best friend!",
       category: "Automobile Services",
       ownerName: "Michael Brown",
       businessType: "Offline",
       commission: "8%",
       logo: "https://example.com/speedyauto-logo.jpg",
     },
     {
       id: 6,
       status: "Pending",
       shopName: "Healthy Bites Café",
       location: "Toronto, Canada",
       phone: "+1 416-555-6789",
       email: "healthybites@gmail.com",
       date: "18 Jan, 2024",
       image: "https://example.com/healthybites-image.jpg",
       description:
         "Delicious and nutritious meals prepared with fresh ingredients. Come taste the difference!",
       category: "Restaurant",
       ownerName: "Sophia Martinez",
       businessType: "Offline",
       commission: "10%",
       logo: "https://example.com/healthybites-logo.jpg",
     },
     {
       id: 7,
       status: "Rejected",
       shopName: "Book Haven",
       location: "London, UK",
       phone: "+44 20 7946 0958",
       email: "bookhaven@gmail.com",
       date: "20 Jan, 2024",
       image: "https://example.com/bookhaven-image.jpg",
       description:
         "A paradise for book lovers. Find the latest bestsellers and timeless classics in one place.",
       category: "Bookstore",
       ownerName: "Oliver Wilson",
       businessType: "Online",
       commission: "5%",
       logo: "https://example.com/bookhaven-logo.jpg",
     },
   ];
 
   const filteredRequests = shopRequests.filter((request) =>
     activeTab === "Pending"
       ? request.status === "Pending"
       : request.status === "Rejected"
   );
 
   if (selectedShop) {
     return (
       <div className="p-6">
         <button
           onClick={() => setSelectedShop(null)}
           className="flex items-center gap-2  mb-8 hover:text-gray-900"
         >
           <BsArrowLeft className="w-4 h-4" />
           View request
         </button>
 
         <div className="grid md:grid-cols-2 gap-8 bg-white p-6">
           <div>
             <img
               src={selectedShop.image || "/placeholder.svg"}
               alt={selectedShop.shopName}
               className="w-full rounded-lg object-cover aspect-square"
             />
           </div>
 
           <div>
             <div className="flex items-start gap-4 mb-6">
               <div className="w-12 h-12 rounded-full bg-gray-200"></div>
               <div>
                 <h1 className="text-2xl font-semibold">
                   {selectedShop.shopName}
                 </h1>
                 <p className="text-gray-500">{selectedShop.category}</p>
               </div>
             </div>
 
             <div className="space-y-6">
               <div>
                 <h2 className="font-medium mb-2">Description</h2>
                 <p className="text-gray-600">{selectedShop.description}</p>
               </div>
 
               <div>
                 <h2 className="font-medium mb-2">Location</h2>
                 <p className="text-gray-600">{selectedShop.location}</p>
               </div>
 
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <h2 className="font-medium mb-2">Phone Number</h2>
                   <p className="text-gray-600">{selectedShop.phone}</p>
                 </div>
                 <div>
                   <h2 className="font-medium mb-2">Email ID</h2>
                   <p className="text-gray-600">{selectedShop.email}</p>
                 </div>
               </div>
             </div>
 
             <div className="mt-8">
               <h2 className="text-xl font-semibold mb-4">SHOP DETAILS</h2>
               <table className="w-full">
                 <tbody className="divide-y divide-gray-200">
                   <tr>
                     <td className="py-3 text-sm text-gray-500">
                       Business/Services Owner Name
                     </td>
                     <td className="py-3 text-sm">{selectedShop.ownerName}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-sm text-gray-500">
                       Business/Services type
                     </td>
                     <td className="py-3 text-sm">
                       {selectedShop.businessType}
                     </td>
                   </tr>
                   <tr>
                     <td className="py-3 text-sm text-gray-500">Email</td>
                     <td className="py-3 text-sm">{selectedShop.email}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-sm text-gray-500">
                       Shop Category
                     </td>
                     <td className="py-3 text-sm">{selectedShop.category}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-sm text-gray-500">
                       commission rate
                     </td>
                     <td className="py-3 text-sm">{selectedShop.commission}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-sm text-gray-500">LOGO</td>
                     <td className="py-3">
                       <img
                         src={selectedShop.logo || "/placeholder.svg"}
                         alt="Shop logo"
                         className="w-24 h-24 object-contain"
                       />
                     </td>
                   </tr>
                 </tbody>
               </table>
             </div>
 
             <div className="flex gap-4 mt-8">
               <button className="px-6 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
                 Reject Request
               </button>
               <button className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                 Accept Request
               </button>
             </div>
           </div>
         </div>
       </div>
     );
   }
 
   return (
     <div className="p-6">
       <h1 className="text-2xl font-semibold mb-6">Online Shop Requests</h1>
       <div className="bg-white p-6 rounded-xl border shadow-md">
        
         <div className="flex gap-4 mb-6">
           <button
             className={`px-4 py-2 rounded-full text-sm ${
               activeTab === "Pending"
                 ? "bg-[#F7941D] text-white"
                 : "border border-gray-300 text-gray-700"
             }`}
             onClick={() => setActiveTab("Pending")}
           >
             Product/Service Requests
           </button>
           <button
             className={`px-4 py-2 rounded-full text-sm ${
               activeTab === "Rejected"
                 ? "bg-[#F7941D] text-white"
                 : "border border-gray-300 text-gray-700"
             }`}
             onClick={() => setActiveTab("Rejected")}
           >
             Rejected Product/Service Requests
           </button>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full">
             <tbody>
               {filteredRequests.map((request) => (
                 <tr key={request.id} className="border-b">
                   <td className="py-4 px-6">
                     <div className="flex items-center gap-4">
                       <img
                         src={request.image || "/placeholder.svg"}
                         alt={request.shopName}
                         className="w-20 h-20 rounded object-cover"
                       />
                       <div>
                         <h3 className="font-medium">{request.shopName}</h3>
                         <p className="text-sm text-gray-500">
                           {request.location}
                         </p>
                       </div>
                     </div>
                   </td>
                   <td className="py-4 px-6">
                     <div className="grid grid-cols-3 gap-8">
                       <div>
                         <p className="text-sm">{request.phone}</p>
                         <p className="text-xs text-gray-500">Phone</p>
                       </div>
                       <div>
                         <p className="text-sm">{request.email}</p>
                         <p className="text-xs text-gray-500">Email</p>
                       </div>
                       <div>
                         <p className="text-sm">{request.date}</p>
                         <p className="text-xs text-gray-500">Date</p>
                       </div>
                     </div>
                   </td>
                   <td className="py-4 px-6">
                     <button
                       onClick={() => setSelectedShop(request)}
                       className="text-blue-500 border border-blue-600 px-2 py-1 hover:text-blue-600 transition-colors"
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
 };

export default OnlineShopRequests