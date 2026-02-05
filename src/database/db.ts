import mongoose from "mongoose";

const url: string = process.env.MONGO_URI as string;
let connection: typeof mongoose | null = null;

/**
 * Makes a connection to a MongoDB database. If a connection already exists, does nothing
 * Call this function before all api routes
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  if (connection) {
    return connection;
  }

  if (!url) {
    throw new Error("MONGO_URI is not set");
  }

  connection = await mongoose.connect(url);
  return connection;
};

export default connectDB;
