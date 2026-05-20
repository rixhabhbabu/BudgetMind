import { Notification } from "../models/Notification.js";

export async function listNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { readAt: new Date() }, { new: true });
    res.json({ notification });
  } catch (error) {
    next(error);
  }
}
