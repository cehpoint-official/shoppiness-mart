import { useState, useRef } from 'react';
import { 
  AiOutlineCloudUpload, 
  AiOutlineLoading3Quarters,
  AiOutlineSave,
  AiOutlineDelete
} from 'react-icons/ai';
import { storage, db } from '../../../../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import  toast  from 'react-hot-toast';

const UploadBanner = ({ banners = [], updateBanner, deleteBanner }) => {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [pendingBanners, setPendingBanners] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, or GIF)');
      return false;
    }

    // Validate file size (50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast.error('File size exceeds 50MB limit');
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
      const storageRef = ref(storage, `banners/${Date.now()}_${file.name}`);

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

          // Create banner object
          const newBanner = {
            id: `temp_${Date.now()}`,
            name: file.name,
            url: downloadURL,
            path: uploadTask.snapshot.ref.fullPath,
            createdAt: new Date().toISOString(),
            type: file.type,
            pendingSave: true
          };

          // Add to pending banners
          setPendingBanners(prev => [...prev, newBanner]);
          
          if (fileInputRef.current) fileInputRef.current.value = null;
          setUploading(false);
          
          // Automatically select the newly uploaded banner
          setSelectedBanner(newBanner);
        }
      );
    } catch (error) {
      console.error("Error uploading banner:", error);
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

  const handleCancel = (bannerId, e) => {
    if (e) e.stopPropagation(); // Prevent row selection when canceling
    setPendingBanners(prev => prev.filter(banner => banner.id !== bannerId));
    
    // If the canceled banner was selected, deselect it
    if (selectedBanner && selectedBanner.id === bannerId) {
      setSelectedBanner(null);
    }
  };

  const handleSave = async (e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    
    if (!selectedBanner) {
      toast.error("Please select a banner to save");
      return;
    }

    try {
      setSaving(true);
      
      // Reference to the banners document in the content collection
      const bannersDocRef = doc(db, "content", "banners");
      
      // Create the banner object to save (omit pendingSave property)
      const { pendingSave, ...bannerData } = selectedBanner;
      const bannerToSave = {
        ...bannerData,
        id: selectedBanner.pendingSave ? `banner_${Date.now()}` : selectedBanner.id // Generate a real ID if it's a temp one
      };
      
      // Check if the document exists
      const docSnap = await getDoc(bannersDocRef);
      
      if (docSnap.exists()) {
        // Get current banners array
        const currentData = docSnap.data();
        const updatedBanners = currentData.banners ? [...currentData.banners, bannerToSave] : [bannerToSave];
        
        // Update the document with the new array
        await updateDoc(bannersDocRef, {
          banners: updatedBanners
        });
      } else {
        // Create the document with an initial banners array
        await setDoc(bannersDocRef, {
          banners: [bannerToSave]
        });
      }
      
      toast.success('Banner saved successfully to content/banners');
      
      // Remove from pending after successful save
      if (selectedBanner.pendingSave) {
        setPendingBanners(prev => prev.filter(banner => banner.id !== selectedBanner.id));
      }
      
      // Update locally if needed
      if (updateBanner && typeof updateBanner === 'function') {
        await updateBanner(bannerToSave);
      }
      
      setSelectedBanner(null);
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error(`Save error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (banner, e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    
    if (!banner) {
      banner = selectedBanner;
    }
    
    if (!banner) {
      toast.error("Please select a banner to delete");
      return;
    }
    
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setBannerToDelete(null);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    
    try {
      // First try to delete from storage
      try {
        const storageRef = ref(storage, bannerToDelete.path);
        await deleteObject(storageRef);
      } catch (storageError) {
        console.warn("Storage delete error:", storageError);
        // Continue with Firestore deletion even if storage deletion fails
      }

      // If it's a pending banner, just remove it from the pending list
      if (bannerToDelete.pendingSave) {
        setPendingBanners(prev => prev.filter(banner => banner.id !== bannerToDelete.id));
        toast.success("Banner deleted successfully");
      } else {
        // Reference to the banners document in the content collection
        const bannersDocRef = doc(db, "content", "banners");
        
        // Get current banners
        const docSnap = await getDoc(bannersDocRef);
        
        if (docSnap.exists()) {
          const currentBanners = docSnap.data().banners || [];
          // Filter out the banner to delete
          const updatedBanners = currentBanners.filter(banner => banner.id !== bannerToDelete.id);
          
          // Update the document with the filtered array
          await updateDoc(bannersDocRef, {
            banners: updatedBanners
          });
          
          // Call the deleteBanner function if available (for local state update)
          if (deleteBanner && typeof deleteBanner === 'function') {
            await deleteBanner(bannerToDelete.id);
          }
          
          toast.success("Banner deleted successfully from content/banners");
        }
      }
      
      // If the deleted banner was selected, deselect it
      if (selectedBanner && selectedBanner.id === bannerToDelete.id) {
        setSelectedBanner(null);
      }
      
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error(`Delete failed: ${error.message}`);
      closeDeleteModal();
    }
  };

  const handleSelectBanner = (banner) => {
    setSelectedBanner(banner.id === selectedBanner?.id ? null : banner);
  };

  // Combine saved banners and pending banners for display
  const allBanners = [...banners, ...pendingBanners];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Home / Upload Banner</h2>
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
                    accept="image/jpeg,image/png,image/gif"
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
              Please upload an image (JPG, PNG, GIF) with dimensions<br />
              851 x 315 pixels and a maximum file size of 50 MB.
            </p>
          </div>
        </div>

        <div className="border bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Uploaded Banners</h3>
            <span className="text-sm text-gray-500">{allBanners.length} banners</span>
          </div>

          {allBanners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No banners uploaded yet
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
                  {allBanners.map((banner, index) => (
                    <tr 
                      key={banner.id} 
                      className={`border-t ${selectedBanner?.id === banner.id ? 'bg-blue-50' : ''}`}
                      onClick={() => handleSelectBanner(banner)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="py-3">{index + 1}.</td>
                      <td className="py-3 text-gray-600">{banner.name}</td>
                      <td className="py-3">
                        <img
                          src={banner.url}
                          alt={banner.name}
                          className="h-8 w-12 object-cover rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="py-3">
                        {banner.pendingSave ? (
                          <span className="text-yellow-500">Pending</span>
                        ) : (
                          <span className="text-green-500">Saved</span>
                        )}
                      </td>
                      <td className="py-3">
                        {banner.pendingSave && (
                          <button
                            className="text-red-500 hover:text-red-600"
                            onClick={(e) => handleCancel(banner.id, e)}
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
            selectedBanner && !saving ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleSave}
          disabled={!selectedBanner || saving}
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
            selectedBanner ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={(e) => openDeleteModal(null, e)}
          disabled={!selectedBanner}
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Banner</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{bannerToDelete?.name}"? This action cannot be undone.
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

export default UploadBanner;