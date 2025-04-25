import { useCallback, useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BiSortAlt2, BiSearch } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import UpdatePos from "../../components/Invoices/UpdatePos";
import { useSelector } from "react-redux";

const Invoice = () => {
  const { user } = useSelector((state) => state.businessUserReducer);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoiceUpdate, setSelectedInvoiceUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const customersPerPage = 5;
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "invoiceDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const customersData = doc.data();
        if (customersData.businessId === id) {
          data.push({ id: doc.id, ...customersData });
        }
      });
      setCustomers(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.invoiceNum?.toString().toLowerCase().includes(searchLower) ||
      customer.customerName?.toLowerCase().includes(searchLower)
    );
  });

  const sortedCustomers = filteredCustomers.sort((a, b) => {
    const dateA = new Date(a.billingDate);
    const dateB = new Date(b.billingDate);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = sortedCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(sortedCustomers.length / customersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleBackToInvoices = () => {
    setSelectedInvoiceUpdate(null);
    fetchData();
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (selectedInvoiceUpdate) {
    return (
      <UpdatePos
        invoiceDetails={selectedInvoiceUpdate}
        onBack={handleBackToInvoices}
        onUpdate={fetchData}
      />
    );
  }

  // Create mobile card view for each invoice
  const renderMobileCard = (invoice, index) => (
    <div key={index} className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
      <div className="flex justify-between mb-2">
        <span className="font-medium">Invoice #{invoice.invoiceNum}</span>
        <span className={`text-sm ${invoice.dueAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
          {invoice.dueAmount > 0 ? 'Due' : 'Paid'}
        </span>
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Customer:</span>
          <span className="text-sm">{invoice.customerName || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Amount:</span>
          <span className="text-sm">{invoice.totalAmount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Paid:</span>
          <span className="text-sm">{invoice.paidAmount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Due:</span>
          <span className="text-sm">{invoice.dueAmount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Billing Date:</span>
          <span className="text-sm">{invoice.billingDate || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Due Date:</span>
          <span className="text-sm">{invoice.dueAmount > 0 ? invoice.dueDate || "-" : "-"}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Link
          to={invoice.pdfUrl}
          className="inline-flex items-center justify-center px-3 py-2 text-blue-500 border border-blue-500 rounded-md text-sm hover:bg-blue-50 transition-colors"
        >
          <AiOutlineEye className="w-4 h-4 mr-1" />
          View Invoice
        </Link>
        {!invoice.claimedCouponCode && (
          <button
            onClick={() => setSelectedInvoiceUpdate(invoice)}
            className="inline-flex items-center justify-center px-3 py-2 text-white bg-blue-500 border rounded-md text-sm hover:bg-blue-600 transition-colors"
          >
            <AiOutlineEye className="w-4 h-4 mr-1" />
            Update Invoice
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-normal text-gray-900">
          Customer Invoices
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            onClick={toggleSortOrder}
            className="w-full sm:w-auto px-4 py-2 text-blue-500 border border-blue-500 rounded-md flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
          >
            <BiSortAlt2 className="w-5 h-5" />
            <span className="text-sm">Sort by Date {sortOrder === "asc" ? "↑" : "↓"}</span>
          </button>
        </div>
      </div>

      {/* Table Container - Only visible on md screens and above */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
        {loading ? (
          <div className="w-full p-6 text-center">
            <div className="animate-pulse text-gray-500">Loading invoices...</div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No invoices available
          </div>
        ) : (
          <>
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Invoice No.",
                    "Customer Name",
                    "Amount",
                    "Paid",
                    "Due",
                    "Billing Date",
                    "Due Date",
                    "Invoice",
                    "Update Invoice",
                  ].map((header) => (
                    <th
                      key={header}
                      className="text-left p-4 text-gray-500 font-normal text-xs md:text-sm whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((invoice, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-900 text-sm whitespace-nowrap">
                      #{invoice.invoiceNum}
                    </td>
                    <td className="p-4 text-gray-900 text-sm">
                      {invoice.customerName || "-"}
                    </td>
                    <td className="p-4 text-gray-900 text-sm">{invoice.totalAmount}</td>
                    <td className="p-4 text-gray-900 text-sm">{invoice.paidAmount}</td>
                    <td className="p-4 text-gray-900 text-sm">{invoice.dueAmount}</td>
                    <td className="p-4 text-gray-900 text-sm">
                      {invoice.billingDate || "-"}
                    </td>
                    <td className="p-4 text-gray-900 text-sm">
                      {invoice.dueAmount > 0 ? invoice.dueDate || "-" : "-"}
                    </td>
                    <td className="p-4">
                      <Link
                        to={invoice.pdfUrl}
                        className="inline-flex items-center px-3 py-1 text-blue-500 border border-blue-500 rounded-md text-sm hover:bg-blue-50 transition-colors justify-center"
                      >
                        <AiOutlineEye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </td>
                    {!invoice.claimedCouponCode && (
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedInvoiceUpdate(invoice)}
                          className="inline-flex items-center px-3 py-1 text-white bg-blue-500 border rounded-md text-sm hover:bg-blue-600 transition-colors justify-center"
                        >
                          <AiOutlineEye className="w-4 h-4 mr-1" />
                          Update
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Mobile Card View - Only visible on smaller screens */}
      <div className="md:hidden">
        {loading ? (
          <div className="w-full p-6 text-center">
            <div className="animate-pulse text-gray-500">Loading invoices...</div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No invoices available
          </div>
        ) : (
          <div className="space-y-4">
            {currentCustomers.map((invoice, index) => renderMobileCard(invoice, index))}
          </div>
        )}
      </div>

      {/* Pagination - Same for both views */}
      {!loading && filteredCustomers.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4 bg-white rounded-lg shadow-sm mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors text-sm"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="w-full sm:w-auto px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Invoice;