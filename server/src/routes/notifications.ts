import { Router, Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification';

const router = Router();

/**
 * POST /api/notifications
 * Save an email notification signup.
 * Gracefully handles duplicates (returns 200 so the UX stays clean).
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({
        success: false,
        message: 'A valid email address is required.',
      });
      return;
    }

    // Check for existing signup
    const existing = await Notification.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      // Treat as success — don't leak that an email is already registered
      res.status(200).json({
        success: true,
        message: "You're already on the list! We'll let you know when RSVP opens.",
      });
      return;
    }

    const notification = await Notification.create({ email });

    res.status(201).json({
      success: true,
      message: "You're on the list! We'll notify you when RSVP opens. 💌",
      id: notification._id,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/notifications
 * Admin-only: list all notification signups.
 * TODO: Add authentication middleware before deploying to production.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .select('email createdAt');

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
