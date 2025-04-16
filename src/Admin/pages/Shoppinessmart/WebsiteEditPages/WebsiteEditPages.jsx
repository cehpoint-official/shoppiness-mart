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
    registerBusiness: false,
    onlineShops: false,
    supportMaast: false,
  });
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [pageData, setPageData] = useState({
    homeBanners: [],
    homeVideos: [],
    howItWorksVideos: [],
    registerBusinessVideos: [],
    members: [],
    story: "",
    onlineShopsBanners: [],
    supportMaastBanners: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key

  const fetchWebsiteData = async () => {
    try {
      setLoading(true);

      const fetchContent = async (docName) => {
        const docRef = doc(db, "content", docName);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().items || [] : [];
      };

      const [
        homeBanners,
        homeVideos,
        howItWorksVideos,
        registerBusinessVideos,
        members,
        storyDoc,
        onlineShopsBanners,
        supportMaastBanners,
      ] = await Promise.all([
        fetchContent("homeBanners"),
        fetchContent("homeVideos"),
        fetchContent("howitworksVideos"),
        fetchContent("registerbusinessVideos"),
        fetchContent("members"),
        getDoc(doc(db, "content", "story")),
        fetchContent("onlineshopsBanners"),
        fetchContent("supportmaastBanners"),
      ]);

      setPageData({
        homeBanners,
        homeVideos,
        howItWorksVideos,
        registerBusinessVideos,
        members,
        story: storyDoc.exists() ? storyDoc.data().content : "",
        onlineShopsBanners,
        supportMaastBanners,
      });
    } catch (error) {
      console.error("Error fetching website data:", error);
      toast.error("Failed to load website data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsiteData();
  }, [refreshKey]); // Add refreshKey as dependency

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
    setRefreshKey((prev) => prev + 1); // Refresh data when going back
  };

  const updateArrayContent = async (contentType, data) => {
    try {
      const itemId = `${Date.now()}`;
      const contentDocRef = doc(db, "content", contentType);
      const contentDoc = await getDoc(contentDocRef);
      const currentItems = contentDoc.exists()
        ? contentDoc.data().items || []
        : [];

      const updatedItems = [...currentItems, { ...data, id: itemId }];

      await setDoc(contentDocRef, { items: updatedItems });

      setRefreshKey((prev) => prev + 1); // Refresh data after update
      toast.success(`Successfully added to ${contentType}`);
      return true;
    } catch (error) {
      console.error(`Error updating ${contentType}:`, error);
      toast.error(`Failed to update ${contentType}`);
      return false;
    }
  };

  const deleteArrayItem = async (contentType, id) => {
    try {
      const contentDocRef = doc(db, "content", contentType);
      const contentDoc = await getDoc(contentDocRef);
      const currentItems = contentDoc.exists()
        ? contentDoc.data().items || []
        : [];
      const updatedItems = currentItems.filter((item) => item.id !== id);

      await setDoc(contentDocRef, { items: updatedItems });

      setRefreshKey((prev) => prev + 1); // Refresh data after deletion
      toast.success("Item deleted successfully");
      return true;
    } catch (error) {
      console.error(`Error deleting from ${contentType}:`, error);
      toast.error("Failed to delete item");
      return false;
    }
  };

  const updateStory = async (content) => {
    try {
      const storyDocRef = doc(db, "content", "story");
      await setDoc(storyDocRef, { content });
      setRefreshKey((prev) => prev + 1); // Refresh data after update
      toast.success("Story updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error("Failed to update story");
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
    const componentMap = {
      // Reusable Banner components for different sections
      UploadHomeBanner: (
        <UploadBanner
          banners={pageData.homeBanners}
          deleteBanner={(id) => deleteArrayItem("homeBanners", id)}
          refreshData={() => setRefreshKey((prev) => prev + 1)}
          section="Home"
        />
      ),
      UploadOnlineShopsBanner: (
        <UploadBanner
          banners={pageData.onlineShopsBanners}
          deleteBanner={(id) => deleteArrayItem("onlineShopsBanners", id)}
          refreshData={() => setRefreshKey((prev) => prev + 1)}
          section="Online Shops"
        />
      ),
      UploadSupportMaastBanner: (
        <UploadBanner
          banners={pageData.supportMaastBanners}
          deleteBanner={(id) => deleteArrayItem("supportMaastBanners", id)}
          refreshData={() => setRefreshKey((prev) => prev + 1)}
          section="Support Maast"
        />
      ),
      // Video components
      UploadVideoHome: (
        <UploadVideo
          videos={pageData.homeVideos}
          deleteVideo={(id) => deleteArrayItem("homeVideos", id)}
          section="Home"
          refreshData={() => setRefreshKey((prev) => prev + 1)}
        />
      ),
      UploadVideoHowItWorks: (
        <UploadVideo
          videos={pageData.howItWorksVideos}
          deleteVideo={(id) => deleteArrayItem("howitworksVideos", id)}
          section="How It Works"
          refreshData={() => setRefreshKey((prev) => prev + 1)}
        />
      ),
      UploadVideoRegisterBusiness: (
        <UploadVideo
          videos={pageData.registerBusinessVideos}
          deleteVideo={(id) => deleteArrayItem("registerbusinessVideos", id)}
          section="Register Business"
          refreshData={() => setRefreshKey((prev) => prev + 1)}
        />
      ),
      UploadMembers: (
        <UploadMembers
          members={pageData.members}
          updateMember={(data) => updateArrayContent("members", data)}
          deleteMember={(id) => deleteArrayItem("members", id)}
        />
      ),
      WriteStory: (
        <WriteStory story={pageData.story} updateStory={updateStory} />
      ),
    };

    return (
      <div className="p-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 mb-4"
        >
          ← Back
        </button>
        {componentMap[selectedComponent.type]}
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
            <div className="flex items-center space-x-2">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {pageData.homeBanners.length} banners  
              </span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {pageData.homeVideos.length} videos
              </span>
              {openSections.home ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </div>
          </div>
          {openSections.home && (
            <div className="p-4 border-t space-y-2">
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => handleItemClick({ type: "UploadHomeBanner" })}
              >
                <AiOutlinePlus className="mr-2" /> Upload Banner image
              </div>
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => handleItemClick({ type: "UploadVideoHome" })}
              >
                <AiOutlinePlus className="mr-2" /> Upload Home Video
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
                {pageData.howItWorksVideos.length} videos
              </span>
              {openSections.howItWorks ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </div>
          </div>
          {openSections.howItWorks && (
            <div className="p-4 border-t">
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() =>
                  handleItemClick({ type: "UploadVideoHowItWorks" })
                }
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
                onClick={() => handleItemClick({ type: "WriteStory" })}
              >
                <AiOutlinePlus className="mr-2" /> Write the story of this
                platform
              </div>
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => handleItemClick({ type: "UploadMembers" })}
              >
                <AiOutlinePlus className="mr-2" /> Upload members image
              </div>
            </div>
          )}
        </div>

        {/* Register Business/Service Section */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("registerBusiness")}
          >
            <h2 className="text-lg font-medium">Register Business/Service</h2>
            <div className="flex items-center">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                {pageData.registerBusinessVideos.length} videos
              </span>
              {openSections.registerBusiness ? (
                <AiOutlineMinus />
              ) : (
                <AiOutlinePlus />
              )}
            </div>
          </div>
          {openSections.registerBusiness && (
            <div className="p-4 border-t">
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() =>
                  handleItemClick({ type: "UploadVideoRegisterBusiness" })
                }
              >
                <AiOutlinePlus className="mr-2" /> Register Business Video
              </div>
            </div>
          )}
        </div>

        {/* Online Shops Section */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("onlineShops")}
          >
            <h2 className="text-lg font-medium">Online Shops</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {pageData.onlineShopsBanners.length} banners
              </span>
              {openSections.onlineShops ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </div>
          </div>
          {openSections.onlineShops && (
            <div className="p-4 border-t space-y-2">
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => handleItemClick({ type: "UploadOnlineShopsBanner" })}
              >
                <AiOutlinePlus className="mr-2" /> Upload Online Shops Banner
              </div>
            </div>
          )}
        </div>

        {/* Support Maast Section */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("supportMaast")}
          >
            <h2 className="text-lg font-medium">Support Maast</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {pageData.supportMaastBanners.length} banners
              </span>
              {openSections.supportMaast ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </div>
          </div>
          {openSections.supportMaast && (
            <div className="p-4 border-t space-y-2">
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => handleItemClick({ type: "UploadSupportMaastBanner" })}
              >
                <AiOutlinePlus className="mr-2" /> Upload Support Maast Banner
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteEditPages;