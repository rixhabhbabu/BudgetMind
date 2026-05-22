import { useState } from "react";
import { Smartphone } from "lucide-react";
import { parseUpiMessage } from "../../services/api.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

export function UpiConnector() {
  const [message, setMessage] = useState("");
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function parseMessage() {
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const parsed = await parseUpiMessage(message);
      setTransaction(parsed);
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not parse this UPI message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-mint text-ocean"><Smartphone /></div>
        <div>
          <h2 className="text-lg font-black">UPI inbox parser</h2>
          <p className="text-sm text-slate-500">Paste a real bank alert to parse it.</p>
        </div>
      </div>
      <textarea className="mb-3 min-h-28 w-full rounded-md border border-slate-200 bg-white p-3 outline-none dark:border-slate-700 dark:bg-slate-900" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Paste UPI SMS or bank alert" />
      <Button onClick={parseMessage} disabled={loading || !message.trim()}>{loading ? "Parsing..." : "Parse UPI message"}</Button>
      {error && <p className="mt-3 text-sm font-semibold text-coral">{error}</p>}
      {transaction && (
        <div className="mt-4 grid gap-2 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-900">
          <strong>{transaction.merchant}</strong>
          <span className="text-slate-500">₹{Number(transaction.amount ?? 0).toLocaleString("en-IN")} • {transaction.paymentSource ?? "UPI"} • {transaction.category}</span>
        </div>
      )}
    </Card>
  );
}
