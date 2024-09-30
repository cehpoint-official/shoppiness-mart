import React, { useState } from 'react';  
import './BannerImage.css'; // Optional: for styling  

const UploadBanner = () => {  
  const [files, setFiles] = useState([]);  

  const handleDrop = (event) => {  
    event.preventDefault();  
    const newFiles = Array.from(event.dataTransfer.files);  
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);  
  };  

  const handleBrowse = (event) => {  
    const newFiles = Array.from(event.target.files);  
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);  
  };  

  const handleDelete = (index) => {  
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));  
  };  

  return (  
    <div className="upload-banner">  
      <h2>Home / Upload Banner</h2>  
      <div  
        className="drop-area"  
        onDrop={handleDrop}  
        onDragOver={(e) => e.preventDefault()}  
      >  
        <p>Drag and Drop</p>  
        <p>Or</p>  
        <input type="file" multiple onChange={handleBrowse} />  
        <p>Please upload an image (JPG, PNG, GIF) with dimensions 851 x 315 pixels and a maximum file size of 50 MB.</p>  
      </div>  
      <div className="file-list">  
        <h3>Uploaded Files</h3>  
        <table>  
          <thead>  
            <tr>  
              <th>#</th>  
              <th>File name</th>  
              <th>Action</th>  
            </tr>  
          </thead>  
          <tbody>  
            {files.map((file, index) => (  
              <tr key={index}>  
                <td>{index + 1}</td>  
                <td>{file.name}</td>  
                <td>  
                  <button onClick={() => handleDelete(index)}>🗑️</button>  
                </td>  
              </tr>  
            ))}  
          </tbody>  
        </table>  
      </div>  
    </div>  
  );  
};  

export default UploadBanner;