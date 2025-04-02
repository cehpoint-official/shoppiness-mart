import FAQ from "../Components/FAQ";
import OurEfforts from "../Components/OurEfforts";
import PopularCauses from "../Components/PopularCauses/PopularCauses";
import headerImg from "../assets/SupportMaast/header.png";
import page2 from "../assets/SupportMaast/page2.png";
import page3 from "../assets/SupportMaast/page3.png";
import { useState, useEffect } from "react";
import DonationDialog from "../Components/DonationDialog";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CalendarDays, Clock, MapPin } from "lucide-react";

const SupportMasst = () => {
  document.title = "Support Maast - Shopiness";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerImage, setBannerImage] = useState(headerImg);

  // Fetch banner image from Firebase
  useEffect(() => {
    const fetchBannerImage = async () => {
      try {
        const bannerDocRef = doc(db, "maast", "banners");
        const bannerDocSnap = await getDoc(bannerDocRef);
        
        if (bannerDocSnap.exists()) {
          const bannerData = bannerDocSnap.data();
          // Check if the banners document contains items and if there's at least one image
          if (bannerData.items && bannerData.items.length > 0 && bannerData.items[0].url) {
            setBannerImage(bannerData.items[0].url);
          }
        }
      } catch (error) {
        console.error("Error fetching banner image:", error);
        // If there's an error, we'll keep using the default headerImg
      }
    };

    fetchBannerImage();
  }, []);

  // Fetch events from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort events by displayDate (earlier dates first)
        // This assumes displayDate is in a format that can be compared lexicographically
        // If displayDate is not in a sortable format, you may need to parse it to Date objects
        const sortedEvents = eventsList.sort((a, b) => {
          // Try to parse dates if they're in a standard format
          const dateA = new Date(a.displayDate);
          const dateB = new Date(b.displayDate);
          
          // If both dates are valid, compare them
          if (!isNaN(dateA) && !isNaN(dateB)) {
            return dateA - dateB;
          }
          
          // Fallback to string comparison if parsing fails
          return a.displayDate.localeCompare(b.displayDate);
        });
        
        setEvents(sortedEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Update all your donate buttons to use this handler
  const handleDonateClick = () => {
    setIsDialogOpen(true);
  };
  
  return (
    <div className="overflow-hidden">
      {/* { 1st page } */}
      <div>
        <img src={bannerImage} alt="Loading..." className="w-full h-full" />
      </div>

      {/* { what is maast } */}
      <div className="bg-backgreenColor flex gap-12 justify-center items-center flex-wrap p-10">
        <div className="md:w-[400px] mt-6">
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            What is MAAST?
          </h1>
          <p className="text-parapgraphColor">
            MAAST is an initiative designed to create a positive impact on
            society by supporting various charitable causes. Through the MAAST
            program, users can contribute to meaningful projects that focus on
            areas such as hunger relief, nutrition, emergency aid, support for
            the elderly, and children&apos;s welfare. By participating in MAAST,
            individuals can donate, volunteer, or raise awareness to help
            transform lives and communities.
          </p>
          <div>
            <button
              onClick={handleDonateClick}
              className="bg-teal-500 hover:bg-teal-600 transition-colors text-white font-medium rounded-md py-2.5 px-8 mt-4"
            >
              Donate
            </button>
          </div>
        </div>

        <div className="mt-6">
          <img
            src={page2}
            alt="Loading..."
            className="w-[432px] h-[300px] rounded-lg shadow-md"
          />
        </div>
      </div>
      
      {/* { support maast and other charities } */}
      <div className="bg-backgroundLightYellowColor gap-12 flex justify-center items-center flex-wrap p-10">
        <div className="mt-6">
          <img
            src={page3}
            alt="Loading..."
            className="w-[432px] h-[300px] rounded-lg shadow-md"
          />
        </div>

        <div className="md:w-[400px] mt-6">
          <h1 className="md:text-4xl text-3xl font-semibold font-slab mb-4">
            Support MAAST and Other Charities
          </h1>
          <p className="text-parapgraphColor">
            ShoppinessMart is committed to making a difference by turning
            everyday online shopping into a powerful force for good. Through our
            platform, you can support a variety of charities, including the
            MAAST initiative and others, without spending any extra money. By
            simply shopping through ShoppinessMart, a percentage of your
            purchase is donated to the cause you care about. It's an effortless
            way to contribute to a better world.
          </p>
          <div>
            <button
              onClick={handleDonateClick}
              className="bg-teal-500 hover:bg-teal-600 transition-colors text-white font-medium rounded-md py-2.5 px-8 mt-4"
            >
              Donate
            </button>
          </div>
        </div>
      </div>

      {/* { our efforts } */}
      <OurEfforts />

      {/* { Events Section - Updated with Sorting } */}
      <div className="bg-backgreenColor py-20">
        <div className="text-center">
          <h1 className="md:text-5xl text-4xl font-bold mb-4 font-slab text-gray-800">
            Upcoming Events
          </h1>
          <p className="text-lg text-parapgraphColor max-w-2xl mx-auto">
            Join us in making a difference. Explore our upcoming events and be part of the change.
          </p>
        </div>

        {/* Events Grid */}
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.thumbnailURL || "/placeholder-event.jpg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <span className="bg-teal-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                        Event
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <CalendarDays className="h-5 w-5 mr-2 text-teal-500" />
                        <span>{event.displayDate}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2 text-teal-500" />
                        <span>{event.timeDisplay}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 text-teal-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button
                        onClick={handleDonateClick}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-md py-2.5 transition-colors"
                      >
                        Support This Event
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* { Popular causes section } */}
      <PopularCauses />
      
      {/* { FAQ section } */}
      <FAQ />
      
      <DonationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default SupportMasst;