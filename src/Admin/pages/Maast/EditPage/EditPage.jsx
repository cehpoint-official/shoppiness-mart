import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoCloudUploadSharp } from "react-icons/io5";
const EditPage = () => {
  const [bannerFiles, setBannerFiles] = useState([
    { id: 1, name: "Banner image1.jpg" },
    { id: 2, name: "Banner image2.jpg" },
    { id: 3, name: "Banner image3.jpg" },
    { id: 4, name: "Banner image4.jpg" },
  ]);

  const [videoFiles, setVideoFiles] = useState([
    { id: 1, name: "How_it_works_video.MP4" },
  ]);

  const handleBannerUpload = () => {
    // Handle file upload logic here
  };

  const handleVideoUpload = () => {
    // Handle video upload logic here
  };

  const handleDelete = (id, type) => {
    if (type === "banner") {
      setBannerFiles(bannerFiles.filter((file) => file.id !== id));
    } else {
      setVideoFiles(videoFiles.filter((file) => file.id !== id));
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-normal">Edit Page</h1>
      </div>

      {/* Banner Upload Section */}
      <div className="mb-8">
        <h2 className="text-gray-700 mb-4 font-medium">Upload Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-gray-400 mb-4">
                <IoCloudUploadSharp className="w-12 h-12" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-2">Drag and Drop</p>
                <p className="text-gray-600 mb-2">Or</p>
                <button
                  onClick={() =>
                    document.getElementById("bannerUpload").click()
                  }
                  className="text-blue-500 hover:text-blue-600 px-0"
                >
                  Browse
                </button>
                <input
                  id="bannerUpload"
                  type="file"
                  className="hidden"
                  onChange={handleBannerUpload}
                  accept="image/*"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Please upload an image (JPG, PNG, GIF) with dimensions
                  <br />
                  851 x 315 pixels and a maximum file size of 50 MB
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 font-medium">#</th>
                  <th className="py-2 font-medium">File name</th>
                  <th className="py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {bannerFiles.map((file, index) => (
                  <tr key={file.id} className="border-t border-gray-100">
                    <td className="py-2 text-gray-600">{index + 1}.</td>
                    <td className="py-2 text-gray-600">{file.name}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDelete(file.id, "banner")}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Video Upload Section */}
      <div>
        <h2 className="text-gray-700 mb-4 font-medium">Upload Video</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-gray-400 mb-4">
                <IoCloudUploadSharp className="w-12 h-12" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-2">Drag and Drop</p>
                <p className="text-gray-600 mb-2">Or</p>
                <button
                  onClick={() => document.getElementById("videoUpload").click()}
                  className="text-blue-500 hover:text-blue-600 px-0"
                >
                  Browse
                </button>
                <input
                  id="videoUpload"
                  type="file"
                  className="hidden"
                  onChange={handleVideoUpload}
                  accept="video/*"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Please upload video (AVI, MP4, or MOV) with dimensions
                  <br />
                  851 x 315 pixels and a maximum file size of 150 MB
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 font-medium">#</th>
                  <th className="py-2 font-medium">File name</th>
                  <th className="py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {videoFiles.map((file, index) => (
                  <tr key={file.id} className="border-t border-gray-100">
                    <td className="py-2 text-gray-600">{index + 1}.</td>
                    <td className="py-2 text-gray-600">{file.name}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDelete(file.id, "video")}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
