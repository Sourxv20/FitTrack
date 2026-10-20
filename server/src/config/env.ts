import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres@localhost:5433/fittrack?schema=public",
  JWT_SECRET: process.env.JWT_SECRET || "fittrack_super_secure_jwt_secret_token_2026_key",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "fittrack_super_secure_jwt_refresh_token_2026_key",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173"
};
