const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title is required' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description is required' },
      len: {
        args: [20, 5000],
        msg: 'Description must be at least 20 characters',
      },
    },
  },
  status: {
    // Using STRING instead of ENUM for reliable PostgreSQL support on Vercel
    type: DataTypes.STRING,
    defaultValue: 'Pending',
    validate: {
      isIn: {
        args: [['Pending', 'In Progress', 'Completed']],
        msg: 'Status must be Pending, In Progress, or Completed',
      },
    },
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Task;
