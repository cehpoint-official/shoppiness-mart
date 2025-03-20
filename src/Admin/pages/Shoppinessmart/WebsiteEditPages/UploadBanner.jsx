import { useState, useRef } from 'react';
import { AiOutlineCloudUpload, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { storage } from '../../../../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';

const UploadBanner = ({ banners = [], updateBanner, deleteBanner }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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
            name: file.name,
            url: downloadURL,
            path: uploadTask.snapshot.ref.fullPath,
            createdAt: new Date().toISOString()
          };

          // Update Firestore
          const result = await updateBanner(newBanner);
          if (result && result.success) {
            toast.success('Banner uploaded successfully');
            if (fileInputRef.current) fileInputRef.current.value = null;
          }

          setUploading(false);
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

  const handleDelete = async (banner) => {
    if (window.confirm(`Are you sure you want to delete ${banner.name}?`)) {
      try {
        // First try to delete from storage
        try {
          const storageRef = ref(storage, banner.path);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.warn("Storage delete error:", storageError);
          // Continue with Firestore deletion even if storage deletion fails
        }
  
        // Then delete from Firestore
        const success = await deleteBanner(banner.id);
  
        if (success) {
          toast.success("Banner deleted successfully");
        } else {
          throw new Error("Failed to delete banner from database");
        }
      } catch (error) {
        console.error("Error deleting banner:", error);
        toast.error(`Delete failed: ${error.message}`);
      }
    }
  };

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
            <span className="text-sm text-gray-500">{banners.length} banners</span>
          </div>

          {banners.length === 0 ? (
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
                    <tr key={banner.id} className="border-t">
                      <td className="py-3">{index + 1}.</td>
                      <td className="py-3 text-gray-600">{banner.name}</td>
                      <td className="py-3">
                        <img
                          src={banner.url}
                          alt={banner.name}
                          className="h-8 w-12 object-cover rounded"
                        />
                      </td>
                      <td className="py-3">
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(banner)}
                        >
                          Delete
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
    </div>
  );
};

export default UploadBanner;