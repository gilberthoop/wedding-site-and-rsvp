import { Router, Request, Response, NextFunction } from "express";
import { Admin } from "../models/Admin";
import {
  generateAdminToken,
  requireAdminAuth,
  AuthenticatedRequest,
} from "../middleware/auth";

const router = Router();

const escapeRegex = (s: string) =>
  s.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * POST /api/admin/signup
 * Create a new admin account
 */
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      const cleanUsername =
        typeof username === "string" ? username.trim().toLowerCase() : "";
      const cleanPassword = typeof password === "string" ? password : "";

      if (!cleanUsername) {
        return res.status(400).json({
          success: false,
          message: "Username is required.",
        });
      }

      if (cleanUsername.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters long.",
        });
      }

      if (!cleanPassword || cleanPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
      }

      // Check if username already exists
      const existingUser = await Admin.findOne({
        username: cleanUsername,
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "An admin with this username already exists.",
        });
      }

      // Create admin
      const admin = await Admin.create({
        username: cleanUsername,
        password: cleanPassword,
        role: "admin",
      });

      const token = generateAdminToken({
        id: admin._id.toString(),
        username: admin.username,
        role: admin.role,
      });

      return res.status(201).json({
        success: true,
        message: "Admin registered successfully.",
        token,
        admin: {
          id: admin._id.toString(),
          username: admin.username,
          role: admin.role,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/admin/login
 * Authenticate admin and return JWT
 */
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      const identifier =
        typeof username === "string" ? username.trim().toLowerCase() : "";
      const cleanPassword = typeof password === "string" ? password : "";

      if (!identifier || !cleanPassword) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required.",
        });
      }

      // Find by username or email
      const admin = await Admin.findOne({
        $or: [{ username: identifier }, { email: identifier }],
      });

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials. Please verify username/password.",
        });
      }

      const isMatch = await admin.comparePassword(cleanPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials. Please verify username/password.",
        });
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      const token = generateAdminToken({
        id: admin._id.toString(),
        username: admin.username,
        role: admin.role,
      });

      return res.json({
        success: true,
        message: "Logged in successfully.",
        token,
        admin: {
          id: admin._id.toString(),
          username: admin.username,
          role: admin.role,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/admin/me
 * Validate current session and retrieve admin info
 */
router.get(
  "/me",
  requireAdminAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const adminId = req.admin?.id;
      const admin = await Admin.findById(adminId).select("-password").lean();

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin account not found.",
        });
      }

      return res.json({
        success: true,
        admin: {
          id: admin._id.toString(),
          username: admin.username,
          role: admin.role,
          createdAt: admin.createdAt,
          lastLogin: admin.lastLogin,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/admin/logout
 */
router.post("/logout", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

export default router;
