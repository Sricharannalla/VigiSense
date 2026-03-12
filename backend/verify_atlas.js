import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log("Attempting to connect to:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB!");
    console.log("Host:", mongoose.connection.host);
    console.log("Database Name:", mongoose.connection.name);
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
