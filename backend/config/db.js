const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

let sequelize;

const connectDB = async () => {
  try {
    // 1. First, connect to MySQL without a database to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS || '',
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.end();

    // 2. Now initialize Sequelize with the database
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS || '',
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
      }
    );

    await sequelize.authenticate();
    console.log(`✅ MySQL Connected: ${process.env.DB_HOST}`);
    
    // Register models before syncing
    require('../models/Task');

    // Automatically create tables if they don't exist
    await sequelize.sync();
    console.log(`✅ Database synced`);
  } catch (error) {
    console.error(`❌ MySQL Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Export a proxy so that `sequelize` is available after `connectDB` is called
module.exports = { 
  get sequelize() { return sequelize; },
  connectDB 
};
