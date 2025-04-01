import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

const FAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openQuestionId, setOpenQuestionId] = useState(null);
  
  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        setLoading(true);
        // Query the entire FAQ collection ordered by createdAt
        const faqQuery = query(
          collection(db, "FAQ"),
          orderBy("createdAt", "asc")
        );
        
        const querySnapshot = await getDocs(faqQuery);
        const faqItems = [];
        
        querySnapshot.forEach((doc) => {
          // For each document, extract the questions array if it exists
          const data = doc.data();
          if (data.questions && Array.isArray(data.questions)) {
            faqItems.push(...data.questions);
          } else if (data.question && data.answer) {
            // Handle case where each document is a single FAQ
            faqItems.push({
              questionId: doc.id,
              question: data.question,
              answer: data.answer,
              createdAt: data.createdAt
            });
          }
        });
        
        // Sort by createdAt if available
        faqItems.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return a.createdAt.toMillis ? 
              a.createdAt.toMillis() - b.createdAt.toMillis() :
              a.createdAt - b.createdAt;
          }
          return 0;
        });
        
        setFaqData(faqItems);
      } catch (error) {
        console.error("Error getting FAQ documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, []);

  const toggleQuestion = (questionId) => {
    if (openQuestionId === questionId) {
      setOpenQuestionId(null); // Close if it's already open
    } else {
      setOpenQuestionId(questionId); // Open the clicked question
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#f0fdfb] to-[#e0f7ff] py-16 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#048376] mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <div className="w-24 h-1 bg-[#FFD705] mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Find answers to the most common questions about our platform and services
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#048376]"></div>
          </div>
        ) : faqData.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-xl shadow-lg">
            <p className="text-xl text-gray-500">No FAQ items found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {faqData.map((item, index) => (
              <div
                key={item?.questionId || index}
                className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div
                  className={`px-6 py-5 flex justify-between items-center cursor-pointer transition-colors duration-300 ${
                    openQuestionId === item.questionId
                      ? "bg-[#049D8E] text-white"
                      : "hover:bg-[#EEFAF9]"
                  }`}
                  onClick={() => toggleQuestion(item.questionId)}
                >
                  <h3 className={`text-xl font-semibold pr-4 ${
                    openQuestionId === item.questionId
                      ? "text-white"
                      : "text-gray-700"
                  }`}>
                    {item?.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 ${
                      openQuestionId === item.questionId 
                        ? "bg-white text-[#049D8E] rotate-180" 
                        : "bg-[#EEFAF9] text-[#049D8E]"
                    }`}>
                      <i className="bi bi-chevron-down"></i>
                    </span>
                  </div>
                </div>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openQuestionId === item.questionId 
                    ? "max-h-96" 
                    : "max-h-0"
                }`}>
                  <div className="p-6 bg-white">
                    <p className="text-gray-600 leading-relaxed">
                      {item?.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;