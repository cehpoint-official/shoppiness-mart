import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { Link, useParams } from "react-router-dom";

import axios from "axios";
import {
  FaSpinner,
  FaEye,
  FaBell,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaCalendarAlt,
  FaFileInvoice,
  FaMoneyBillWave,
  FaInbox,
} from "react-icons/fa";
import toast from "react-hot-toast";
import UpdateInvoice from "./UpdateInvoice";
import { useSelector } from "react-redux";

const Customers = () => {
  const { user } = useSelector((state) => state.businessUserReducer);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const customersPerPage = 5;
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "invoiceDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const customersData = doc.data();
        if (
          customersData.businessId === id &&
          customersData.claimedCouponCode
        ) {
          data.push({ id: doc.id, ...customersData });
        }
      });
      setCustomers(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
      toast.error("Failed to load customer data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handleNotifyUser = async (customer) => {
    setSendingEmail(customer.id);
    try {
      // Send email to notify the user about the due amount
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Reminder: Due Amount Payment</h2>
            <p style="color: #666;">Dear ${
              customer.claimedCouponCodeUserName
            },</p>
            <p style="color: #666;">You have an outstanding due amount of <strong>Rs. ${
              customer.dueAmount?.toFixed(2) || 0
            }</strong> for invoice number <strong>${
        customer.invoiceNum || "N/A"
      }</strong>.</p>
            <p style="color: #666;">Please clear the due amount at the earliest to claim your remaining cashback of <strong>Rs. ${
              customer.remainingCashback?.toFixed(2) || 0
            }</strong>.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0;">Best regards,</p>
              <p style="color: #666; margin: 5px 0;">The ShoppinessMart Team</p>
            </div>
          </div>
        </div>
      `;

      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: customer.claimedCouponCodeUserEmail,
        title: "ShoppinessMart - Due Amount Reminder",
        body: emailTemplate,
      });

      toast.success("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
    } finally {
      setSendingEmail(null);
    }
  };
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };
  const handleBackToInvoices = () => {
    setSelectedInvoice(null);

    fetchData();
  };

  if (selectedInvoice) {
    return (
      <UpdateInvoice
        invoice={selectedInvoice}
        onBack={handleBackToInvoices}
        onUpdate={fetchData}
      />
    );
  }
  return (
    <div className=" m-10 p-4 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaInbox className="text-indigo-600 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-800">
            Customer Management
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">
                    Coupon ID
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Contact</th>
                  <th className="py-4 px-6 text-left font-semibold">Offer</th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Claimed on
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">Invoice</th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Cashback Given
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Remaining
                  </th>
                  {user?.mode === "Offline" && (
                    <th className="py-4 px-6 text-left font-semibold">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: customersPerPage }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 animate-pulse"
                  >
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    {user?.mode === "Offline" && (
                      <td className="py-4 px-6">
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center py-6">
            <FaSpinner className="text-indigo-600 text-3xl animate-spin" />
          </div>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <FaUser className="mx-auto text-gray-300 text-5xl mb-4" />
          <p className="text-xl text-gray-500">No customer data available</p>
          <p className="text-gray-400 mt-2">
            Customer information will appear here once available
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold">
                      Coupon ID
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Customer
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Contact
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">Offer</th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Claimed on
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Invoice
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Cashback Given
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Remaining
                    </th>
                    {user?.mode === "Offline" && (
                      <th className="py-4 px-6 text-left font-semibold">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map((customer, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-xs font-medium">
                          {customer.claimedCouponCode}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700">
                            {customer.claimedCouponCodeUserName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {customer.customerEmail}
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-medium">
                          {customer.discount}%
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {customer.claimedDate}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {customer.pdfUrl ? (
                          <Link
                            to={customer.pdfUrl}
                            target="_blank"
                            download
                            className="inline-flex items-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg transition-colors"
                          >
                            <FaEye className="mr-2" />
                            View
                          </Link>
                        ) : (
                          <span className="text-gray-400 inline-flex items-center">
                            <FaFileInvoice className="mr-2" />
                            No PDF
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="mr-2 text-green-500" />
                          <span className="font-medium text-gray-700">
                            Rs. {customer.userCashback?.toFixed(2) || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div
                          className={`font-medium ${
                            customer.remainingCashback > 0
                              ? "text-orange-600"
                              : "text-gray-400"
                          }`}
                        >
                          Rs. {customer.remainingCashback?.toFixed(2) || 0}
                        </div>
                      </td>
                      {user?.mode === "Offline" && (
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleNotifyUser(customer)}
                              disabled={
                                customer.remainingCashback === 0 ||
                                sendingEmail === customer.id
                              }
                              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {sendingEmail === customer.id ? (
                                <>
                                  <FaSpinner className="animate-spin mr-2" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <FaBell className="mr-2" />
                                  Notify
                                </>
                              )}
                            </button>
                            <button
                              disabled={
                                customer.remainingCashback === 0 ||
                                sendingEmail === customer.id
                              }
                              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleViewInvoice(customer)}
                            >
                              <FaEdit className="mr-2" />
                              Update
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="inline-flex items-center rounded-lg shadow-sm border border-gray-200 bg-white">
                <button
                  className="flex items-center px-4 py-2 border-r border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:bg-white"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft className="mr-2" />
                  Previous
                </button>
                <div className="px-4 py-2 text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  className="flex items-center px-4 py-2 border-l border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:bg-white"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <FaChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Customers;