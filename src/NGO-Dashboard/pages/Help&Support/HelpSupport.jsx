import React from "react";
import { Link } from "react-router-dom";
import {
  FaCommentAlt,
  FaPhone,
  FaEnvelope,
  FaQuestionCircle,
  FaArrowRight,
} from "react-icons/fa";

const SUPPORT_OPTIONS = [
  {
    icon: FaCommentAlt,
    bgColor: "bg-blue-700",
    text: "Message Us",
    to: "/message",
    id: "message",
  },
  {
    icon: FaEnvelope,
    bgColor: "bg-[#FF7A7A]",
    text: "Email Us",
    to: "/email",
    id: "email",
  },
  {
    icon: FaPhone,
    bgColor: "bg-[#03A10A]",
    text: "Call Us",
    to: "/call",
    id: "call",
  },
  {
    icon: FaQuestionCircle,
    bgColor: "bg-[#6F00DE]",
    text: "How It Works",
    to: "/how-it-works",
    id: "howto",
  },
];

const HelpSupportCard = ({ icon: Icon, bgColor, text, to }) => (
  <Link
    to={to}
    className="flex items-center justify-between px-4 py-3 border shadow-md bg-white h-[100px] rounded-lg"
  >
    <div className="flex items-center space-x-10">
      <div
        className={`flex items-center justify-center w-12 h-12 ${bgColor} rounded-full`}
      >
        <Icon className="text-white" size={24} />
      </div>
      <span className="text-2xl">{text}</span>
    </div>
    <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
      <FaArrowRight className="text-white" />
    </div>
  </Link>
);

const HelpSupport = () => (
  <div className="w-full p-4">
    <div>
      <div className="px-6 py-5">
        <h2 className="text-xl font-medium">Help & Support</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 p-6">
        {SUPPORT_OPTIONS.map((option) => (
          <HelpSupportCard key={option.id} {...option} />
        ))}
      </div>
    </div>
  </div>
);

export default HelpSupport;
