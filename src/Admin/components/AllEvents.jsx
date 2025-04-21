import { useState, useEffect } from 'react';
import { MdMoreVert, MdEdit, MdDelete } from 'react-icons/md';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../firebase';

function AllEvents({ onBackClick, onEditEvent }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
    
    // Close dropdown when clicking outside
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(eventsQuery);
      
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    if (onEditEvent) {
      onEditEvent(event);
    }
    setActiveDropdown(null);
  };

  const handleDeleteConfirm = (eventId) => {
    setConfirmDelete(eventId);
    setActiveDropdown(null);
  };

  const handleDelete = async (eventId) => {
    setIsDeleting(true);
    try {
      // Find the event to get its thumbnail URL
      const eventToDelete = events.find(event => event.id === eventId);
      
      if (eventToDelete && eventToDelete.thumbnailURL) {
        // Extract the path from the URL
        const storageRef = ref(storage, eventToDelete.thumbnailURL);
        
        try {
          // Try to delete the image
          await deleteObject(storageRef);
        } catch (imageError) {
          console.error('Error deleting image (continuing with event deletion):', imageError);
        }
      }
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'events', eventId));
      
      // Update local state
      setEvents(events.filter(event => event.id !== eventId));
      
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleDropdownToggle = (e, eventId) => {
    e.stopPropagation(); // Prevent triggering the outside click handler
    setActiveDropdown(activeDropdown === eventId ? null : eventId);
  };

  // Create placeholder image if thumbnail is missing
  const getImageUrl = (event) => {
    if (event.thumbnailURL) return event.thumbnailURL;
    return "/api/placeholder/800/500"; // Placeholder image
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
  <button
    onClick={onBackClick}
    className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
  >
    <span>←</span> Back to Create Event
  </button>

  <h1 className="text-2xl font-normal">All Events</h1>
</div>


      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">No events found. Create your first event!</p>
          <button
            onClick={onBackClick}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 text-sm">
                  {event.displayDate}
                </div>
                <div className="absolute top-2 right-2">
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="text-gray-600 bg-slate-200 rounded-full hover:text-gray-800 p-1"
                      onClick={(e) => handleDropdownToggle(e, event.id)}
                    >
                      <MdMoreVert size={20} />
                    </button>
                    
                    {activeDropdown === event.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 items-center"
                          onClick={() => handleEdit(event)}
                        >
                          <MdEdit className="mr-2" /> Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 items-center"
                          onClick={() => handleDeleteConfirm(event.id)}
                        >
                          <MdDelete className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <img
                  src={getImageUrl(event)}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/800/500"; // Fallback placeholder
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-orange-500 mb-2">{event.timeDisplay}</p>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                  {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-medium mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllEvents;