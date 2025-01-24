const SingleInvoice = ({ data, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div>
      <div className="print:hidden mx-10 mb-6 flex justify-between items-center">
        <button onClick={onBack} className="text-lg flex items-center gap-2">
          ← Back
        </button>
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        {/* Print/Download Controls - Hidden when printing */}

        {/* Invoice Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div>
                <h2 className="font-semibold">Sonali Beauty Parlour</h2>
                <p className="text-sm text-gray-600">
                  Bang Lamung District, Chon Buri 20150, Kolkata
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <div className="w-8 h-8">
                  <img
                    src="/lovable-uploads/bceb9310-8c4f-425d-bfd3-d157def94c34.png"
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium">SHOPPINESMART</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                DUMDUM, 700028, Kolkata
              </p>
            </div>
          </div>

          {/* Invoice Title */}
          <div className="text-center py-4">
            <h1 className="text-2xl font-bold">INVOICE</h1>
          </div>

          {/* Bill Details */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-gray-600 mb-2">Bill To</h3>
              <p className="font-medium">Tithi Mondal</p>
              <p className="text-sm text-gray-600">Phone No.</p>
              <p className="font-medium">9764676879</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Invoice#</p>
              <p className="font-medium">IN-67778</p>
              <p className="text-gray-600 mt-2 mb-1">Biller</p>
              <p className="font-medium">Akash Pal</p>
            </div>
          </div>

          {/* Date Information */}
          <div className="mt-6">
            <table className="w-full">
              <thead className=" bg-[#179A56] text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Invoice Date</th>
                  <th className="py-2 px-4 text-left">Time</th>
                  <th className="py-2 px-4 text-center">Due date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">14 May, 2024</td>
                  <td className="py-3 px-4">08:05pm</td>
                  <td className="py-3 px-4 text-center">14 May, 2024</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Products Table */}
          <div className="mt-6">
            <table className="w-full">
              <thead className="bg-[#179A56] text-white">
                <tr>
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-left">Product Name</th>
                  <th className="py-2 px-4 text-center">Qty</th>
                  <th className="py-2 px-4 text-right">Price</th>
                  <th className="py-2 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">1.</td>
                  <td className="py-3 px-4">Phone</td>
                  <td className="py-3 px-4 text-center">1X</td>
                  <td className="py-3 px-4 text-right">Rs. 18,000</td>
                  <td className="py-3 px-4 text-right">Rs. 18,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>Rs. 18,000</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax Rate</span>
                <span>0.5%</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>Rs. 18,050</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded">
                <span>Cash Collected</span>
                <span>Rs. 18,050</span>
              </div>
            </div>
          </div>

          {/* Cashback Details */}
          <div className="mt-8 bg-orange-50 border border-orange-100 rounded-lg p-4">
            <p className="text-sm">
              <span className="font-medium">Cashback Details: </span>
              Earn 2.5% cashback at Shopinesmart! Visit{" "}
              <a href="https://shopinesmart.com" className="text-blue-600">
                shopinesmart.com
              </a>
              , upload your invoice, and request your cashback. Use it yourself
              or donate to a good cause or NGO.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-8">
            <p>
              If you need any help please contact:{" "}
              <a href="mailto:help@shopiness.com" className="text-blue-600">
                help@shopiness.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleInvoice;
