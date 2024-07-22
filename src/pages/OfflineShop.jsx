import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import foodIcon from "../assets/Shop/food.png";
import groceryIcon from "../assets/Shop/grocery.png";
import pharmacyIcon from "../assets/Shop/pharmacy.png";
import fashionIcon from "../assets/Shop/fashion.png";
import electronicsIcon from "../assets/Shop/electronics.png";
import beautyIcon from "../assets/Shop/beauty.png";
import sportIcon from "../assets/Shop/sport.png";
import corporateIcon from "../assets/Shop/corporate.png";

import giftImage from "../assets/Shop/gift.png";
import website from "../assets/Shop/website..png";
import giftCard from "../assets/Shop/gift-card.png";
import shops from "../assets/Shop/shops.png";
import cashBack from "../assets/Shop/cash-back.png";

import imaoffshop from "../assets/Shop/imaoffshop.png";
import imaoffshop1 from "../assets/Shop/image 72.png";
import imaoffshop2 from "../assets/Shop/image 73.png";
import imaoffshop3 from "../assets/Shop/image 74.png";
import imaoffshop4 from "../assets/Shop/image 75.png";
import imaoffshop8 from "../assets/Shop/image 76.png";
import imaoffshop11 from "../assets/Shop/image 77.png";
import imaoffshop10 from "../assets/Shop/image 78.png";
import imaoffshop6 from "../assets/Shop/image 79.png";
import imaoffshop9 from "../assets/Shop/image 80.png";
import imaoffshop5 from "../assets/Shop/image 80.png";
import imaoffshop7 from "../assets/Shop/image 82.png";

import { FaArrowRight } from "react-icons/fa";
import shopcard from "../assets/Shop/shopcard.png";
import Loader from "../Components/Loader/Loader";
import { useState } from "react";

const OfflineShop = () => {
  const [loading, setLoading] = useState(true);
  setInterval(() => {
    setLoading(false);
  }, [3000]);
  const categories = [
    { name: "Food", icon: foodIcon },
    { name: "Grocery", icon: groceryIcon },
    { name: "Pharmacy", icon: pharmacyIcon },
    { name: "Fashion", icon: fashionIcon },
    { name: "Electronics", icon: electronicsIcon },
    { name: "Beauty", icon: beautyIcon },
    { name: "Sport", icon: sportIcon },
    { name: "Corporate", icon: corporateIcon },
  ];
  const features = [
    {
      image: website,
      text: "Visit favorite stores listed in Shopping Mart",
    },
    {
      image: giftCard,
      text: "Generate a coupon",
    },
    {
      image: shops,
      text: "Visit offline shop",
    },
    {
      image: giftImage,
      text: "Readme your coupon",
    },
    {
      image: cashBack,
      text: "Get cashback; you can also give back to support an NGO or cause",
    },
  ];
  const sections = [
    {
      title: "Popular Food Shops close to you",
      category: "Food",
      items: [
        {
          name: "Food Station",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "Monginis",
          location: "Kolkata, Bow Bazar",
          cashback: "20% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "Mother’s Kitchen",
          location: "Kolkata, Bow Bazar",
          cashback: "30% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "KFC",
          location: "Kolkata, Bow Bazar",
          cashback: "30% Cashback",
          image: shopcard, // Replace with actual image path
        },
      ],
    },
    {
      title: "Popular Pharmacy Shops close to you",
      category: "Pharmacy",
      items: [
        {
          name: "Apollo",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "Himalaya",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "Save Medical",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "Paul Medical",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
      ],
    },
    {
      title: "Popular Fashion Shops close to you",
      category: "Fashion",
      items: [
        {
          name: "Fashion Shop",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "Luxur",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "Fashion Shop",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "Fashion Shop",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
      ],
    },
    {
      title: "Popular Electronic Shops close to you",
      category: "Electronic",
      items: [
        {
          name: "Lenovo Store",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "LG Elactronic",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "Jio Store",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
        {
          name: "Croma",
          location: "Kolkata, Bow Bazar",
          cashback: "10% Cashback",
          image: shopcard, // Replace with actual image path
        },
      ],
    },
  ];

  return loading ? (
    <Loader />
  ) : (
    <div>
      <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center p-2 bg-white rounded-md shadow-md max-w-full">
          <div className="flex items-center p-2 border-b sm:border-b-0 sm:border-r border-gray-300 w-full sm:w-auto">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <span className="text-gray-500">Select Location</span>
          </div>
          <input
            type="text"
            className="flex-grow p-2 w-full sm:w-auto focus:outline-none"
            placeholder="Search name of Shop, Store, brand, Product"
          />
          <button className="p-2 mt-2 sm:mt-0">
            <FaSearch className="text-gray-500" />
          </button>
        </div>
        {/* Categories */}
        <div className="flex flex-wrap   justify-center mt-10">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col items-center w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 p-2"
            >
              <img
                src={category.icon}
                alt={category.name}
                className="w-20 h-20 mb-2 bg-[#F7F7F7] rounded-full p-2"
              />
              <span className="text-gray-700 text-center">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* {3nd Component} */}
      <div className="p-8">
        <h2 className="text-center text-2xl font-bold mb-12">
          How do you get happiness with{" "}
          <span className="text-orange-500">Shoppiness Mart</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img src={feature.image} alt="Gift" className="w-20 h-20 mb-4" />
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
      {/* {4th Component} */}
      <div className="bg-[#FFE0CF] px-10 gap-4 py-4 my-12 flex justify-around items-center flex-wrap">
        <div>
          <img src={imaoffshop} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop1} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop2} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop3} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop4} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop5} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop6} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop7} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop8} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop9} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop10} alt="" className="w-16" />
        </div>
        <div>
          <img src={imaoffshop11} alt="" className="w-16" />
        </div>
      </div>
      {/* {5th Component} */}
      <div className="p-8">
        {sections.map((section, index) => (
          <div key={index} className="my-10">
            <h2 className="text-2xl font-bold my-8 text-center">
              {section.title}
            </h2>
            <div className="flex overflow-x-auto space-x-4">
              {section.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-none bg-white shadow-md rounded-md overflow-hidden w-72"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-gray-600">{item.location}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 mt-2 rounded">
                      {item.cashback}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex-none flex flex-col justify-center items-center bg-gray-100 shadow-md rounded-md w-72">
                <p className="text-orange-500 font-bold">View More</p>
                <FaArrowRight className="text-orange-500 mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfflineShop;
