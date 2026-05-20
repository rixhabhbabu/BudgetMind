import { env } from "../config/env.js";

export async function getRecommendations(_req, res) {
  res.json({
    recommendations: [
      "Reduce food delivery by ₹1,800 this week.",
      "Keep card utilization below 30%.",
      "Move idle balance into emergency savings."
    ],
    source: env.aiServiceUrl
  });
}
