const dotenv = require('dotenv');

dotenv.config();

const app = require('../src/app');
const connectDB = require('../src/config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
    return await app(req, res);
  } catch (error) {
    console.error('Request handling failed:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
