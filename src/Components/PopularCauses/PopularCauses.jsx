import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const PopularCauses = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        setLoading(true);
        const causesQuery = query(
          collection(db, "causeDetails"),
          where("status", "==", "Active")
        );

        const querySnapshot = await getDocs(causesQuery);
        let allCauses = [];

        // Process each document in the main collection
        for (const doc of querySnapshot.docs) {
          const mainDoc = { id: doc.id, ...doc.data() };
          
          const mainDocDate = mainDoc.approvedDate ? 
            (typeof mainDoc.approvedDate === 'string' ? new Date(mainDoc.approvedDate) : 
             typeof mainDoc.approvedDate.toDate === 'function' ? mainDoc.approvedDate.toDate() : 
             mainDoc.approvedDate instanceof Date ? mainDoc.approvedDate : new Date(0)) 
            : new Date(0);
          
          // Add the main cause to our array with normalized sort date
          allCauses.push({
            ...mainDoc,
            sortDate: mainDocDate, 
            dateString: mainDoc.approvedDate, 
            dateType: "approvedDate", 
            isMainCause: true 
          });
          
          // Check if the document has a "causes" array
          if (mainDoc.causes && Array.isArray(mainDoc.causes)) {
            const activeNestedCauses = mainDoc.causes
              .filter(cause => 
                cause.status && 
                (cause.status.toLowerCase() === "active")
              )
              .map(cause => {
                const nestedCauseDate = cause.createdDate ? 
                  (typeof cause.createdDate === 'string' ? new Date(cause.createdDate) : 
                   typeof cause.createdDate.toDate === 'function' ? cause.createdDate.toDate() : 
                   cause.createdDate instanceof Date ? cause.createdDate : new Date(0)) 
                  : new Date(0);
                  
                return {
                  ...cause,
                  parentCauseId: doc.id,
                  parentCauseName: mainDoc.causeName,
                  id: cause.id || `${doc.id}_${Math.random().toString(36).substring(2, 15)}`,
                  sortDate: nestedCauseDate,
                  dateString: cause.createdDate,
                  dateType: "createdDate",
                  isNestedCause: true 
                };
              });
            
            allCauses = [...allCauses, ...activeNestedCauses];
          }
        }

        // Sort ALL causes by the sortDate field in descending order (newest first)
        allCauses.sort((a, b) => {
          return b.sortDate - a.sortDate;
        });

        setCauses(allCauses.slice(0, 3));
      } catch (error) {
        console.error("Error fetching causes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCauses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          style={{ fontFamily: "'Roboto Slab', serif" }}
        >
          Our Popular Causes/NGOs
        </h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Addressing these challenges requires a multifaceted approach
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
          {causes.map((cause) => (
            <div
              key={cause.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[10px_20px_25px_rgba(22,163,74,0.3)] max-w-md hover:-translate-y-2"
            >
              <div className="h-60 overflow-hidden">
                <img
                  src={cause.bannerUrl}
                  alt={cause.causeName}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold -mt-2 text-gray-800 mb-2">
                  {cause.causeName}
                </h3>
                <p className="text-sm font-medium text-green-600 mb-3">
                  {cause.shortDesc}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {cause.aboutCause}
                </p>
                {cause.parentCauseId && (
                  <p className="text-xs text-gray-500 mb-2">
                    Part of: {cause.parentCauseName}
                  </p>
                )}
                
                <div className="flex justify-end">
                  <Link
                    to={`/support/${cause.id}`}
                    className="text-green-600 hover:text-green-700 font-medium flex items-center group"
                  >
                    Learn more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <button
          className="text-green-600 hover:text-green-800 text-2xl font-medium flex items-center mx-auto group"
          onClick={() => {
            navigate("/support");
            window.scrollTo(0, 0);
          }}
        >
          <span>
            See all Causes
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PopularCauses;