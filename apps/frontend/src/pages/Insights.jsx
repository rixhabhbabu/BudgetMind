import { Brain, TrendingUp } from "lucide-react";
import { Chatbot } from "../components/ai/Chatbot.jsx";
import { Card } from "../components/ui/Card.jsx";

export function Insights() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid content-start gap-5">
        <Card>
          <div className="mb-3 flex items-center gap-3"><Brain className="text-ocean" /><h2 className="text-xl font-black">AI spend analysis</h2></div>
          <p className="text-slate-600 dark:text-slate-300">Discretionary spending is trending down 7% while recurring subscriptions increased by ₹948.</p>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-3"><TrendingUp className="text-coral" /><h2 className="text-xl font-black">Prediction</h2></div>
          <p className="text-slate-600 dark:text-slate-300">Projected month-end balance is ₹43,800 if current daily spend stays below ₹1,450.</p>
        </Card>
      </div>
      <Chatbot />
    </div>
  );
}
