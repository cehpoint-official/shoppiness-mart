import { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { v4 as uuidv4 } from 'uuid';

function CreateEvent({ onViewAllClick, editEvent = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const [eventData, setEventData] = useState(
    editEvent || {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      thumbnail: null,
      thumbnailURL: ''
    }
  );

  const [thumbnailPreview, setThumbnailPreview] = useState(editEvent?.thumbnailURL || null);

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

      // Upload new image if it exists
      if (eventData.thumbnail && typeof eventData.thumbnail !== 'string') {
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
      }

      // Format time for display
      const formattedStartTime = formatTime(eventData.startTime);
      const formattedEndTime = formatTime(eventData.endTime);
      const timeDisplay = `${formattedStartTime} - ${formattedEndTime}`;

      // Format date for display (DD MMM format)
      const dateObj = new Date(eventData.date);
      const formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });


      // Prepare event data
      const eventDataToSave = {
        title: eventData.title,
        date: eventData.date, // Original date for sorting
        displayDate: formattedDate, // Formatted date for display
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        timeDisplay: timeDisplay,
        location: eventData.location,
        thumbnailURL: thumbnailURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Save to Firestore
      if (editEvent?.id) {
        // Update logic (to be implemented in EditEvent component)
      } else {
        await addDoc(collection(db, 'events'), eventDataToSave);
      }

      // Reset form
      setEventData({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        thumbnail: null,
        thumbnailURL: ''
      });
      setThumbnailPreview(null);

      // Navigate to all events view
      onViewAllClick();

    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Format time from 24h to 12h format with AM/PM
  const formatTime = (time24h) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-normal">Create a New Event</h1>
        <button
          onClick={onViewAllClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={isSubmitting}
        >
          View All Events
        </button>
      </div>

      <h1 className="text-xl text-gray-600 mb-8">Create a event Schedule</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg p-8 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={eventData.startTime}
                    onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={eventData.endTime}
                    onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Thumbnail</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover mb-4 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThumbnailPreview(null);
                        setEventData({ ...eventData, thumbnail: null, thumbnailURL: '' });
                      }}
                      className="text-red-500 hover:text-red-600"
                      disabled={isSubmitting}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 mb-2">Drag & Drop or Click</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended size 800×500
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={isSubmitting}
                />
              </div>

              {isSubmitting && uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-right">
            <button
              type="submit"
              className={`bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create a Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;