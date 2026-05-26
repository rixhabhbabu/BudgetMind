import { Send, Loader, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { api } from "../../services/api.js";

const QUICK_QUESTIONS = [
  "Show my spending",
  "How to save money?",
  "Budget tips",
  "Financial health",
  "Unusual transactions",
  "Set savings goal"
];

export function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm BudgetMind AI. Ask me about your spending, budget planning, savings, or financial goals. 💡",
      showQuickStart: true
    },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(event, messageText = null) {
    event?.preventDefault();

    const messageToSend = messageText || text;
    if (!messageToSend.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: messageToSend }]);
    setText("");
    setLoading(true);

    try {
      // Call AI chatbot endpoint
      const response = await api.post("/api/ai/chat", {
        message: messageToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "I couldn't generate a response. Please try again.",
          intent: data.intent,
          suggestedActions: data.suggestedActions,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I encountered an error. Please try again or rephrase your question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="grid min-h-[500px] grid-rows-[1fr_auto] overflow-hidden">
      <div className="overflow-y-auto p-4">
        <div className="grid content-start gap-3">
          {messages.map((item, index) => (
            <div key={index}>
              <p
                className={`max-w-[85%] rounded-md p-3 text-sm ${
                  item.role === "assistant"
                    ? "bg-mint text-ink"
                    : "ml-auto bg-ocean text-white"
                }`}
              >
                {item.text}
              </p>
              
              {item.showQuickStart && !loading && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {QUICK_QUESTIONS.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        send(e, question);
                      }}
                      className="rounded-md border border-ocean/30 bg-ocean/5 px-3 py-2 text-left text-xs font-medium text-ocean hover:bg-ocean/10 dark:bg-ocean/10 dark:text-ocean dark:hover:bg-ocean/20"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
              
              {item.suggestedActions && item.suggestedActions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        send(e, action);
                      }}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2">
              <Loader size={16} className="animate-spin text-ocean" />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Thinking...
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={send} className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex gap-2">
          <input
            className="min-h-11 flex-1 rounded-md border border-slate-200 bg-white px-3 outline-none dark:border-slate-700 dark:bg-slate-900"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
          />
          <Button
            aria-label="Send"
            disabled={loading || !text.trim()}
            type="submit"
            title="Send message"
          >
            <Send size={18} />
          </Button>
        </div>
      </form>
    </Card>
  );
}
