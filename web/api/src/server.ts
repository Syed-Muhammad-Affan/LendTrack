import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import { config } from './config/config.js';

dotenv.config();

const port = config.server.port;

const start = async () => {
  try {
    const mongoURI = config.database.mongoUri;

    if (!mongoURI) {
      throw new Error('MONGO_URI is missing');
    }

    await connectDB(mongoURI);
    app.listen(port, () => {
      console.log(`Server is listening at port ${port}...`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

start();
