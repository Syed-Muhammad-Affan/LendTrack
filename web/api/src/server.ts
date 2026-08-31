import app from './app.js';
import connectDB from './db/connect.js';
import { config } from './config/config.js';
import { startReminderScheduler } from './services/Reminder.scheduler/reminder.scheduler.js';

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
      startReminderScheduler();
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

start();
