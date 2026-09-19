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

    const fn = typeof firstname === "string" ? firstname.trim() : "";
    const ln = typeof lastname === "string" ? lastname.trim() : "";

    // Basic validation
    if (!fn || !email || !attending) {
      res.status(400).json({
        success: false,
        message: "First name, email, and attending status are required.",
      });
      return;
    }

    // Check for duplicate submission by guest identity (firstname and lastname)
    const duplicateQuery: Record<string, any> = {
      firstname: { $regex: new RegExp(`^${escapeRegex(fn)}$`, "i") },
    };
    if (ln) {
      duplicateQuery.lastname = {
        $regex: new RegExp(`^${escapeRegex(ln)}$`, "i"),
      };
    } else {
      duplicateQuery.lastname = { $in: ["", null, undefined] };
    }

    const existing = await Rsvp.findOne(duplicateQuery).lean();
    if (existing) {
      res.status(409).json({
        success: false,
        message:
          "We already received an RSVP for this guest. If you need to make changes, please contact us directly at sweetmango0508@gmail.com",
      });
      return;
    }

    const rsvp = await Rsvp.create({
      firstname: fn,
      lastname: ln,
      email: email.toLowerCase().trim(),
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
          : "Thank you for letting us know. If you change your mind and would like to join us, please let us know at sweetmango0508@gmail.com",
      id: rsvp._id,
    });
  } catch (err: any) {
    if (err?.code === 11000) {
      res.status(409).json({
        success: false,
        message:
          "We already received an RSVP for this guest. If you need to make changes, please contact us directly at sweetmango0508@gmail.com",
      });
      return;
    }
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

/**
 * GET /api/rsvp/:id
 * Find an RSVP by ID
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const rsvp = await Rsvp.findById(id).lean();

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
});

/**
 * PUT /api/rsvp/:id
 * Updates an RSVP by ID
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { attending, dietaryRestrictions, songRequest, message } = req.body;

    const rsvp = await Rsvp.findByIdAndUpdate(
      id,
      { attending, dietaryRestrictions, songRequest, message },
      { new: true },
    );
    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: "RSVP not found.",
      });
    }
    res.json({
      success: true,
      message: "RSVP updated successfully",
      data: rsvp,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/rsvp/:id
 * Delete an RSVP
 */
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "RSVP ID is required.",
        });
      }

      const rsvp = await Rsvp.findByIdAndDelete(id).lean();

      if (!rsvp) {
        return res.status(404).json({
          success: false,
          message: "RSVP not found.",
        });
      }

      res.json({
        success: true,
        message: "RSVP deleted successfully",
        data: rsvp,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
