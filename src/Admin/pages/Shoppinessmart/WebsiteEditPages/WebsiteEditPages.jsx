import { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import UploadBanner from "./UploadBanner";
import UploadVideo from "./UploadVideo";
import UploadMembers from "./UploadMembers";
import WriteStory from "./WriteStory";
import { db } from "../../../../../firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
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
        
        // Create collections if they don't exist
        const collections = ['banners', 'videos', 'members', 'content'];
        const data = {};
        
        for (const collectionName of collections) {
          const collectionRef = collection(db, collectionName);
          const snapshot = await getDocs(collectionRef);
          
          if (collectionName === 'content') {
            // Handle special case for story content
            const storyDoc = snapshot.docs.find(doc => doc.id === 'story');
            data.story = storyDoc ? storyDoc.data().content : "";
          } else {
            // Handle media collections
            data[collectionName] = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
          }
        }
        
        setPageData(data);
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

  // Common function to update data that all components can use
  const updatePageData = async (collectionName, data, id = null) => {
    try {
      const itemId = id || `${Date.now()}`;
      const docRef = doc(db, collectionName, itemId);
      await setDoc(docRef, data);

      const updatedData = { id: itemId, ...data };
      
      // Update local state to reflect changes
      if (collectionName === 'content') {
        setPageData(prev => ({
          ...prev,
          story: data.content
        }));
      } else {
        setPageData(prev => ({
          ...prev,
          [collectionName]: [...prev[collectionName].filter(item => item.id !== itemId), updatedData]
        }));
      }
      
      toast.success("Successfully updated content");
      return true;
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      toast.error(`Failed to update content: ${error.message}`);
      return false;
    }
  };

  const deleteItem = async (collectionName, id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      
      // Update local state to reflect deletion
      setPageData(prev => ({
        ...prev,
        [collectionName]: prev[collectionName].filter(item => item.id !== id)
      }));
      
      toast.success("Item deleted successfully");
      return true;
    } catch (error) {
      console.error(`Error deleting from ${collectionName}:`, error);
      toast.error(`Failed to delete item: ${error.message}`);
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
        updateBanner={(data, id) => updatePageData('banners', data, id)}
        deleteBanner={(id) => deleteItem('banners', id)}
      />;
    } else if (selectedComponent.type === UploadVideo) {
      componentWithProps = <UploadVideo 
        videos={pageData.videos}
        updateVideo={(data, id) => updatePageData('videos', data, id)}
        deleteVideo={(id) => deleteItem('videos', id)}
      />;
    } else if (selectedComponent.type === UploadMembers) {
      componentWithProps = <UploadMembers 
        members={pageData.members}
        updateMember={(data, id) => updatePageData('members', data, id)}
        deleteMember={(id) => deleteItem('members', id)}
      />;
    } else if (selectedComponent.type === WriteStory) {
      componentWithProps = <WriteStory 
        story={pageData.story}
        updateStory={(content) => updatePageData('content', { content }, 'story')}
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