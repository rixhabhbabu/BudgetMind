import { useEffect, useState } from "react";
import { BillPreview } from "../components/scanner/BillPreview.jsx";
import { ReceiptUploader } from "../components/scanner/ReceiptUploader.jsx";
import { Card } from "../components/ui/Card.jsx";
import { fetchBills, uploadBill } from "../services/api.js";

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "No date";
}

export function Scanner() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadBills() {
      try {
        const data = await fetchBills();
        if (!active) return;
        setBills(data);
        setSelectedBill(data[0] ?? null);
      } catch (err) {
        if (active) setError(err.response?.data?.message ?? "Could not load bills.");
      }
    }
    loadBills();
    return () => {
      active = false;
    };
  }, []);

  async function handleExtract(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = await uploadBill(file);
      setSelectedBill(data.bill);
      setBills((current) => [data.bill, ...current]);
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not extract this bill.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <div className="grid gap-5">
        <ReceiptUploader onExtract={handleExtract} uploading={uploading} />
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
        <Card>
          <h2 className="mb-3 text-lg font-black">Uploaded bills</h2>
          <div className="grid gap-3">
            {bills.length ? bills.map((bill) => (
              <button key={bill._id} type="button" onClick={() => setSelectedBill(bill)} className="rounded-md border border-slate-100 p-3 text-left text-sm transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
                <strong className="block">{bill.extractedMerchant ?? "Unknown merchant"}</strong>
                <span className="text-slate-500">₹{Number(bill.extractedAmount ?? 0).toLocaleString("en-IN")} • {formatDate(bill.extractedDate ?? bill.createdAt)}</span>
              </button>
            )) : <p className="text-sm font-semibold text-slate-500">No bills uploaded yet.</p>}
          </div>
        </Card>
      </div>
      <BillPreview bill={selectedBill} />
    </div>
  );
}
