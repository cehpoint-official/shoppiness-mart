import { useState, useRef } from 'react';
import { 
  AiOutlineCloudUpload, 
  AiOutlineLoading3Quarters, 
  AiOutlinePlayCircle,
  AiOutlineSave,
  AiOutlineDelete 
} from 'react-icons/ai';
import { storage, db } from '../../../../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import  toast  from 'react-hot-toast';

const UploadVideo = ({ videos = [], updateVideo, deleteVideo }) => {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [pendingVideos, setPendingVideos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, AVI, or MOV)');
      return false;
    }

    // Validate file size (150MB)
    const maxSize = 150 * 1024 * 1024; // 150MB in bytes
    if (file.size > maxSize) {
      toast.error('File size exceeds 150MB limit');
      return false;
    }

    return true;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = null;
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // Create a storage reference
      const storageRef = ref(storage, `videos/${Date.now()}_${file.name}`);

      // Upload file with progress monitoring
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(progress));
        },
        (error) => {
          toast.error(`Upload failed: ${error.message}`);
          setUploading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Create video object
          const newVideo = {
            id: `temp_${Date.now()}`,
            name: file.name,
            url: downloadURL,
            path: uploadTask.snapshot.ref.fullPath,
            createdAt: new Date().toISOString(),
            type: file.type,
            pendingSave: true
          };

          // Add to pending videos
          setPendingVideos(prev => [...prev, newVideo]);
          
          if (fileInputRef.current) fileInputRef.current.value = null;
          setUploading(false);
          
          // Automatically select the newly uploaded video
          setSelectedVideo(newVideo);
        }
      );
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error(`Upload error: ${error.message}`);
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileChange({ target: { files: dataTransfer.files } });
    }
  };

  const handleCancel = (videoId, e) => {
    if (e) e.stopPropagation(); // Prevent row selection when canceling
    setPendingVideos(prev => prev.filter(video => video.id !== videoId));
    
    // If the canceled video was selected, deselect it
    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo(null);
    }
  };

  const handleSave = async (e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    
    if (!selectedVideo) {
      toast.error("Please select a video to save");
      return;
    }

    try {
      setSaving(true);
      
      // Reference to the videos document in the content collection
      const videosDocRef = doc(db, "content", "videos");
      
      // Create the video object to save (omit pendingSave property)
      const { pendingSave, ...videoData } = selectedVideo;
      const videoToSave = {
        ...videoData,
        id: selectedVideo.pendingSave ? `video_${Date.now()}` : selectedVideo.id // Generate a real ID if it's a temp one
      };
      
      // Check if the document exists
      const docSnap = await getDoc(videosDocRef);
      
      if (docSnap.exists()) {
        // Get current videos array
        const currentData = docSnap.data();
        const updatedVideos = currentData.videos ? [...currentData.videos, videoToSave] : [videoToSave];
        
        // Update the document with the new array
        await updateDoc(videosDocRef, {
          videos: updatedVideos
        });
      } else {
        // Create the document with an initial videos array
        await setDoc(videosDocRef, {
          videos: [videoToSave]
        });
      }
      
      toast.success('Video saved successfully to content/videos');
      
      // Remove from pending after successful save
      if (selectedVideo.pendingSave) {
        setPendingVideos(prev => prev.filter(video => video.id !== selectedVideo.id));
      }
      
      // Update locally if needed
      if (updateVideo && typeof updateVideo === 'function') {
        await updateVideo(videoToSave);
      }
      
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error(`Save error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (video, e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    
    if (!video) {
      video = selectedVideo;
    }
    
    if (!video) {
      toast.error("Please select a video to delete");
      return;
    }
    
    setVideoToDelete(video);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setVideoToDelete(null);
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;
    
    try {
      // First try to delete from storage
      try {
        const storageRef = ref(storage, videoToDelete.path);
        await deleteObject(storageRef);
      } catch (storageError) {
        console.warn("Storage delete error:", storageError);
        // Continue with Firestore deletion even if storage deletion fails
      }

      // If it's a pending video, just remove it from the pending list
      if (videoToDelete.pendingSave) {
        setPendingVideos(prev => prev.filter(video => video.id !== videoToDelete.id));
        toast.success("Video deleted successfully");
      } else {
        // Reference to the videos document in the content collection
        const videosDocRef = doc(db, "content", "videos");
        
        // Get current videos
        const docSnap = await getDoc(videosDocRef);
        
        if (docSnap.exists()) {
          const currentVideos = docSnap.data().videos || [];
          // Filter out the video to delete
          const updatedVideos = currentVideos.filter(video => video.id !== videoToDelete.id);
          
          // Update the document with the filtered array
          await updateDoc(videosDocRef, {
            videos: updatedVideos
          });
          
          // Call the deleteVideo function if available (for local state update)
          if (deleteVideo && typeof deleteVideo === 'function') {
            await deleteVideo(videoToDelete.id);
          }
          
          toast.success("Video deleted successfully from content/videos");
        }
      }
      
      // If the deleted video was selected, deselect it
      if (selectedVideo && selectedVideo.id === videoToDelete.id) {
        setSelectedVideo(null);
      }
      
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error(`Delete failed: ${error.message}`);
      closeDeleteModal();
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video.id === selectedVideo?.id ? null : video);
  };

  // Combine saved videos and pending videos for display
  const allVideos = [...videos, ...pendingVideos];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">How it works / Upload Video</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="border bg-white shadow-md rounded-lg p-8 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            {uploading ? (
              <div className="flex flex-col items-center">
                <AiOutlineLoading3Quarters className="text-4xl text-blue-500 animate-spin" />
                <p className="mt-2">{progress}% Uploading...</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <AiOutlineCloudUpload className="text-4xl text-gray-400" />
                <div>
                  <p className="font-medium">Drag and Drop</p>
                  <p className="text-gray-500">Or</p>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="video/mp4,video/avi,video/quicktime,video/x-msvideo"
                  />
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse
                  </button>
                </div>
              </>
            )}
            <p className="text-sm text-gray-500">
              Please upload Video (AVI, MP4, or MOV) with dimensions<br />
              851 x 315 pixels and a maximum file size of 150 MB.
            </p>
          </div>
        </div>

        <div className="border bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Uploaded Videos</h3>
            <span className="text-sm text-gray-500">{allVideos.length} videos</span>
          </div>

          {allVideos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No videos uploaded yet
            </div>
          ) : (
            <div className="overflow-y-auto max-h-96">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-4">#</th>
                    <th className="pb-4">File name</th>
                    <th className="pb-4">Preview</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allVideos.map((video, index) => (
                    <tr 
                      key={video.id} 
                      className={`border-t ${selectedVideo?.id === video.id ? 'bg-blue-50' : ''}`}
                      onClick={() => handleSelectVideo(video)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="py-3">{index + 1}.</td>
                      <td className="py-3 text-gray-600">{video.name}</td>
                      <td className="py-3">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <AiOutlinePlayCircle className="text-2xl" />
                        </a>
                      </td>
                      <td className="py-3">
                        {video.pendingSave ? (
                          <span className="text-yellow-500">Pending</span>
                        ) : (
                          <span className="text-green-500">Saved</span>
                        )}
                      </td>
                      <td className="py-3">
                        {video.pendingSave && (
                          <button
                            className="text-red-500 hover:text-red-600"
                            onClick={(e) => handleCancel(video.id, e)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Save and Delete buttons with icons */}
      <div className="flex justify-end space-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded flex items-center ${
            selectedVideo && !saving ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleSave}
          disabled={!selectedVideo || saving}
        >
          {saving ? (
            <>
              <AiOutlineLoading3Quarters className="mr-2 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <AiOutlineSave className="mr-2" /> Save
            </>
          )}
        </button>
        <button
          className={`px-4 py-2 rounded flex items-center ${
            selectedVideo ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={(e) => openDeleteModal(null, e)}
          disabled={!selectedVideo}
        >
          <AiOutlineDelete className="mr-2" /> Delete
        </button>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AiOutlineDelete className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Video</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{videoToDelete?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadVideo;