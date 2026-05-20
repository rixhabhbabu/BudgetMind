import { Goal } from "../models/Goal.js";
import { calculateGoalContribution } from "../services/goalService.js";
import { recordAudit } from "../services/auditService.js";

export async function listGoals(req, res, next) {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ deadline: 1 });
    res.json({ goals: goals.map((goal) => ({ ...goal.toObject(), coaching: calculateGoalContribution(goal) })) });
  } catch (error) {
    next(error);
  }
}

export async function createGoal(req, res, next) {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user.id });
    await recordAudit(req.user.id, "goal.create", "Goal", { name: goal.name });
    res.status(201).json({ goal });
  } catch (error) {
    next(error);
  }
}
