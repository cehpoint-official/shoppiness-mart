import React, { useState } from 'react';
import Navbar from '../../../components/Navbar'; // Adjust the path as necessary
import Sidebar from '../../../components/Sidebar'; // Adjust the path as necessary

const UploadBanner = () => {
  const [files, setFiles] = useState([]);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const uploadedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleBrowse = (event) => {
    event.preventDefault();
    document.getElementById('fileInput').click();
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <div className="p-6 bg-gray-100 flex-grow flex flex-col space-y-4">
          {/* Header Text */}
          <h1 className="text-2xl font-bold">Upload banner</h1>

          {/* Container for Upload Box and Uploaded Files List */}
          <div className="flex space-x-4">
            {/* File Upload Box */}
            <div className="flex flex-col items-center justify-center w-1/2 p-4 border-dashed border-2 border-teal-500 rounded-lg"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="fileInput"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-teal-500">Drag & drop files here</p>
              <button
                onClick={handleBrowse}
                className="mt-2 text-teal-600 underline"
              >
                Click here to browse files
              </button>
            </div>

            {/* Uploaded Files Box */}
            <div className="w-1/2 bg-white p-4 rounded shadow">
              <h2 className="font-bold mb-2">Uploaded Files</h2>
              {files.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">#</th>
                      <th className="text-left">File Name</th>
                      <th className="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{file.name}</td>
                        <td>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No files uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadBanner;
