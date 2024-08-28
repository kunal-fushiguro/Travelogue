import mongoose from "mongoose";
import { MONGODB_URL, DB_NAME } from "../envConfig/index.js";

async function databaseConnect() {
  try {
    await mongoose.connect(MONGODB_URL, {
      dbName: DB_NAME,
      bufferCommands: false,
    });
    console.log("Database Connected.");
  } catch (error) {
    console.log("Database connection error : " + error.message);
    process.exit(1);
  }
}

export { databaseConnect };
