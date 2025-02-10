import { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import UploadBanner from "./UploadBanner";
import UploadVideo from "./UploadVideo";
import UploadMembers from "./UploadMembers";
import WriteStory from "./WriteStory";

const WebsiteEditPages = () => {
  const [openSections, setOpenSections] = useState({
    home: false,
    howItWorks: false,
    aboutUs: false,
  });
  const [selectedComponent, setSelectedComponent] = useState(null);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleItemClick = (component) => {
    setSelectedComponent(component);
  };

  const handleBack = () => {
    setSelectedComponent(null);
  };

  if (selectedComponent) {
    return (
      <div className="p-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 mb-4"
        >
          ← Back
        </button>
        {selectedComponent}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Pages</h1>
      <div className="space-y-4 bg-white h-[600px] rounded-xl border shadow-md py-10 px-6">
        {/* Home Section */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("home")}
          >
            <h2 className="text-lg font-medium">Home</h2>
            {openSections.home ? <AiOutlineMinus /> : <AiOutlinePlus />}
          </div>
          {openSections.home && (
            <div className="p-4 border-t">
              <div
                className="cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => handleItemClick(<UploadBanner />)}
              >
                Upload Banner image
              </div>
            </div>
          )}
        </div>

        {/* How it works Section */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("howItWorks")}
          >
            <h2 className="text-lg font-medium">How it works</h2>
            {openSections.howItWorks ? <AiOutlineMinus /> : <AiOutlinePlus />}
          </div>
          {openSections.howItWorks && (
            <div className="p-4 border-t">
              <div
                className="cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => handleItemClick(<UploadVideo />)}
              >
                How it works video
              </div>
            </div>
          )}
        </div>

        {/* About Us Section */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("aboutUs")}
          >
            <h2 className="text-lg font-medium">About Us</h2>
            {openSections.aboutUs ? <AiOutlineMinus /> : <AiOutlinePlus />}
          </div>
          {openSections.aboutUs && (
            <div className="p-4 border-t space-y-2">
              <div
                className="cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => handleItemClick(<WriteStory />)}
              >
                Write the story of this platform
              </div>
              <div
                className="cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => handleItemClick(<UploadMembers />)}
              >
                Upload members image
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteEditPages;
