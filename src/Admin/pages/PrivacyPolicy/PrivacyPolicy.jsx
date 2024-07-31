import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const PrivacyPolicy = () => {
  const policies = [
    { id: 1, title: "Privacy policy 1" },
    { id: 2, title: "Privacy policy 2" },
    { id: 3, title: "Privacy policy 3" },
    { id: 4, title: "Privacy policy 4" },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 bg-gray-100 flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Privacy Policies</h1>
                <Link to={"/admin/shoppiness/add/privacy-policy"}>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                    + ADD NEW POLICY
                  </button>
                </Link>
              </div>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div
                    key={policy.id}
                    className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
                  >
                    <span>{policy.title}</span>
                    <button className="text-blue-500">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
