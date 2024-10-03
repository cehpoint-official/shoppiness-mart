import { useState } from 'react';
import NGOsidebar from '../components/NGOsidebar';

const NGOPrivacyPolicy = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const questionsAndAnswers = [
    {
      question: "What personal data do we collect?",
      answer: "We collect personal data such as your name, email address, and other contact details when you register on our site."
    },
    {
      question: "How do we use your information?",
      answer: "We use your information to provide and improve our services, communicate with you, and send you updates."
    },
    {
      question: "Do we share your information?",
      answer: "We do not sell or share your personal information with third parties without your consent."
    },
    {
      question: "How do we protect your data?",
      answer: "We implement various security measures to protect your personal information."
    },
    {
      question: "What are your rights?",
      answer: "You have the right to access, modify, or delete your personal data at any time."
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <NGOsidebar />
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
      <div>
        {questionsAndAnswers.map((item, index) => (
          <div key={index} className="mb-2">
            <div
              onClick={() => toggleQuestion(index)}
              className="flex justify-between cursor-pointer p-4 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <span>{item.question}</span>
              <span>{activeQuestion === index ? '−' : '+'}</span>
            </div>
            {activeQuestion === index && (
              <div className="p-4 bg-gray-50 rounded-md mt-1">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default NGOPrivacyPolicy;
