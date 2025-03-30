import { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import UploadBanner from "./UploadBanner";
import UploadVideo from "./UploadVideo";
import UploadMembers from "./UploadMembers";
import WriteStory from "./WriteStory";
import { db } from "../../../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const WebsiteEditPages = () => {
  const [openSections, setOpenSections] = useState({
    home: false,
    howItWorks: false,
    aboutUs: false,
  });
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [pageData, setPageData] = useState({
    banners: [],
    videos: [],
    members: [],
    story: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of all website data
    const fetchWebsiteData = async () => {
      try {
        setLoading(true);
        
        // Fetch banners from content/banners document
        const bannersDocRef = doc(db, 'content', 'banners');
        const bannersDoc = await getDoc(bannersDocRef);
        const bannersData = bannersDoc.exists() ? bannersDoc.data().items || [] : [];
        
        // Fetch videos from content/videos document
        const videosDocRef = doc(db, 'content', 'videos');
        const videosDoc = await getDoc(videosDocRef);
        const videosData = videosDoc.exists() ? videosDoc.data().items || [] : [];
        
        // Fetch story content from content/story document
        const storyDocRef = doc(db, 'content', 'story');
        const storyDoc = await getDoc(storyDocRef);
        const storyContent = storyDoc.exists() ? storyDoc.data().content : "";
        
        // Fetch members from content/members document
        const membersDocRef = doc(db, 'content', 'members');
        const membersDoc = await getDoc(membersDocRef);
        const membersData = membersDoc.exists() ? membersDoc.data().items || [] : [];
        
        setPageData({
          banners: bannersData,
          videos: videosData,
          members: membersData,
          story: storyContent
        });
      } catch (error) {
        console.error("Error fetching website data:", error);
        toast.error("Failed to load website data");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleItemClick = (component) => {
    setSelectedComponent(component);
  };

  const handleBack = () => {
    setSelectedComponent(null);
  };

  // Common function to update array-based content (banners, videos, members)
  const updateArrayContent = async (contentType, data, id = null) => {
    try {
      const itemId = id || `${Date.now()}`;
      const contentDocRef = doc(db, 'content', contentType);
      
      // Get current items
      const contentDoc = await getDoc(contentDocRef);
      const currentItems = contentDoc.exists() ? contentDoc.data().items || [] : [];
      
      let updatedItems;
      if (id) {
        // Update existing item
        updatedItems = currentItems.map(item => 
          item.id === id ? { ...data, id } : item
        );
      } else {
        // Add new item
        updatedItems = [...currentItems, { ...data, id: itemId }];
      }
      
      // Save back to Firestore
      await setDoc(contentDocRef, { items: updatedItems });
      
      // Update local state
      setPageData(prev => ({
        ...prev,
        [contentType]: updatedItems
      }));
      
      toast.success(`Successfully updated ${contentType}`);
      return true;
    } catch (error) {
      console.error(`Error updating ${contentType}:`, error);
      toast.error(`Failed to update ${contentType}: ${error.message}`);
      return false;
    }
  };

  // Function to delete from array-based content
  const deleteArrayItem = async (contentType, id) => {
    try {
      const contentDocRef = doc(db, 'content', contentType);
      
      // Get current items
      const contentDoc = await getDoc(contentDocRef);
      const currentItems = contentDoc.exists() ? contentDoc.data().items || [] : [];
      
      // Filter out the item to delete
      const updatedItems = currentItems.filter(item => item.id !== id);
      
      // Save back to Firestore
      await setDoc(contentDocRef, { items: updatedItems });
      
      // Update local state
      setPageData(prev => ({
        ...prev,
        [contentType]: updatedItems
      }));
      
      toast.success("Item deleted successfully");
      return true;
    } catch (error) {
      console.error(`Error deleting from ${contentType}:`, error);
      toast.error(`Failed to delete item: ${error.message}`);
      return false;
    }
  };

  // Function to update story content
  const updateStory = async (content) => {
    try {
      const storyDocRef = doc(db, 'content', 'story');
      await setDoc(storyDocRef, { content });
      
      setPageData(prev => ({
        ...prev,
        story: content
      }));
      
      toast.success("Story updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error(`Failed to update story: ${error.message}`);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (selectedComponent) {
    // Pass the appropriate data and update functions to each component
    let componentWithProps;
    
    if (selectedComponent.type === UploadBanner) {
      componentWithProps = <UploadBanner 
        banners={pageData.banners} 
        updateBanner={(data, id) => updateArrayContent('banners', data, id)}
        deleteBanner={(id) => deleteArrayItem('banners', id)}
      />;
    } else if (selectedComponent.type === UploadVideo) {
      componentWithProps = <UploadVideo 
        videos={pageData.videos}
        updateVideo={(data, id) => updateArrayContent('videos', data, id)}
        deleteVideo={(id) => deleteArrayItem('videos', id)}
      />;
    } else if (selectedComponent.type === UploadMembers) {
      componentWithProps = <UploadMembers 
        members={pageData.members}
        updateMember={(data, id) => updateArrayContent('members', data, id)}
        deleteMember={(id) => deleteArrayItem('members', id)}
      />;
    } else if (selectedComponent.type === WriteStory) {
      componentWithProps = <WriteStory 
        story={pageData.story}
        updateStory={updateStory}
      />;
    }

    return (
      <div className="p-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 mb-4"
        >
          ← Back
        </button>
        {componentWithProps}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Pages</h1>
      <div className="space-y-4 bg-white h-[600px] rounded-xl border shadow-md py-10 px-6 overflow-y-auto">
        {/* Home Section */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("home")}
          >
            <h2 className="text-lg font-medium">Home</h2>
            <div className="flex items-center">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                {pageData.banners.length} banners
              </span>
              {openSections.home ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </div>
          </div>
          {openSections.home && (
            <div className="p-4 border-t">
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => handleItemClick(<UploadBanner />)}
              >
                <AiOutlinePlus className="mr-2" /> Upload Banner image
              </div>
            </div>
          )}
        </div>

        {/* How it works Section */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("howItWorks")}
          >
            <h2 className="text-lg font-medium">How it works</h2>
            <div className="flex items-center">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                {pageData.videos.length} videos
              </span>
              {openSections.howItWorks ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </div>
          </div>
          {openSections.howItWorks && (
            <div className="p-4 border-t">
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => handleItemClick(<UploadVideo />)}
              >
                <AiOutlinePlus className="mr-2" /> How it works video
              </div>
            </div>
          )}
        </div>

        {/* About Us Section */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("aboutUs")}
          >
            <h2 className="text-lg font-medium">About Us</h2>
            <div className="flex items-center">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                {pageData.members.length} members
              </span>
              {openSections.aboutUs ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </div>
          </div>
          {openSections.aboutUs && (
            <div className="p-4 border-t space-y-2">
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => handleItemClick(<WriteStory />)}
              >
                <AiOutlinePlus className="mr-2" /> Write the story of this platform
              </div>
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => handleItemClick(<UploadMembers />)}
              >
                <AiOutlinePlus className="mr-2" /> Upload members image
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteEditPages;