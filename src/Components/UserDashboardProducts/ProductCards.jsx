import React from "react";

const ProductCards = ({ item }) => {
  return (
    <div className="md:h-[406px] md:w-[311px] border rounded-[8px] p-4">
      <div className="w-full flex justify-center">
        <img
          src={item.image}
          alt=""
          className="h-[146px] w-[146px] object-cover "
        />
      </div>
      <p className="text-[#777777] text-base font-medium mt-2">{item.desc}</p>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-center">
          <p>Offer Price</p>
          <p className="font-medium text-xl">${item.offerPrice}</p>
          <p className="text-gray-600 opacity-50 line-through">
            ${item.actualPrice}
          </p>
        </div>
        <div className="flex flex-col items-center justify-between gap-4">
          <img
            src={item.company}
            alt=""
            className="h-[30px] w-[60px] object-cover"
          />
          <p className="text-[#0F9B03] font-semibold text-lg">
            {item.discount}% off
          </p>
        </div>
      </div>
      <button className="h-[34px] w-[274px] rounded-[4px] bg-[#0F9B03] text-white text-sm mt-4">
        View Details
      </button>
    </div>
  );
};

export default ProductCards;
