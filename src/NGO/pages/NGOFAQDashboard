// src/NGO/pages/NGOFAQDashboard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import NGOsidebar from '../components/NGOsidebar';
import ShoppingBag from '../../assets/googleicon.png';
import ProfilePic from '../../assets/googleicon.png'; // Replace with actual path
import NotificationIcon from '../../assets/googleicon.png'; // Replace with actual path

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
      <NGOsidebar />

      <div className="flex-1 p-6 bg-gray-100">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Welcome Jit</span>
          <div className="flex items-center space-x-4">
            <img src={ProfilePic} alt="Profile" className="w-10 h-10 rounded-full border border-gray-300" />
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search here" 
                className="p-2 pl-10 border rounded-lg bg-white text-gray-700 focus:outline-none focus:border-teal-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 4a7 7 0 0114 14 7 7 0 01-14-14zM10 11l2 2 2-2"
                />
              </svg>
            </div>
            <img src={NotificationIcon} alt="Notifications" className="w-6 h-6" />
          </div>
        </div>

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
  );
};

export default NGOFAQDashboard;
