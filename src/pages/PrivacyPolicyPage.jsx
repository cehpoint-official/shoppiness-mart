import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../Components/Loader/Loader";

const PrivacyPolicyPage = () => {
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState([]);

  // Fetch policies from Firebase
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const policyCollection = collection(db, "privacyPolicies");
        const policySnapshot = await getDocs(policyCollection);
        const policyList = policySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort policies by createdAt in ascending order (oldest first)
        const sortedPolicies = policyList.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        
        setPolicies(sortedPolicies);
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto"> {/* Increased from max-w-3xl to max-w-5xl */}
        <div className="text-center mb-16"> {/* Increased from mb-12 to mb-16 */}
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl mb-6"> {/* Increased from text-4xl/text-5xl to text-5xl/text-6xl */}
            Privacy Policy
          </h1>
          <p className="max-w-3xl mx-auto text-2xl text-gray-500"> {/* Increased from max-w-2xl/text-xl to max-w-3xl/text-2xl */}
            Our commitment to protecting your personal information
          </p>
        </div>

        {policies.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md"> {/* Increased from py-12 and shadow-sm to py-16 and shadow-md */}
            <p className="text-gray-500 text-xl">No privacy policies found.</p> {/* Increased from text-lg to text-xl */}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden"> {/* Increased from rounded-lg and shadow-sm to rounded-xl and shadow-md */}
            {policies.map((policy, index) => (
              <div 
                key={policy.id} 
                id={policy.id}
                className={`${index !== 0 ? 'border-t border-gray-100' : ''}`}
              >
                <div className="p-8 sm:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-5 font-bold text-2xl">
                      {index + 1}
                    </span>
                    {policy.title}
                  </h2>
                  <div 
                    className="text-lg text-justify font-medium max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ 
                      __html: policy.content
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\n/g, '<br>')
                        .replace(/^(.+)/, '<p>$1</p>')
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer with additional information */}
        {/* <div className="mt-16 text-center">
          <p className="text-base text-gray-500">
            Last updated: {policies.length > 0 ? new Date(policies[policies.length - 1].updatedAt || policies[policies.length - 1].createdAt).toLocaleDateString() : "-"}
          </p>
          <p className="text-base text-gray-500 mt-3">
            If you have any questions about our privacy policies, please contact us.
          </p>
        </div>*/}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;