import React from 'react';
import { FaFacebook, FaWhatsapp, FaInstagram, FaTwitter } from 'react-icons/fa';

const CausePage = () => {
  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebook className="w-5 h-5" />, bgColor: 'bg-blue-600' },
    { name: 'WhatsApp', icon: <FaWhatsapp className="w-5 h-5" />, bgColor: 'bg-green-500' },
    { name: 'Instagram', icon: <FaInstagram className="w-5 h-5" />, bgColor: 'bg-pink-600' },
    { name: 'Twitter', icon: <FaTwitter className="w-5 h-5" />, bgColor: 'bg-blue-400' },
  ];

  return (
    <div className="space-y-6 max-w-xl p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          My Cause Page Link
        </label>
        <div className="flex">
          <input
            type="text"
            value="Childcare_09847978"
            readOnly
            className="w-3/4 p-2 border border-gray-300 rounded-l-md bg-gray-50"
          />
          <button className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Share your Cause page</h3>
        <div className="grid grid-cols-2 gap-4">
          {socialLinks.map((link) => (
            <button
              key={link.name}
              className={`flex items-center justify-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors ${link.bgColor}`}
            >
              {link.icon}
              <span className="text-sm text-gray-700">{link.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CausePage;