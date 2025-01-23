import React from "react";

const Customers = () => {
  const customers = [
    {
      couponId: "#AB65768",
      name: "Tithi Mondal",
      contact: "email@gmail.com 9567450704",
      offer: "20% Off",
      claimedOn: "22Apr, 2024",
    },
    {
      couponId: "#AB65768",
      name: "Tithi Mondal",
      contact: "email@gmail.com 9567450704",
      offer: "20% Off",
      claimedOn: "22Apr, 2024",
    },
    {
      couponId: "#AB65768",
      name: "Tithi Mondal",
      contact: "email@gmail.com 9567450704",
      offer: "20% Off",
      claimedOn: "22Apr, 2024",
    },
    {
      couponId: "#AB65768",
      name: "Tithi Mondal",
      contact: "email@gmail.com 9567450704",
      offer: "20% Off",
      claimedOn: "22Apr, 2024",
    },
  ];

  return (
    <div className="container mx-auto my-10 p-10 flex flex-col gap-10">
      <h1 className="text-xl">Customer</h1>
      <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
        <thead>
          <tr className="">
            <th className="py-3 px-4 text-left">Coupon ID</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Contact</th>
            <th className="py-3 px-4 text-left">Offer</th>
            <th className="py-3 px-4 text-left">Claimed on</th>
            <th className="py-3 px-4 text-left">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index} className={`border-b ${index % 2 === 0 ? "" : ""}`}>
              <td className="py-3 px-4">{customer.couponId}</td>
              <td className="py-3 px-4">{customer.name}</td>
              <td className="py-3 px-4">{customer.contact}</td>
              <td className="py-3 px-4">{customer.offer}</td>
              <td className="py-3 px-4">{customer.claimedOn}</td>
              <td className="py-3 px-4">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
