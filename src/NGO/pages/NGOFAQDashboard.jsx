import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import NGOSidebar from '../components/NGOSidebar'; // Adjust the path if necessary
import NGONavbar from '../components/NGONavbar'; // Adjust the path if necessary

const NGOFAQDashboard = () => {
  const [visibleAnswers, setVisibleAnswers] = useState({});

  const faqs = [
    {
      question: "What is Shoppiness Mart?",
      answer: "Shoppiness Mart is an online platform for connecting NGOs with potential donors."
    },
    {
      question: "How can I donate?",
      answer: "You can donate by visiting the specific cause page and clicking on the 'Donate Now' button."
    },
    // Add more FAQs as needed
  ];

  const toggleAnswer = (index) => {
    setVisibleAnswers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <NGOSidebar />

      <div className="flex-1 flex flex-col">
        <NGONavbar /> {/* Include the navbar component */}

        <div className="p-6 bg-gray-100">
          {/* FAQ Header */}
          <div className="mb-6">
            <span className="text-2xl font-semibold text-blue-600">Frequently Asked Questions (FAQ's)</span>
          </div>

          {/* FAQ Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-300 pb-4">
                {/* Question Section */}
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleAnswer(index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  {/* Toggle Arrow Icon */}
                  {visibleAnswers[index] ? (
                    <FiChevronUp className="text-teal-500" />
                  ) : (
                    <FiChevronDown className="text-teal-500" />
                  )}
                </div>

                {/* Answer Section */}
                {visibleAnswers[index] && (
                  <div className="mt-2 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOFAQDashboard;
