import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './db/connect.js';

dotenv.config();

const port = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

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
