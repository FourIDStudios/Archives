import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ArchivedMessage } from '../entities/ArchivedMessage';
import { config } from 'dotenv';

config();

const isProduction = process.env.DATABASE_URL;

export const AppDataSource = new DataSource(
  isProduction
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: process.env.NODE_ENV === 'development',
        entities: [ArchivedMessage],
        migrations: [],
        subscribers: [],
        ssl: { rejectUnauthorized: false },
      }
    : {
        type: 'sqlite',
        database: process.env.DATABASE_PATH || './data/archive.db',
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
        entities: [ArchivedMessage],
        migrations: [],
        subscribers: [],
      }
);

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}