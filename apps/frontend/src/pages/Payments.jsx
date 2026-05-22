import { useEffect, useState } from "react";
import { CardAnalytics } from "../components/payments/CardAnalytics.jsx";
import { CardTracker } from "../components/payments/CardTracker.jsx";
import { UpiConnector } from "../components/payments/UpiConnector.jsx";
import { BankConnector } from "../components/payments/BankConnector.jsx";
import { fetchCardTransactions, fetchCards, fetchUpiTransactions } from "../services/api.js";

export function Payments() {
  const [cards, setCards] = useState([]);
  const [cardTransactions, setCardTransactions] = useState([]);
  const [upiTransactions, setUpiTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadPayments() {
      setLoading(true);
      setError("");
      try {
        const [cardData, cardTransactionData, upiTransactionData] = await Promise.all([
          fetchCards(),
          fetchCardTransactions(),
          fetchUpiTransactions()
        ]);
        if (!active) return;
        setCards(cardData);
        setCardTransactions(cardTransactionData);
        setUpiTransactions(upiTransactionData);
      } catch (err) {
        if (active) setError(err.response?.data?.message ?? "Could not load payment data.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPayments();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {loading && <p className="rounded-md bg-blue-50 p-3 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200 lg:col-span-2">Loading real payment data...</p>}
      {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200 lg:col-span-2">{error}</p>}
      <UpiConnector />
      <CardTracker cards={cards} />
      <BankConnector upiTransactions={upiTransactions} cardTransactions={cardTransactions} />
      <CardAnalytics cards={cards} transactions={cardTransactions} />
    </div>
  );
}
