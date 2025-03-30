import page2 from "../assets/about1.png";
import about2 from "../assets/about2.png";
import OurEfforts from "../Components/OurEfforts";
import Loader from "../Components/Loader/Loader";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const AboutUs = () => {
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch the story content from Firebase
        const storyRef = doc(db, "content", "story");
        const storyDoc = await getDoc(storyRef);
        
        if (storyDoc.exists()) {
          const storyData = storyDoc.data();
          setStory(storyData.content || "");
        }
        
        // Fetch team members from Firebase
        const membersRef = doc(db, "content", "members");
        const membersDoc = await getDoc(membersRef);
        
        if (membersDoc.exists()) {
          const membersData = membersDoc.data();
          setMembers(membersData.items || []);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        // Set loading to false after content is fetched
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Function to split the story content into paragraphs
  const renderStoryParagraphs = () => {
    if (!story) {
      return (
        <p className="text-parapgraphColor">
          The story of our platform is coming soon. Stay tuned for updates on our journey!
        </p>
      );
    }

    // Split by newlines and filter out empty paragraphs
    const paragraphs = story.split('\n').filter(para => para.trim().length > 0);
    
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="text-parapgraphColor mb-4">
        {paragraph}
      </p>
    ));
  };

  return (
    <div>
      <div className="bg-white flex gap-12 justify-center items-center flex-wrap p-10">
        <div className="md:w-[500px] mt-6 ">
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            About Us
          </h1>
          <p className="text-parapgraphColor">
            At ShoppinessMart, we believe in the power of everyday actions to
            create extraordinary impact. Our platform transforms your routine
            online shopping into a meaningful contribution to the causes you
            care about, making it easier than ever to make a difference. Our
            mission is simple yet powerful: to enable everyone to support
            charitable causes effortlessly through their regular online
            shopping. We aim to build a community where generosity is integrated
            into daily life, fostering a culture of giving and compassion.
          </p>
        </div>

        <div className="mt-6">
          <img
            src={page2}
            alt="Loading..."
            className="w-[432px] h-[300px] rounded-lg"
          />
        </div>
      </div>
      
      <div className="flex justify-center items-center bg-backgreenColor my-10 py-10">
        <div className="p-6 max-w-4xl">
          <h1 className="text-3xl font-semibold font-slab text-center mb-4">
            Our Story
          </h1>
          {renderStoryParagraphs()}
        </div>
      </div>
      
      <OurEfforts />

      <div className="py-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-medium mb-2 font-slab ">
            Our Members
          </h1>
          <p className="text-sm text-parapgraphColor">
            Our members are passionate individuals dedicated to making a
          </p>
          <p className="text-sm text-parapgraphColor">
            difference through their everyday shopping
          </p>
        </div>

        <div className="flex justify-center gap-8 flex-wrap px-10 py-10 max-w-6xl mx-auto">
          {members.length > 0 ? (
            members.map((member) => (
              <div 
                key={member.id} 
                className="w-64 h-96 relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200"
              >
                <div className="h-72 overflow-hidden">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
                  <h3 className="font-bold text-xl text-gray-800">{member.name}</h3>
                  <p className="text-sm font-medium text-green-600">{member.title}</p>
                </div>
                {member.bio && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-600/90 to-green-800/90 text-white p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end rounded-xl">
                    <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                    <p className="text-sm font-medium text-green-200 mb-3">{member.title}</p>
                    <p className="text-sm leading-relaxed">{member.bio}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            // Fallback to static images if no members are found
            <>
              <div className="w-64 h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200">
                <img src={about2} alt="" className="w-full h-72 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-xl text-gray-800">Team Member</h3>
                  <p className="text-sm font-medium text-green-600">Position</p>
                </div>
              </div>
              <div className="w-64 h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200">
                <img src={about2} alt="" className="w-full h-72 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-xl text-gray-800">Team Member</h3>
                  <p className="text-sm font-medium text-green-600">Position</p>
                </div>
              </div>
              <div className="w-64 h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200">
                <img src={about2} alt="" className="w-full h-72 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-xl text-gray-800">Team Member</h3>
                  <p className="text-sm font-medium text-green-600">Position</p>
                </div>
              </div>
              <div className="w-64 h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200">
                <img src={about2} alt="" className="w-full h-72 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-xl text-gray-800">Team Member</h3>
                  <p className="text-sm font-medium text-green-600">Position</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;