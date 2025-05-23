import { useState, useRef, useEffect } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineLoading3Quarters,
  AiOutlineDelete,
} from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import { storage, db } from "../../../../../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";

const UploadBanner = ({ banners: propsBanners = [], deleteBanner, section = "Home", refreshData }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [banners, setBanners] = useState(propsBanners);
  const fileInputRef = useRef(null);

  // Create collection name based on section
  const collectionName = `${section.toLowerCase().replace(/\s/g, "")}Banners`;
  
  // Fetch banners directly to ensure we have the latest data
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannersDocRef = doc(db, "content", collectionName);
        const docSnap = await getDoc(bannersDocRef);
        
        if (docSnap.exists()) {
          const items = docSnap.data().items || [];
          setBanners(items);
        } else {
          console.log(`No banners found for ${section}`);
          setBanners([]);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
        toast.error("Failed to load banners");
      }
    };

    fetchBanners();
    
    // Set up real-time listener for changes
    const bannersDocRef = doc(db, "content", collectionName);
    const unsubscribe = onSnapshot(
      bannersDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const items = docSnap.data().items || [];
          setBanners(items);
        } else {
          setBanners([]);
        }
      },
      (error) => {
        console.error("Error in banners listener:", error);
      }
    );

    // Cleanup listener
    return () => unsubscribe();
  }, [section, collectionName]);

  // Update local state when props change
  useEffect(() => {
    if (propsBanners && propsBanners.length > 0) {
      setBanners(propsBanners);
    }
  }, [propsBanners]);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, or GIF)');
      return false;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size exceeds 50MB limit');
      return false;
    }

    return true;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) {
      if (e.target) e.target.value = null;
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const timestamp = Date.now();
      const storageFilePath = `${section.toLowerCase().replace(/\s/g, "")}/banners/${timestamp}_${file.name}`;
      const storageRef = ref(storage, storageFilePath);

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
          try {
            // Upload completed successfully
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const bannerId = `${section.toLowerCase().replace(/\s/g, "")}_banner_${timestamp}`;
            const newBanner = {
              id: bannerId,
              name: file.name,
              url: downloadURL,
              path: uploadTask.snapshot.ref.fullPath,
              createdAt: new Date().toISOString(),
              type: file.type,
              section
            };

            const bannersDocRef = doc(db, "content", collectionName);
            const docSnap = await getDoc(bannersDocRef);
            
            const currentItems = docSnap.exists() ? docSnap.data().items || [] : [];
            const updatedItems = [...currentItems, newBanner];
            
            // Update or create the document with the banners array
            await setDoc(bannersDocRef, { items: updatedItems });
            
            // Update local state immediately for better UX
            setBanners(updatedItems);
            
            toast.success(`Banner uploaded successfully to ${collectionName}`);
            
            if (refreshData && typeof refreshData === 'function') {
              refreshData();
            }
          } catch (error) {
            console.error("Error saving banner metadata:", error);
            toast.error(`Failed to save banner metadata: ${error.message}`);
          } finally {
            if (fileInputRef.current) fileInputRef.current.value = null;
            setUploading(false);
          }
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

  const openDeleteModal = (banner, e) => {
    if (e) e.stopPropagation();
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setBannerToDelete(null);
    setDeleting(false);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    
    try {
      setDeleting(true);
      
      const storageRef = ref(storage, bannerToDelete.path);
      await deleteObject(storageRef);

      const bannersDocRef = doc(db, "content", collectionName);
      const docSnap = await getDoc(bannersDocRef);
      
      if (docSnap.exists()) {
        const currentItems = docSnap.data().items || [];
        const updatedItems = currentItems.filter(item => item.id !== bannerToDelete.id);
        
        await setDoc(bannersDocRef, { items: updatedItems });
        
        setBanners(updatedItems);
      }

      if (deleteBanner && typeof deleteBanner === 'function') {
        await deleteBanner(bannerToDelete.id);
      }
      
      if (refreshData && typeof refreshData === 'function') {
        refreshData();
      }
      
      if (selectedBanner?.id === bannerToDelete.id) {
        setSelectedBanner(null);
      }
      
      toast.success("Banner deleted successfully");
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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{section} / Upload Banner</h2>
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
            <span className="text-sm text-gray-500">{banners?.length || 0} banners</span>
          </div>

          {!banners || banners.length === 0 ? (
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
                    <th className="pb-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner, index) => (
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
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => openDeleteModal(banner, e)}
                        >
                          <AiOutlineDelete className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
            
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
                        Are you sure you want to delete "{bannerToDelete?.name}" from {section}? This action cannot be undone.
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
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" /> Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                  disabled={deleting}
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