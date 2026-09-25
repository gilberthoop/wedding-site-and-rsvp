import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Admin } from "../models/Admin";

/**
 * Usage:
 * `npm run seed:admin <username> <password>`
 */

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Please ensure .env contains MONGODB_URI.",
    );
  }

  const username = (process.env.ADMIN_USERNAME || process.argv[2] || "admin")
    .trim()
    .toLowerCase();
  const password =
    process.env.ADMIN_PASSWORD || process.argv[3] || "WeddingAdmin2027!";
  // const email = (process.env.ADMIN_EMAIL || process.argv[4] || "")
  //   .trim()
  //   .toLowerCase();

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`Admin user "${username}" already exists.`);
    await mongoose.connection.close();
    return;
  }

  const admin = await Admin.create({
    username,
    password,
    // email: email || undefined,
    role: "admin",
  });

  console.log(`Admin user "${admin.username}" created successfully!`);
  console.log(`Username: ${admin.username}`);
  console.log(`Password: ${password}`);
  console.log("You can now sign in at /admin or send requests using the API.");

  await mongoose.connection.close();
}

seedAdmin().catch(async (err) => {
  console.error("Error creating admin user:", err);
  await mongoose.connection.close();
  process.exit(1);
});
