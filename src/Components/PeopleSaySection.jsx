import { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const PeopleSaySection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Reviews"));
        const reviewsData = [];
        querySnapshot.forEach((doc) => {
          reviewsData.push({ id: doc.id, ...doc.data() });
        });
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error("Error getting documents: ", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentSlide, reviews.length]);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`star-${i}`} className="bi bi-star-fill text-yellow-400 text-xl"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half-star" className="bi bi-star-half text-yellow-400 text-xl"></i>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-star-${i}`} className="bi bi-star text-yellow-400 text-xl"></i>
      );
    }

    return stars;
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-slab mb-4">
            Voices from Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from people who are making a difference through ShoppinessMart's platform,
            turning everyday shopping into meaningful impact.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="relative" ref={sliderRef}>
            <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 left-0 right-0 z-10 px-4">
              <button
                onClick={prevSlide}
                className="bg-white p-3 rounded-full shadow-lg text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="bg-white p-3 rounded-full shadow-lg text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="overflow-hidden mx-auto">
              <div 
                className="transition-transform duration-700 ease-in-out flex"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="min-w-full px-4"
                  >
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mx-auto max-w-4xl relative">
                      <div className="absolute -top-6 left-10 text-teal-500 bg-teal-50 p-4 rounded-full">
                        <Quote size={36} />
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                          "{review.comment}"
                        </h3>
                        <p className="text-lg md:text-xl text-gray-600 mb-8">
                          {review.description}
                        </p>
                        
                        <div className="flex items-center mb-6">
                          <div className="flex gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="ml-2 text-gray-500">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <img
                              src={review.userPhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                              alt={review.name}
                              className="h-16 w-16 rounded-full object-cover border-2 border-teal-500"
                            />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-xl font-semibold text-gray-900">
                              {review.name}
                            </h4>
                            <div className="flex items-center">
                              <span className="text-teal-600">
                                {review.post}
                              </span>
                              {review.verified && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                  <i className="bi bi-patch-check-fill mr-1"></i>
                                  Verified User
                                </span>
                              )}
                            </div>
                            {review.causeSupported && (
                              <div className="mt-1 text-sm text-gray-500">
                                Supports: {review.causeSupported}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    currentSlide === index ? "bg-teal-600 w-6" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleSaySection;