import { useCallback, useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BiSortAlt2, BiSearch } from "react-icons/bi";
import SingleInvoice from "./SingleInvoice";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import UpdatePos from "../../components/Invoices/UpdatePos";

const InvoiceSkeleton = () => (
  <tr className="animate-pulse">
    {[...Array(11)].map((_, index) => (
      <td key={index} className="p-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const Invoice = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedInvoiceUpdate, setSelectedInvoiceUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const customersPerPage = 5;
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "claimedCouponsDetails")
      );
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

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleBackToInvoices = () => {
    setSelectedInvoice(null);
    setSelectedInvoiceUpdate(null);
    fetchData();
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (selectedInvoice) {
    return (
      <SingleInvoice
        invoice={selectedInvoice}
        onBack={handleBackToInvoices}
        onUpdate={fetchData}
      />
    );
  }
  if (selectedInvoiceUpdate) {
    return (
      <UpdatePos
        invoiceDetails={selectedInvoiceUpdate}
        onBack={handleBackToInvoices}
        onUpdate={fetchData}
      />
    );
  }
  console.log(currentCustomers);

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-normal text-gray-900">
          Customer Invoices
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by invoice no. or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-64"
            />
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            onClick={toggleSortOrder}
            className="px-4 py-2 text-blue-500 border border-blue-500 font-bold rounded-md flex items-center gap-2"
          >
            <BiSortAlt2 className="w-5 h-5" />
            Sort by Date {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  "Invoice No.",
                  "Customer Name",
                  "Amount",
                  "Paid",
                  "Due",
                  "Cashback Given",
                  "Remaining Cashback",
                  "Billing Date",
                  "Due Date",
                  "Invoice",
                  "Update Invoice",
                ].map((header) => (
                  <th
                    key={header}
                    className="text-left p-4 text-gray-500 font-normal"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <InvoiceSkeleton key={index} />
              ))}
            </tbody>
          </table>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No invoices available
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Invoice No.
                  </th>
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Customer Name
                  </th>
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Amount
                  </th>
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Paid
                  </th>
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Due
                  </th>
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Cashback Given
                  </th>
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Remaining Cashback
                  </th>
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Billing Date
                  </th>
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Due Date
                  </th>
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Invoice
                  </th>
                  <th className="text-left p-4 text-gray-500 font-normal">
                    Update Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((invoice, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-900">#{invoice.invoiceNum}</td>
                    <td className="p-4 text-gray-900">
                      {invoice.customerName || "-"}
                    </td>
                    <td className="p-4 text-gray-900">{invoice.totalAmount}</td>
                    <td className="p-4 text-gray-900">{invoice.paidAmount}</td>
                    <td className="p-4 text-gray-900">{invoice.dueAmount}</td>
                    <td className="p-4 text-gray-900">
                      {invoice.userCashback || 0}
                    </td>
                    <td className="p-4 text-gray-900">
                      {invoice.remainingCashback || 0}
                    </td>
                    <td className="p-4 text-gray-900">
                      {invoice.billingDate || "-"}
                    </td>
                    <td className="p-4 text-gray-900">
                      {invoice.dueAmount > 0 ? invoice.dueDate || "-" : "-"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="px-4 py-2 text-blue-500 border border-blue-500 rounded-md flex items-center gap-2"
                      >
                        <AiOutlineEye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                    {!invoice.claimedCouponCode && (
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedInvoiceUpdate(invoice)}
                          className="px-4 py-2 text-white border bg-blue-500 rounded-md flex items-center gap-2"
                        >
                          <AiOutlineEye className="w-4 h-4" />
                          Update
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center p-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoice;
