import { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../../../firebase';

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
  { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: 'text-blue-400' },
];

const MainSocialmedia = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [editingLinks, setEditingLinks] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch social media links from Firestore
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        const socialMediaCollection = collection(db, 'socialMedia');
        const socialMediaSnapshot = await getDocs(socialMediaCollection);
        const socialMediaList = socialMediaSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          url: doc.data().url || '' // Ensure URL is never undefined
        }));
        
        setLinks(socialMediaList);
      } catch (err) {
        console.error('Error fetching social media links:', err);
        setError('Failed to load social media links');
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  // Validate URL format
  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Check if platform already exists
  const platformExists = (platformId) => {
    return links.some(link => link.platform === platformId);
  };

  // Handle selecting a platform
  const handleSelectPlatform = (platformId) => {
    setSelectedPlatform(platformId);
    setIsDropdownOpen(false);
  };

  // Handle adding a new link
  const handleAddLink = async () => {
    if (!selectedPlatform) {
      showNotification('Please select a platform', 'error');
      return;
    }

    if (platformExists(selectedPlatform)) {
      showNotification('This platform is already added', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const newLink = {
        platform: selectedPlatform,
        url: '',
        isConnected: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'socialMedia'), newLink);
      
      setLinks([...links, { ...newLink, id: docRef.id }]);
      setSelectedPlatform('');
      showNotification('Platform added successfully', 'success');
    } catch (err) {
      console.error('Error adding link:', err);
      showNotification('Failed to add platform', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a link's URL
  const handleUpdateLink = async (id, url) => {
    if (!url.trim()) {
      showNotification('URL cannot be empty', 'error');
      return;
    }

    if (!isValidUrl(url)) {
      showNotification('Please enter a valid URL', 'error');
      return;
    }

    try {
      setLoading(true);
      const linkRef = doc(db, 'socialMedia', id);
      
      await updateDoc(linkRef, {
        url: url,
        isConnected: true,
        updatedAt: serverTimestamp()
      });
      
      // Update the local state with the new URL
      setLinks(links.map(link => 
        link.id === id ? { ...link, url: url, isConnected: true } : link
      ));
      
      // Clear the editing state for this link
      const newEditingLinks = { ...editingLinks };
      delete newEditingLinks[id];
      setEditingLinks(newEditingLinks);
      
      showNotification('Link connected successfully', 'success');
    } catch (err) {
      console.error('Error updating link:', err);
      showNotification('Failed to connect link', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a link
  const handleRemoveLink = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'socialMedia', id));
      
      const newLinks = links.filter(link => link.id !== id);
      setLinks(newLinks);
      showNotification('Platform removed successfully', 'success');
    } catch (err) {
      console.error('Error removing link:', err);
      showNotification('Failed to remove platform', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const getPlatformIcon = (platformId) => {
    const platform = socialPlatforms.find(p => p.id === platformId);
    const Icon = platform?.icon || RxCross1;
    return <Icon className={`w-6 h-6 ${platform?.color || 'text-gray-600'}`} />;
  };

  const getPlatformName = (platformId) => {
    return socialPlatforms.find(p => p.id === platformId)?.name || platformId;
  };

  const getAvailablePlatforms = () => {
    return socialPlatforms.filter(platform => 
      !links.some(link => link.platform === platform.id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Social Media</h2>
        
        {/* Notification */}
        {notification.show && (
          <div className={`mb-4 p-3 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {loading && links.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <>
              {/* Links List */}
              {links.map((link) => (
                <div key={link.id} className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-3 min-w-[140px]">
                    {getPlatformIcon(link.platform)}
                    <span className="font-medium">{getPlatformName(link.platform)}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Add link"
                    value={editingLinks[link.id] !== undefined ? editingLinks[link.id] : link.url}
                    onChange={(e) => setEditingLinks({...editingLinks, [link.id]: e.target.value})}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={() => handleUpdateLink(link.id, editingLinks[link.id] !== undefined ? editingLinks[link.id] : link.url)}
                    disabled={loading}
                    className={`px-6 py-2 ${link.isConnected ? 'bg-green-600' : 'bg-blue-600'} text-white rounded-lg hover:${link.isConnected ? 'bg-green-700' : 'bg-blue-700'} transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {link.isConnected ? 'Connected' : 'Connect'}
                  </button>
                  <button
                    onClick={() => handleRemoveLink(link.id)}
                    disabled={loading}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <RxCross1 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              ))}

              {/* Add New Link Section - Only show if there are available platforms */}
              {getAvailablePlatforms().length > 0 && (
                <>
                  {/* Platform selection dropdown */}
                  {isDropdownOpen ? (
                    <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {getAvailablePlatforms().map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => handleSelectPlatform(platform.id)}
                          disabled={loading}
                          className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <platform.icon className={`w-5 h-5 ${platform.color}`} />
                          <span>{platform.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : selectedPlatform ? (
                    <div className="mt-4 flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-3 min-w-[140px]">
                        {getPlatformIcon(selectedPlatform)}
                        <span className="font-medium">{getPlatformName(selectedPlatform)}</span>
                      </div>
                      <button
                        onClick={handleAddLink}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Platform
                      </button>
                      <button
                        onClick={() => setSelectedPlatform('')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <RxCross1 className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsDropdownOpen(true)}
                      disabled={loading}
                      className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      + Add new social link
                    </button>
                  )}
                </>
              )}

              {getAvailablePlatforms().length === 0 && links.length > 0 && (
                <div className="text-gray-500 text-center py-2">
                  All available platforms have been added
                </div>
              )}

              {links.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No social media platforms added yet</p>
                  <button
                    onClick={() => setIsDropdownOpen(true)}
                    disabled={loading}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add your first platform
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSocialmedia;