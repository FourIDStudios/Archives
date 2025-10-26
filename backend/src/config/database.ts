import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ArchivedMessage } from '../entities/ArchivedMessage';
import { config } from 'dotenv';

config();

const isProduction = process.env.NODE_ENV === 'production';
const hasPostgresUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource(
  isProduction && hasPostgresUrl
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: false,
        entities: [ArchivedMessage],
        migrations: [],
        subscribers: [],
        ssl: { rejectUnauthorized: false },
      }
    : {
        type: 'sqlite',
        database: process.env.DATABASE_PATH || './data/archive.db',
        synchronize: true, // Always true for SQLite to ensure tables are created
        logging: process.env.NODE_ENV === 'development',
        entities: [ArchivedMessage],
        migrations: [],
        subscribers: [],
      }
);

export async function initializeDatabase() {
  try {
    console.log('🔗 Initializing database...');
    console.log('Environment info:', {
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || 'NOT SET',
      RAILWAY_PROJECT: process.env.RAILWAY_PROJECT || 'NOT SET'
    });
    console.log('Database config:', {
      type: AppDataSource.options.type,
      database: AppDataSource.options.type === 'sqlite' ? (AppDataSource.options as any).database : 'PostgreSQL',
      synchronize: AppDataSource.options.synchronize,
      entities: AppDataSource.options.entities?.length
    });
    
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    
    // Log table existence for SQLite
    if (AppDataSource.options.type === 'sqlite') {
      const result = await AppDataSource.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='archived_messages'"
      );
      console.log('📋 archived_messages table exists:', result.length > 0);
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}