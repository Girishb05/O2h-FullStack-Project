const { Sequelize } = require('sequelize');

// Initialize Sequelize synchronously
const sequelize = new Sequelize(process.env.SUPABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Supabase PostgreSQL Connected successfully.`);
    
    // Register models before syncing
    require('../models/Task');

    // Automatically create tables if they don't exist
    await sequelize.sync();
    console.log(`✅ Database synced`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
  }
};

module.exports = { 
  sequelize,
  connectDB 
};
