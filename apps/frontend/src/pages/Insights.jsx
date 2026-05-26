import { Brain, TrendingUp, AlertCircle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Chatbot } from "../components/ai/Chatbot.jsx";
import { AdvancedInsights } from "../components/insights/AdvancedInsights.jsx";
import { Card } from "../components/ui/Card.jsx";
import { api } from "../services/api.js";

export function Insights() {
  const [analysis, setAnalysis] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAIInsights();
  }, []);

  async function fetchAIInsights() {
    try {
      setLoading(true);
      setError(null);

      // Fetch both analysis and prediction
      const [analysisRes, predictionRes] = await Promise.all([
        api.get("/api/ai/analyze"),
        api.get("/api/ai/predict"),
      ]);

      if (analysisRes.ok) {
        const analysisData = await analysisRes.json();
        setAnalysis(analysisData.analysis || analysisData);
      }

      if (predictionRes.ok) {
        const predictionData = await predictionRes.json();
        setPrediction(predictionData.prediction || predictionData);
      }
    } catch (err) {
      console.error("Failed to fetch AI insights:", err);
      setError("Failed to load AI insights. Try adding more expenses.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-lg bg-slate-50 p-12 dark:bg-slate-900">
        <Loader size={24} className="animate-spin text-ocean" />
        <p className="text-slate-600 dark:text-slate-300">Analyzing your spending...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="grid content-start gap-5">
        <AdvancedInsights />
      </div>
      <div className="grid content-start gap-5">
        <div className="grid content-start gap-5">
          {error ? (
            <Card className="border border-coral/30 bg-coral/5">
              <div className="mb-3 flex items-center gap-3">
                <AlertCircle className="text-coral" />
                <h2 className="text-xl font-black">No Data Yet</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{error}</p>
            </Card>
          ) : (
            <>
              {analysis && (
                <Card>
                  <div className="mb-3 flex items-center gap-3">
                    <Brain className="text-ocean" />
                    <h2 className="text-xl font-black">AI Spend Analysis</h2>
                  </div>
                  <div className="space-y-3">
                    {analysis.recommendations && analysis.recommendations.length > 0 ? (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {analysis.recommendations[0]}
                        </p>
                        {analysis.topCategory && (
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Your top spending category is{" "}
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {analysis.topCategory}
                            </span>
                            {analysis.statistics?.totalSpent
                              ? ` at ₹${analysis.statistics.totalSpent.toLocaleString()}`
                              : ""}
                          </p>
                        )}
                        {analysis.savingsPotential && (
                          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            💰 Potential savings: ₹{analysis.savingsPotential.toLocaleString()} monthly
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-slate-600 dark:text-slate-300">
                        Add more expenses to get personalized insights.
                      </p>
                    )}
                </div>
              </Card>
            )}

            {prediction && (
              <Card>
                <div className="mb-3 flex items-center gap-3">
                  <TrendingUp className="text-coral" />
                  <h2 className="text-xl font-black">Spending Prediction</h2>
                </div>
                <div className="space-y-3">
                  {prediction.projectedMonthEnd ? (
                    <>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Projected month-end spend:{" "}
                        <span className="font-semibold text-slate-900 dark:text-white">
                          ₹{prediction.projectedMonthEnd.toLocaleString()}
                        </span>
                      </p>
                      {prediction.remainingBudget !== undefined && (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Remaining budget:{" "}
                          <span
                            className={`font-semibold ${
                              prediction.remainingBudget > 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-coral"
                            }`}
                          >
                            ₹{prediction.remainingBudget.toLocaleString()}
                          </span>
                        </p>
                      )}
                      {prediction.trend && (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Spending trend:{" "}
                          <span className="font-semibold capitalize text-slate-900 dark:text-white">
                            {prediction.trend}
                            {prediction.trendPercentage && ` (${prediction.trendPercentage}%)`}
                          </span>
                        </p>
                      )}
                      {prediction.budgetStatus === "at_risk" && (
                        <p className="text-sm font-medium text-coral">
                          ⚠️ Budget at risk - consider reducing discretionary spending
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-600 dark:text-slate-300">
                      Need more expense data for accurate predictions.
                    </p>
                  )}
                </div>
              </Card>
            )}
            </div>
          </>
        )}
        </div>
        <Chatbot />
      </div>
    </div>
  );
}
