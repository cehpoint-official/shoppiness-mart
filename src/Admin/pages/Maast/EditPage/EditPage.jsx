import { useState, useEffect } from "react";
import { MdDelete, MdSave } from "react-icons/md";
import { IoCloudUploadSharp } from "react-icons/io5";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query,
  setDoc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { db, storage } from "../../../../../firebase";
import { v4 as uuidv4 } from "uuid";

const EditPage = () => {
  const [bannerFiles, setBannerFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({ banner: 0, video: 0 });
  const [isUploading, setIsUploading] = useState({ banner: false, video: false });
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({ banner: null, video: null });

  // Fetch existing files on component mount
  useEffect(() => {
    fetchFiles();
    // Ensure maast collection exists with banners and videos documents
    initMaastCollection();
  }, []);

  const initMaastCollection = async () => {
    try {
      // Check if maast/banners document exists
      const bannersDocRef = doc(db, "maast", "banners");
      const bannersDoc = await getDoc(bannersDocRef);
      
      // Check if maast/videos document exists
      const videosDocRef = doc(db, "maast", "videos");
      const videosDoc = await getDoc(videosDocRef);
      
      // If not exist, create them with empty arrays
      if (!bannersDoc.exists()) {
        await setDoc(bannersDocRef, { items: [] });
      }
      
      if (!videosDoc.exists()) {
        await setDoc(videosDocRef, { items: [] });
      }
    } catch (error) {
      console.error("Error initializing maast collection:", error);
    }
  };

  const fetchFiles = async () => {
    try {
      // Fetch banner data from Firestore
      const bannerQuery = query(collection(db, "banners"));
      const bannerSnapshot = await getDocs(bannerQuery);
      const bannerData = bannerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Fetch video data from Firestore
      const videoQuery = query(collection(db, "videos"));
      const videoSnapshot = await getDocs(videoQuery);
      const videoData = videoSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setBannerFiles(bannerData);
      setVideoFiles(videoData);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Failed to load files. Please try again.");
    }
  };

  const validateFile = (file, type) => {
    // Validate file size
    const maxSize = type === "banner" ? 50 * 1024 * 1024 : 150 * 1024 * 1024; // 50MB for banners, 150MB for videos
    if (file.size > maxSize) {
      const sizeMB = type === "banner" ? "50MB" : "150MB";
      setError(`File size exceeds the maximum limit of ${sizeMB}`);
      return false;
    }

    // Validate file type
    if (type === "banner" && !file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, GIF)");
      return false;
    }

    if (type === "video" && !file.type.startsWith("video/")) {
      setError("Please upload a video file (AVI, MP4, MOV)");
      return false;
    }

    return true;
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file, type)) return;

    setError("");
    setIsUploading({ ...isUploading, [type]: true });
    setUploadProgress({ ...uploadProgress, [type]: 0 });

    try {
      // Create a unique file name to prevent overwriting
      const fileId = uuidv4();
      const fileName = `${fileId}_${file.name}`;
      const storagePath = `${type}s/${fileName}`;
      const storageRef = ref(storage, storagePath);

      // Upload file to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress({ ...uploadProgress, [type]: progress });
        },
        (error) => {
          console.error("Upload error:", error);
          setError("File upload failed. Please try again.");
          setIsUploading({ ...isUploading, [type]: false });
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Save file metadata to Firestore
          const fileData = {
            name: file.name,
            originalName: file.name,
            storagePath: storagePath,
            url: downloadURL,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          };

          // Add to Firestore collection
          const collectionRef = collection(db, `${type}s`);
          const docRef = await addDoc(collectionRef, fileData);
          
          // Update UI
          if (type === "banner") {
            setBannerFiles([...bannerFiles, { id: docRef.id, ...fileData }]);
          } else {
            setVideoFiles([...videoFiles, { id: docRef.id, ...fileData }]);
          }
          
          setIsUploading({ ...isUploading, [type]: false });
          
          // Reset file input
          if (type === "banner") {
            document.getElementById("bannerUpload").value = "";
          } else {
            document.getElementById("videoUpload").value = "";
          }
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      setError("File upload failed. Please try again.");
      setIsUploading({ ...isUploading, [type]: false });
    }
  };

  const handleSelectFile = (id, type) => {
    setSelectedFiles({ ...selectedFiles, [type]: id });
  };

  const handleSave = async (type) => {
    const selectedId = selectedFiles[type];
    if (!selectedId) {
      setError(`Please select a ${type} to save`);
      return;
    }

    try {
      // Find the file to save
      const fileArray = type === "banner" ? bannerFiles : videoFiles;
      const fileToSave = fileArray.find(file => file.id === selectedId);
      
      if (!fileToSave) {
        throw new Error("Selected file not found");
      }

      // Get the maast document reference
      const maastDocRef = doc(db, "maast", `${type}s`);
      
      // Get current document
      const maastDoc = await getDoc(maastDocRef);
      
      if (!maastDoc.exists()) {
        // Create document if it doesn't exist
        await setDoc(maastDocRef, { items: [fileToSave] });
      } else {
        // Update existing document
        const currentItems = maastDoc.data().items || [];
        
        // Check if this item already exists in the array
        const existingItemIndex = currentItems.findIndex(item => item.id === fileToSave.id);
        
        if (existingItemIndex >= 0) {
          // Replace existing item
          currentItems[existingItemIndex] = fileToSave;
        } else {
          // Add new item
          currentItems.push(fileToSave);
        }
        
        // Update the document
        await updateDoc(maastDocRef, { items: currentItems });
      }
      
      setError("");
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully to maast collection!`);
    } catch (error) {
      console.error("Save error:", error);
      setError(`Failed to save ${type}. Please try again.`);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      // Find the file to get its storage path
      const fileArray = type === "banner" ? bannerFiles : videoFiles;
      const fileToDelete = fileArray.find(file => file.id === id);
      
      if (!fileToDelete || !fileToDelete.storagePath) {
        throw new Error("File not found or missing storage path");
      }

      // Delete from Firebase Storage
      const storageRef = ref(storage, fileToDelete.storagePath);
      await deleteObject(storageRef);
      
      // Delete from Firestore's regular collection
      await deleteDoc(doc(db, `${type}s`, id));
      
      // Also remove from maast collection if it exists
      try {
        const maastDocRef = doc(db, "maast", `${type}s`);
        const maastDoc = await getDoc(maastDocRef);
        
        if (maastDoc.exists()) {
          const currentItems = maastDoc.data().items || [];
          const updatedItems = currentItems.filter(item => item.id !== id);
          await updateDoc(maastDocRef, { items: updatedItems });
        }
      } catch (e) {
        console.log(`Error updating maast/${type}s document:`, e);
      }
      
      // Update state
      if (type === "banner") {
        setBannerFiles(bannerFiles.filter(file => file.id !== id));
        if (selectedFiles.banner === id) {
          setSelectedFiles({ ...selectedFiles, banner: null });
        }
      } else {
        setVideoFiles(videoFiles.filter(file => file.id !== id));
        if (selectedFiles.video === id) {
          setSelectedFiles({ ...selectedFiles, video: null });
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete file. Please try again.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Create a synthetic event object to pass to handleFileUpload
      const syntheticEvent = {
        target: {
          files: [file]
        }
      };
      
      handleFileUpload(syntheticEvent, type);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-normal">Edit Page</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Banner Upload Section */}
      <div className="mb-8">
        <h2 className="text-gray-700 mb-4 font-medium">Upload Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className={`border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white ${isUploading.banner ? 'opacity-50' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "banner")}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-gray-400 mb-4">
                <IoCloudUploadSharp className="w-12 h-12" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-2">Drag and Drop</p>
                <p className="text-gray-600 mb-2">Or</p>
                <button
                  onClick={() => document.getElementById("bannerUpload").click()}
                  className="text-blue-500 hover:text-blue-600 px-0"
                  disabled={isUploading.banner}
                >
                  Browse
                </button>
                <input
                  id="bannerUpload"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "banner")}
                  accept="image/*"
                  disabled={isUploading.banner}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Please upload an image (JPG, PNG, GIF) with dimensions
                  <br />
                  851 x 315 pixels and a maximum file size of 50 MB
                </p>
                
                {isUploading.banner && (
                  <div className="mt-4 w-full">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${uploadProgress.banner}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Uploading: {uploadProgress.banner}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between mb-4">
              <h3 className="font-medium text-gray-700">Available Banners</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSave("banner")}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  disabled={!selectedFiles.banner || isUploading.banner}
                >
                  <MdSave className="mr-1" />
                  Save
                </button>
                <button
                  onClick={() => selectedFiles.banner && handleDelete(selectedFiles.banner, "banner")}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  disabled={!selectedFiles.banner || isUploading.banner}
                >
                  <MdDelete className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 font-medium">#</th>
                  <th className="py-2 font-medium">File name</th>
                  <th className="py-2 font-medium">Select</th>
                </tr>
              </thead>
              <tbody>
                {bannerFiles.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No banners uploaded yet
                    </td>
                  </tr>
                ) : (
                  bannerFiles.map((file, index) => (
                    <tr key={file.id} className={`border-t border-gray-100 ${selectedFiles.banner === file.id ? 'bg-blue-50' : ''}`}>
                      <td className="py-2 text-gray-600">{index + 1}.</td>
                      <td className="py-2 text-gray-600">{file.originalName || file.name}</td>
                      <td className="py-2">
                        <input
                          type="radio"
                          name="selectedBanner"
                          checked={selectedFiles.banner === file.id}
                          onChange={() => handleSelectFile(file.id, "banner")}
                          className="form-radio text-blue-500"
                          disabled={isUploading.banner}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Video Upload Section */}
      <div>
        <h2 className="text-gray-700 mb-4 font-medium">Upload Video</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className={`border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white ${isUploading.video ? 'opacity-50' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "video")}
          >
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
                  disabled={isUploading.video}
                >
                  Browse
                </button>
                <input
                  id="videoUpload"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "video")}
                  accept="video/*"
                  disabled={isUploading.video}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Please upload video (AVI, MP4, or MOV) with dimensions
                  <br />
                  851 x 315 pixels and a maximum file size of 150 MB
                </p>
                
                {isUploading.video && (
                  <div className="mt-4 w-full">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${uploadProgress.video}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Uploading: {uploadProgress.video}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between mb-4">
              <h3 className="font-medium text-gray-700">Available Videos</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSave("video")}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  disabled={!selectedFiles.video || isUploading.video}
                >
                  <MdSave className="mr-1" />
                  Save
                </button>
                <button
                  onClick={() => selectedFiles.video && handleDelete(selectedFiles.video, "video")}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  disabled={!selectedFiles.video || isUploading.video}
                >
                  <MdDelete className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 font-medium">#</th>
                  <th className="py-2 font-medium">File name</th>
                  <th className="py-2 font-medium">Select</th>
                </tr>
              </thead>
              <tbody>
                {videoFiles.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No videos uploaded yet
                    </td>
                  </tr>
                ) : (
                  videoFiles.map((file, index) => (
                    <tr key={file.id} className={`border-t border-gray-100 ${selectedFiles.video === file.id ? 'bg-blue-50' : ''}`}>
                      <td className="py-2 text-gray-600">{index + 1}.</td>
                      <td className="py-2 text-gray-600">{file.originalName || file.name}</td>
                      <td className="py-2">
                        <input
                          type="radio"
                          name="selectedVideo"
                          checked={selectedFiles.video === file.id}
                          onChange={() => handleSelectFile(file.id, "video")}
                          className="form-radio text-blue-500"
                          disabled={isUploading.video}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;