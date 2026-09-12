import { Router, Request, Response, NextFunction } from "express";
import { Rsvp } from "../models/Rsvp";

const router = Router();

const escapeRegex = (s: string) =>
  s.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ── Feature flag ──────────────────────────────────────
// Set RSVP_OPEN=true in your .env when you're ready to accept RSVPs.
const RSVP_OPEN = process.env.RSVP_OPEN === "true";

/**
 * POST /api/rsvp
 * Submit an RSVP. Returns 503 while RSVP is not yet open.
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!RSVP_OPEN) {
      res.status(503).json({
        success: false,
        message:
          "RSVP is not yet open. Please check back closer to the wedding date.",
        opensAt: null, // Add a date string here when known
      });
      return;
    }

    const {
      firstname,
      lastname,
      email,
      attending,
      dietaryRestrictions,
      songRequest,
      message,
    } = req.body;

    // Basic validation
    if (!firstname || !email || !attending) {
      res.status(400).json({
        success: false,
        message: "First name, email, and attending status are required.",
      });
      return;
    }

    // Check for duplicate submission by email
    const existing = await Rsvp.findOne({
      email: email.toLowerCase().trim(),
    }).lean();
    if (existing) {
      res.status(409).json({
        success: false,
        message:
          "We already received an RSVP from this email. Please contact us directly to make changes.",
      });
      return;
    }

    const rsvp = await Rsvp.create({
      firstname,
      lastname,
      email,
      attending,
      dietaryRestrictions,
      songRequest,
      message,
    });

    res.status(201).json({
      success: true,
      message:
        attending === "yes"
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
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rsvps = await Rsvp.find().sort({ submittedAt: -1 }).lean();

    let attending = 0;
    let notAttending = 0;
    for (const r of rsvps) {
      if (r.attending === "yes") attending++;
      else if (r.attending === "no") notAttending++;
    }

    res.json({
      success: true,
      summary: {
        total: rsvps.length,
        attending,
        notAttending,
        maybe: rsvps.length - attending - notAttending,
      },
      data: rsvps,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/rsvp/search?firstname=...&lastname=...
 * Search an RSVP by first and last name query params.
 */
router.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const firstname = (req.query.firstname as string) || "";
      const lastname = (req.query.lastname as string) || "";

      const rsvp = await Rsvp.findOne({
        firstname: { $regex: new RegExp(`^${escapeRegex(firstname)}$`, "i") },
        lastname: { $regex: new RegExp(`^${escapeRegex(lastname)}$`, "i") },
      }).lean();

      if (!rsvp) {
        return res.status(404).json({
          success: false,
          message: "RSVP not found.",
        });
      }

      res.json({
        success: true,
        data: rsvp,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
