import { useState, useRef, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { v4 as uuidv4 } from 'uuid';

function EditEvent({ event, onCancel, onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const [eventData, setEventData] = useState({
    id: event.id,
    title: event.title || '',
    date: event.date || '',
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    location: event.location || '',
    thumbnail: null,
    thumbnailURL: event.thumbnailURL || ''
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(event.thumbnailURL || null);
  const [originalThumbnailURL, setOriginalThumbnailURL] = useState(event.thumbnailURL || null);

  useEffect(() => {
    // Reset form if event changes
    if (event) {
      setEventData({
        id: event.id,
        title: event.title || '',
        date: event.date || '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        location: event.location || '',
        thumbnail: null,
        thumbnailURL: event.thumbnailURL || ''
      });
      setThumbnailPreview(event.thumbnailURL || null);
      setOriginalThumbnailURL(event.thumbnailURL || null);
    }
  }, [event]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }

    setEventData({ ...eventData, thumbnail: file });
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Create a synthetic event object
      const syntheticEvent = {
        target: {
          files: [file]
        }
      };
      
      handleFileChange(syntheticEvent);
    }
  };

  const validateForm = () => {
    if (!eventData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!eventData.date) {
      setError('Date is required');
      return false;
    }
    if (!eventData.startTime) {
      setError('Start time is required');
      return false;
    }
    if (!eventData.endTime) {
      setError('End time is required');
      return false;
    }
    if (!eventData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!eventData.thumbnail && !eventData.thumbnailURL) {
      setError('Thumbnail image is required');
      return false;
    }
    
    // Validate end time is after start time
    if (eventData.startTime >= eventData.endTime) {
      setError('End time must be after start time');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      let thumbnailURL = eventData.thumbnailURL;
      
      // Handle thumbnail changes
      if (eventData.thumbnail && typeof eventData.thumbnail !== 'string') {
        // Upload new image
        const fileId = uuidv4();
        const fileName = `${fileId}_${eventData.thumbnail.name}`;
        const storageRef = ref(storage, `events/${fileName}`);
        
        const uploadTask = uploadBytesResumable(storageRef, eventData.thumbnail);
        
        // Set up progress tracking
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload failed:', error);
            setError('Failed to upload image. Please try again.');
            setIsSubmitting(false);
          }
        );
        
        // Wait for upload to complete
        await uploadTask;
        thumbnailURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Delete old image if we had one and it's different
        if (originalThumbnailURL && originalThumbnailURL !== thumbnailURL) {
          try {
            const oldStorageRef = ref(storage, originalThumbnailURL);
            await deleteObject(oldStorageRef);
          } catch (deleteError) {
            console.error('Failed to delete old image:', deleteError);
            // Continue with update even if delete fails
          }
        }
      } else if (!eventData.thumbnailURL && originalThumbnailURL) {
        // Thumbnail was removed, delete from storage
        try {
          const oldStorageRef = ref(storage, originalThumbnailURL);
          await deleteObject(oldStorageRef);
        } catch (deleteError) {
          console.error('Failed to delete old image:', deleteError);
          // Continue with update even if delete fails
        }
      }
      
      // Update the document in Firestore
      const eventRef = doc(db, 'events', eventData.id);
      await updateDoc(eventRef, {
        title: eventData.title,
        date: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        location: eventData.location,
        thumbnailURL: thumbnailURL,
        updatedAt: serverTimestamp()
      });
      
      // Notify parent that update is complete
      if (onComplete) {
        onComplete({
          ...eventData,
          thumbnailURL: thumbnailURL
        });
      }
      
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  const removeThumbnail = () => {
    setEventData({ ...eventData, thumbnail: null, thumbnailURL: '' });
    setThumbnailPreview(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="edit-event-container p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title*
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            placeholder="Enter event title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date*
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.date}
            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time*
            </label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={eventData.startTime}
              onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time*
            </label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={eventData.endTime}
              onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location*
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            placeholder="Enter event location"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail Image*
          </label>
          
          <div
            className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {thumbnailPreview ? (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="mx-auto max-h-40 max-w-full rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeThumbnail();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-1 text-sm">Drag and drop an image here, or click to select</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <div className="relative pt-1">
              <div className="text-xs text-center mb-1">
                Uploading: {uploadProgress}%
              </div>
              <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEvent;