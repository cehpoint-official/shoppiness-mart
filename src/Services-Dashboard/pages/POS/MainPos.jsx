import { useState } from "react";
import POS from "./POS";
import Invoice from "./Invoice";

const MainPos = () => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const handleGenerateInvoice = (data) => {
    setInvoiceData(data);
    setShowInvoice(true);
  };

  return (
    <div className="min-h-screen  py-8">
      {!showInvoice ? (
        <POS onGenerateInvoice={handleGenerateInvoice} />
      ) : (
        <Invoice data={invoiceData} onBack={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default MainPos;
