import { useState } from "react";
import { BillPreview } from "../components/scanner/BillPreview.jsx";
import { ReceiptUploader } from "../components/scanner/ReceiptUploader.jsx";

export function Scanner() {
  const [bill, setBill] = useState({ merchant: "BigBasket", total: "₹2,340", tax: "₹112", category: "Groceries", confidence: "94%" });
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <ReceiptUploader onExtract={() => setBill({ merchant: "Reliance Fresh", total: "₹1,845", tax: "₹89", category: "Groceries", confidence: "96%" })} />
      <BillPreview bill={bill} />
    </div>
  );
}
