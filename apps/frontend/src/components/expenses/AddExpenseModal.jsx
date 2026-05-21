import { useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";

export function AddExpenseModal({ open, onClose }) {
  const [saved, setSaved] = useState(false);
  return (
    <Modal title="Add expense" open={open} onClose={onClose}>
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>
        <Input label="Merchant" placeholder="Coffee House" />
        <Input label="Amount" type="number" placeholder="450" />
        <Input label="Category" placeholder="Food" />
        {saved && <p className="rounded-md bg-blue-50 p-3 text-sm font-semibold text-blue-700">Expense saved in demo mode.</p>}
        <Button type="submit">Save expense</Button>
      </form>
    </Modal>
  );
}
