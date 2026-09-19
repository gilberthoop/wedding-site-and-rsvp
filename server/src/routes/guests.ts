import { Router, Request, Response, NextFunction } from "express";
import { Guest } from "../models/Guest";
import { findBestGuestMatch } from "../utils/fuzzyMatch";

const router = Router();

const escapeRegex = (s: string) =>
  s.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * POST /api/guests
 * Create a new guest
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstname, lastname } = req.body;

    const fn = typeof firstname === "string" ? firstname.trim() : "";
    const ln = typeof lastname === "string" ? lastname.trim() : "";

    if (!fn || !ln) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required.",
      });
    }

    // Case-insensitive duplicate check
    const existingGuest = await Guest.findOne({
      firstname: { $regex: new RegExp(`^${escapeRegex(fn)}$`, "i") },
      lastname: { $regex: new RegExp(`^${escapeRegex(ln)}$`, "i") },
    }).lean();

    if (existingGuest) {
      return res.status(409).json({
        success: false,
        message: "Guest already exists.",
      });
    }

    const guest = await Guest.create({ firstname: fn, lastname: ln });

    res.status(201).json({
      success: true,
      message: "Guest added successfully",
      data: guest,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/guests
 * Fetch all guests
 */
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const guests = await Guest.find()
      .sort({ firstname: 1, lastname: 1 })
      .lean();
    res.json({
      success: true,
      data: guests,
      total: guests.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/guests/search?firstname=...&lastname=...
 * Search guest by query params with fuzzy matching fallback
 */
router.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const firstname = (req.query.firstname as string) || "";
      const lastname = (req.query.lastname as string) || "";

      if (!firstname.trim() || !lastname.trim()) {
        return res.status(400).json({
          success: false,
          message: "First name and last name are required.",
        });
      }

      // 1. Attempt exact case-insensitive regex search
      const exactMatch = await Guest.findOne({
        firstname: { $regex: new RegExp(`^${escapeRegex(firstname)}$`, "i") },
        lastname: { $regex: new RegExp(`^${escapeRegex(lastname)}$`, "i") },
      }).lean();

      if (exactMatch) {
        return res.json({
          success: true,
          data: exactMatch,
        });
      }

      // 2. Fallback to fuzzy matching across guest list
      const allGuests = await Guest.find().lean();
      const fuzzyMatch = findBestGuestMatch(firstname, lastname, allGuests);

      if (!fuzzyMatch) {
        return res.status(404).json({
          success: false,
          message: "Guest not found.",
        });
      }

      res.json({
        success: true,
        data: fuzzyMatch,
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * DELETE /api/guests/:id
 * Delete a guest
 */
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Guest ID is required.",
        });
      }

      const guest = await Guest.findByIdAndDelete(id).lean();

      if (!guest) {
        return res.status(404).json({
          success: false,
          message: "Guest not found.",
        });
      }

      res.json({
        success: true,
        message: "Guest deleted successfully",
        data: guest,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
