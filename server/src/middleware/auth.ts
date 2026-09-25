import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "wedding-admin-jwt-secret-key-2027";
const TOKEN_EXPIRY = "7d";

export interface AdminJwtPayload {
  id: string;
  username: string;
  role: string;
}

// Extend Express Request type to include admin payload
export interface AuthenticatedRequest extends Request {
  admin?: AdminJwtPayload;
}

/**
 * Generate a JWT token for an authenticated admin
 */
export const generateAdminToken = (payload: AdminJwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

/**
 * Verify a token and return the payload or null
 */
export const verifyAdminToken = (token: string): AdminJwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
  } catch {
    return null;
  }
};

/**
 * Express middleware to protect admin routes
 */
export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token required. Please sign in as an admin.",
    });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAdminToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please sign in again.",
    });
  }

  (req as AuthenticatedRequest).admin = payload;
  next();
};
