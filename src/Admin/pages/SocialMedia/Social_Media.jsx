import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import SocialMediaLinks from "./SocialMediaLinks";
export default function Social_Media(){
    return (
        <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />

          <div className="p-6 bg-gray-100 flex-initail">
            <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold mt-5 mb-5">Social Media</h1>
              <div className=" bg-white shadow-md rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <SocialMediaLinks/>                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}