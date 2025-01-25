import React from "react";
import { useState } from "react";

function ChevronIcon({ isOpen }) {
  return (
    <svg
      className={`w-6 h-6 transition-transform ${isOpen ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
const PrivacyPolicies = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const privacyContent = [
    {
      title: "Introduction",
      content:
        "Welcome to Shoppiness Mart. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
    },
    {
      title: "Information We Collect",
      content:
        "We collect information that you provide directly to us, including your name, email address, shipping address, and payment information. We also automatically collect certain information about your device and how you interact with our website.",
    },
    {
      title: "How We Use Your Information",
      content:
        "We use your information to process your orders, communicate with you about your purchases, and provide customer support. We may also use your information to improve our services and send you marketing communications.",
    },
    {
      title: "How We Use Your Information",
      content:
        "Additionally, we use your information to detect and prevent fraud, analyze website usage patterns, and comply with legal obligations. Your information helps us personalize your shopping experience.",
    },
    {
      title: "How We Share Your Information",
      content:
        "We may share your information with service providers who assist in operating our website, processing payments, and delivering orders. We do not sell your personal information to third parties.",
    },
    {
      title: "Your Choices and Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications and choose whether to share certain information with us.",
    },
    {
      title: "Security of Your Information",
      content:
        "We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, or misuse.",
    },
  ];

  return (
    <div className="w-full p-10">
      <h1 className="text-2xl font-normal mb-8">Private policy</h1>

      <div className="space-y-4">
        {privacyContent.map((section, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg shadow-sm bg-white overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
            >
              <span className="text-xl font-normal">{section.title}</span>
              <ChevronIcon isOpen={openIndex === index} />
            </button>

            {openIndex === index && (
              <div className="p-6 bg-gray-100  text-gray-600 text-lg">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicies;
