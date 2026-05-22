import { useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";

const initialForm = {
  merchant: "",
  amount: "",
  category: "",
  method: "UPI",
  date: new Date().toISOString().slice(0, 10),
  notes: ""
};

export function AddExpenseModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(form);
      setForm(initialForm);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not save expense.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Add expense" open={open} onClose={onClose}>
      <form className="grid gap-4" onSubmit={submit}>
        <Input label="Merchant" placeholder="Coffee House" value={form.merchant} onChange={(event) => update("merchant", event.target.value)} required />
        <Input label="Amount" type="number" placeholder="450" value={form.amount} onChange={(event) => update("amount", event.target.value)} required />
        <Input label="Category" placeholder="Food" value={form.category} onChange={(event) => update("category", event.target.value)} required />
        <label className="grid gap-2 text-sm font-medium text-slate-600 dark:text-slate-200">
          Method
          <select className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-ink outline-none ring-ocean/20 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={form.method} onChange={(event) => update("method", event.target.value)}>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
          </select>
        </label>
        <Input label="Date" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
        <Input label="Notes" value={form.notes} onChange={(event) => update("notes", event.target.value)} />
        {error && <p className="text-sm font-semibold text-coral">{error}</p>}
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save expense"}</Button>
      </form>
    </Modal>
  );
}
