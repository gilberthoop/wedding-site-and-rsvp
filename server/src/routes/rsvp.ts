import { Router, Request, Response, NextFunction } from 'express';
import { Rsvp } from '../models/Rsvp';

const router = Router();

// ── Feature flag ──────────────────────────────────────
// Set RSVP_OPEN=true in your .env when you're ready to accept RSVPs.
const RSVP_OPEN = process.env.RSVP_OPEN === 'true';

/**
 * POST /api/rsvp
 * Submit an RSVP. Returns 503 while RSVP is not yet open.
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!RSVP_OPEN) {
      res.status(503).json({
        success: false,
        message: 'RSVP is not yet open. Please check back closer to the wedding date.',
        opensAt: null, // Add a date string here when known
      });
      return;
    }

    const { name, email, attending, guestCount, dietaryRestrictions, songRequest, message } =
      req.body;

    // Basic validation
    if (!name || !email || !attending) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and attending status are required.',
      });
      return;
    }

    // Check for duplicate submission by email
    const existing = await Rsvp.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(409).json({
        success: false,
        message:
          "We already received an RSVP from this email. Please contact us directly to make changes.",
      });
      return;
    }

    const rsvp = await Rsvp.create({
      name,
      email,
      attending,
      guestCount: guestCount ?? 1,
      dietaryRestrictions,
      songRequest,
      message,
    });

    res.status(201).json({
      success: true,
      message: attending === 'yes'
        ? "We can't wait to celebrate with you! 🎉"
        : "Thank you for letting us know. We'll miss you!",
      id: rsvp._id,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/rsvp
 * Admin-only: list all RSVPs with summary stats.
 * TODO: Add authentication middleware before deploying to production.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [rsvps, attending, notAttending] = await Promise.all([
      Rsvp.find().sort({ submittedAt: -1 }),
      Rsvp.countDocuments({ attending: 'yes' }),
      Rsvp.countDocuments({ attending: 'no' }),
    ]);

    const totalGuests = rsvps
      .filter((r) => r.attending === 'yes')
      .reduce((sum, r) => sum + r.guestCount, 0);

    res.json({
      success: true,
      summary: {
        total: rsvps.length,
        attending,
        notAttending,
        maybe: rsvps.length - attending - notAttending,
        totalGuests,
      },
      data: rsvps,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
