import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const FAQ = () => {
  const [faqData, setFaqData] = useState(null);
  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const docRef = doc(db, "FAQ", "qgvvT5bMhE2ya1mdWW6u");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFaqData(docSnap.data().questions);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    };

    fetchFAQ();
  }, []);

  const [openQuestionId, setOpenQuestionId] = useState(null);
  const toggleQuestion = (questionId) => {
    if (openQuestionId === questionId) {
      setOpenQuestionId(null); // Close if it's already open
    } else {
      setOpenQuestionId(questionId); // Open the clicked question
    }
  };
  return (
    <div>
      <div className="mx-auto md:mt-44 mt-16  px-12 md:px-40 pt-12 pb-10 bg-[#EEFAF9] ">
        <div>
          <p className="font-bold md:text-4xl text-2xl  font-slab text-center">
            Frequently Asked Questions
          </p>
          <p className="text-gray-600 md:text-xl text-base text-center mx-auto  md:mt-8 mt-2">
            An establishment created to offer assistance and generate funds for
            individuals facing{" "}
          </p>
          <p className="text-gray-600 md:text-xl text-base  text-center mx-auto  ">
            {" "}
            challenges and hardships{" "}
          </p>
        </div>

        {faqData?.map((item) => {
          return (
            <div key={item?.questionId}>
              <div>
                <div
                  className="mt-8 flex justify-between cursor-pointer"
                  onClick={() => toggleQuestion(item.questionId)}
                >
                  <p className="md:text-3xl text-lg font-semibold text-gray-600 mx-4 ">
                    {item?.question}
                  </p>
                  <div className="mt-2 ">
                    <i
                      className={`bi ${
                        openQuestionId === item.questionId
                          ? "bi-caret-up-fill"
                          : "bi-caret-down-fill"
                      }`}
                    ></i>
                  </div>
                </div>
                {openQuestionId === item.questionId && (
                  <div>
                    <p className="md:text-xl text-lg text-gray-600 mx-4 mt-2">
                      {item?.answer}
                    </p>
                  </div>
                )}
              </div>
              <div className="border-b-2 border-gray-300 w-full mr-1  mt-3"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default FAQ;
