import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

export function Chatbot() {
  const [messages, setMessages] = useState([{ role: "assistant", text: "I found three ways to improve your May budget." }]);
  const [text, setText] = useState("");

  function send(event) {
    event.preventDefault();
    if (!text.trim()) return;
    setMessages([...messages, { role: "user", text }, { role: "assistant", text: "Based on your recent data, cap food delivery at ₹3,000 for the next 10 days." }]);
    setText("");
  }

  return (
    <Card className="grid min-h-[460px] grid-rows-[1fr_auto]">
      <div className="grid content-start gap-3">
        {messages.map((item, index) => (
          <p key={index} className={`max-w-[82%] rounded-md p-3 text-sm ${item.role === "assistant" ? "bg-mint text-ink" : "ml-auto bg-ocean text-white"}`}>{item.text}</p>
        ))}
      </div>
      <form onSubmit={send} className="mt-4 flex gap-2">
        <input className="min-h-11 flex-1 rounded-md border border-slate-200 bg-white px-3 outline-none dark:border-slate-700 dark:bg-slate-900" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about your spending" />
        <Button aria-label="Send"><Send size={18} /></Button>
      </form>
    </Card>
  );
}
