import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BiSortAlt2 } from "react-icons/bi";
import SingleInvoice from "./SingleInvoice";

const Invoice = () => {
  const invoices = [
    {
      id: "#AB65768",
      name: "Tithi Mondal",
      amount: "Rs.5000",
      paid: "Rs.5000",
      due: "Rs.0",
      date: "22Apr, 2024",
    },
    {
      id: "#AB65768",
      name: "Tithi Mondal",
      amount: "Rs.5000",
      paid: "Rs.5000",
      due: "Rs.0",
      date: "22Apr, 2024",
    },
    {
      id: "#AB65768",
      name: "Tithi Mondal",
      amount: "Rs.5000",
      paid: "Rs.5000",
      due: "Rs.0",
      date: "22Apr, 2024",
    },
    {
      id: "#AB65768",
      name: "Tithi Mondal",
      amount: "Rs.5000",
      paid: "Rs.5000",
      due: "Rs.0",
      date: "22Apr, 2024",
    },
    {
      id: "#AB65768",
      name: "Tithi Mondal",
      amount: "Rs.5000",
      paid: "Rs.5000",
      due: "Rs.0",
      date: "22Apr, 2024",
    },
  ];
  const [currentView, setCurrentView] = useState("invoices");
  if (currentView === "invoice") {
    return <SingleInvoice onBack={() => setCurrentView("invoices")} />;
  }
  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-normal text-gray-900">Customer</h1>
        <button className="px-4 py-2 text-blue-500 border border-blue-500 font-bold rounded-md flex items-center gap-2">
          <BiSortAlt2 className="w-5 h-5" />
          Sort by
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left p-4 text-gray-500 font-normal">
                Invoice No.
              </th>
              <th className="text-left p-4 text-gray-500 font-normal">Name</th>
              <th className="text-left p-4 text-gray-500 font-normal">
                Amount
              </th>
              <th className="text-left p-4 text-gray-500 font-normal">Paid</th>
              <th className="text-left p-4 text-gray-500 font-normal">Due</th>
              <th className="text-left p-4 text-gray-500 font-normal">Date</th>
              <th className="text-left p-4 text-gray-500 font-normal">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
              >
                <td className="p-4 text-gray-900">{invoice.id}</td>
                <td className="p-4 text-gray-900">{invoice.name}</td>
                <td className="p-4 text-gray-900">{invoice.amount}</td>
                <td className="p-4 text-gray-900">{invoice.paid}</td>
                <td className="p-4 text-gray-900">{invoice.due}</td>
                <td className="p-4 text-gray-900">{invoice.date}</td>
                <td className="p-4">
                  <button onClick={() => setCurrentView("invoice")} className="px-4 py-2 text-blue-500 border border-blue-500 rounded-md flex items-center gap-2">
                    <AiOutlineEye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoice;
