import 'dotenv/config';
import { Sequelize } from 'sequelize';

// Connection pool configuration
const poolConfig = {
  max: parseInt(process.env.DB_POOL_MAX || '20'), // Maximum number of connections in pool
  min: parseInt(process.env.DB_POOL_MIN || '5'),  // Minimum number of connections in pool
  acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'), // Maximum time (ms) to wait for connection
  idle: parseInt(process.env.DB_POOL_IDLE || '10000'), // Maximum time (ms) a connection can be idle
  evict: parseInt(process.env.DB_POOL_EVICT || '1000'), // Interval (ms) to check for idle connections
};

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'nawy_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: poolConfig,
    dialectOptions: {
      // Additional PostgreSQL-specific options
      connectTimeout: 10000, // Connection timeout in milliseconds
    },
  }
);

// Test connection
export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
