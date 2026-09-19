import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Guest } from "../models/Guest";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

async function seedGuests() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Please ensure .env contains MONGODB_URI.",
    );
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log(" Connected to MongoDB.");

  // Path to guests.csv in client/public
  const csvPath = path.resolve(__dirname, "../../../client/public/guests.csv");

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at: ${csvPath}`);
  }

  console.log(` Reading CSV from ${csvPath}...`);
  const fileContent = fs.readFileSync(csvPath, "utf-8");

  const lines = fileContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) {
    console.log("No guest data found in the CSV file.");
    await mongoose.connection.close();
    return;
  }

  // Skip header row ("First Name,Last Name")
  const dataRows = lines.slice(1);

  const parsedGuests = dataRows
    .map((line) => {
      // Split by comma, remove quotes if present, and trim whitespace
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      return {
        firstname: cols[0] || "",
        lastname: cols[1] || "",
      };
    })
    .filter((g) => g.firstname.length > 0);

  console.log(` Found ${parsedGuests.length} valid guest entries in CSV.`);

  // If user passes --clean or --drop as a flag, clear existing records first
  const shouldClean =
    process.argv.includes("--clean") || process.argv.includes("--drop");
  if (shouldClean) {
    const deleteResult = await Guest.deleteMany({});
    console.log(` Cleared ${deleteResult.deletedCount} existing records.`);
  }

  // Use bulkWrite with upsert so running the script repeatedly is safe and won't create duplicates
  const operations = parsedGuests.map((guest) => ({
    updateOne: {
      filter: {
        firstname: {
          $regex: new RegExp(
            `^${guest.firstname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i",
          ),
        },
        lastname: {
          $regex: new RegExp(
            `^${guest.lastname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i",
          ),
        },
      },
      update: {
        $setOnInsert: {
          firstname: guest.firstname,
          lastname: guest.lastname,
        },
      },
      upsert: true,
    },
  }));

  const bulkResult = await Guest.bulkWrite(operations);

  console.log(" Seed completed successfully!");
  console.log(`   - Inserted new guests: ${bulkResult.upsertedCount}`);
  console.log(`   - Already existing guests: ${bulkResult.matchedCount}`);
  console.log(
    `   - Total guests in database now: ${await Guest.countDocuments()}`,
  );

  await mongoose.connection.close();
  console.log(" MongoDB connection closed.");
}

seedGuests().catch(async (err) => {
  console.error("❌ Failed to seed guests:", err);
  try {
    await mongoose.connection.close();
  } catch {
    // Ignore close error on exit
  }
  process.exit(1);
});
