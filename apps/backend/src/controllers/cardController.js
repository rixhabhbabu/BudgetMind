import { Card } from "../models/Card.js";

export async function listCards(req, res, next) {
  try {
    const cards = await Card.find({ userId: req.user.id });
    res.json({ cards });
  } catch (error) {
    next(error);
  }
}

export async function createCard(req, res, next) {
  try {
    const card = await Card.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ card });
  } catch (error) {
    next(error);
  }
}
