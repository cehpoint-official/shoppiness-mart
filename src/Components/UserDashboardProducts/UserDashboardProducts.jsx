import React from "react";
import product1 from "../../assets/Products/product1.png";
import product2 from "../../assets/Products/product2.png";
import product3 from "../../assets/Products/product3.png";
import product4 from "../../assets/Products/product4.png";
import amazon from "../../assets/Products/amazon.png";
import ProductCards from "./ProductCards";

const ProductList = [
  {
    image: product1,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product2,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product3,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product4,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product1,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product2,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product3,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product4,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product1,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product2,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product3,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  },
  {
    image: product4,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quas!",
    offerPrice: 1599,
    actualPrice: 3999,
    discount: 60,
    company: amazon
  }
];

const UserDashboardProducts = () => {
  return (
    <div className="my-[40px] px-[100px] mb-20">
      <h2 className="text-[33px] font-medium text-center">
        Get <span className="text-[orange]">Online</span> Offers
      </h2>
      <div className="flex justify-between mt-[40px] flex-wrap gap-4">
        {ProductList.map((item, index) => {
          return <ProductCards item={item} key={index} />;
        })}
      </div>
    </div>
  );
};

export default UserDashboardProducts;
