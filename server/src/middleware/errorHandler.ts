import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  status?: number;
  code?: number; // Mongoose duplicate key code
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  // Express requires 4-param signature for error handlers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  console.error("[ErrorHandler]", err);

  // Mongoose duplicate key error (e.g., unique email)
  if (err.code === 11000) {
    res.status(409).json({
      success: false,
      message: "A record with this information already exists.",
    });
    return;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongoose cast error (bad ID format etc.)
  if (err.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid data format.",
    });
    return;
  }

  // Generic fallback
  const status = err.status ?? 500;
  res.status(status).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again."
        : err.message || "Internal server error",
  });
};
