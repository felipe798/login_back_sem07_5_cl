import dotenv from 'dotenv';
dotenv.config();

export const DB_CONFIG = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "testdb",
  PORT: process.env.DB_PORT || 5432,
  dialect: process.env.DB_DIALECT || "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";