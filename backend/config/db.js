const { Sequelize } = require('sequelize');

let sequelize;

const connectDB = async () => {
  try {
    // Initialize Sequelize with the Supabase connection URL
    sequelize = new Sequelize(process.env.SUPABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });

    await sequelize.authenticate();
    console.log(`✅ Supabase PostgreSQL Connected successfully.`);
    
    // Register models before syncing
    require('../models/Task');

    // Automatically create tables if they don't exist
    await sequelize.sync();
    console.log(`✅ Database synced`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Export a proxy so that `sequelize` is available after `connectDB` is called
module.exports = { 
  get sequelize() { return sequelize; },
  connectDB 
};
