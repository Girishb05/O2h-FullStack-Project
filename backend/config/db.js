const { Sequelize } = require('sequelize');

const dbUrl = process.env.SUPABASE_URL || 'postgres://localhost:5432/postgres';

// Initialize Sequelize (won't connect until authenticate/sync is called)
const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL environment variable is missing. Please set it in Vercel settings.');
  }

  try {
    await sequelize.authenticate();
    console.log(`✅ Supabase PostgreSQL Connected successfully.`);
    
    // Register models before syncing
    require('../models/Task');

    // Automatically create tables if they don't exist
    await sequelize.sync();
    console.log(`✅ Database synced`);
    isConnected = true;
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = { 
  sequelize,
  connectDB 
};
