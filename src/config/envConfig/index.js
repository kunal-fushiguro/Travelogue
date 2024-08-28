import dotenv from "dotenv";

dotenv.config();

export const { PORT, MONGODB_URL, DB_NAME } = process.env;
