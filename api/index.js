const dotenv = require('dotenv');
const app = require('../src/app');
const connectDB = require('../src/config/db');

dotenv.config();

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Request handling failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
