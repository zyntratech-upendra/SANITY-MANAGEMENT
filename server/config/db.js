const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_sanitation';

  try {
    console.log(`[Database] Connecting to MongoDB Atlas: ${uri.split('@')[1] ? uri.split('@')[1].split('/')[0] : uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[Database] Successfully connected to live MongoDB Atlas host: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error(`[Database Runtime Error]:`, err);
  });
};

module.exports = { connectDB };
