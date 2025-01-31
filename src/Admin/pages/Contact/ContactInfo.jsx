import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

const ContactInfo = () => {
  const data = [
    {
      id: 1,
      name: "Tithi Mondal",
      email: "email@gmail.com",
      phone: "8729890478",
    },
    {
      id: 2,
      name: "Tithi Mondal",
      email: "email@gmail.com",
      phone: "8729890478",
    },
    {
      id: 3,
      name: "Tithi Mondal",
      email: "email@gmail.com",
      phone: "8729890478",
    },
    {
      id: 4,
      name: "Tithi Mondal",
      email: "email@gmail.com",
      phone: "8729890478",
    },
    {
      id: 5,
      name: "Tithi Mondal",
      email: "email@gmail.com",
      phone: "8729890478",
    },
    {
      id: 6,
      name: "Tithi Mondal",
      email: "email@gmail.com",
      phone: "8729890478",
    },
    {
      id: 7,
      name: "Tithi Mondal",
      email: "email@gmail.com",
      phone: "8729890478",
    },
  ];
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />

          <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Contact Info</h1>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="p-6 bg-white rounded-lg shadow-md w-full md:w-1/2">
                <h2 className="text-xl font-bold mb-4">Edit Contact Info</h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Email:</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md"
                    value="email@gmail.com"
                  />
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
                  Update
                </button>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone number:</label>
                  <div className="flex items-center">
                    <span className="w-full px-3 py-2 border rounded-md">
                      9578288298
                    </span>
                    <button className="ml-2 text-blue-500">✏️</button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Add location Details:
                  </label>
                  <div className="flex items-center">
                    <span className="w-full px-3 py-2 border rounded-md">
                      Lorem ipsum dolor sit amet consecteturvoluptrecusandae
                      impedit Kolkata. Sahanagar Kolkata; 700026
                    </span>
                    <button className="ml-2 text-blue-500">✏️</button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">
                    Short dripticnotes:
                  </label>
                  <div className="flex items-center">
                    <span className="w-full px-3 py-2 border rounded-md">
                      Lorem ipsum dolor sit amet consecteturvoluptrecusandae
                      impeditLorem ipsum dolor sit am
                    </span>
                    <button className="ml-2 text-blue-500">✏️</button>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md w-full md:w-1/2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">All Messages</h2>
                  <button className="bg-gray-200 p-2 rounded">Sort by</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 bg-gray-200">Name</th>
                        <th className="py-2 px-4 bg-gray-200">Email</th>
                        <th className="py-2 px-4 bg-gray-200">Phone No.</th>
                        <th className="py-2 px-4 bg-gray-200">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 px-4">{item.name}</td>
                          <td className="py-2 px-4">{item.email}</td>
                          <td className="py-2 px-4">{item.phone}</td>
                          <td className="py-2 px-4">
                            <Link to={"/admin/shoppiness/contact/message"}>
                              <button className="text-blue-500">View</button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
