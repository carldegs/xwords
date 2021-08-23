import { mongoose } from '@typegoose/typegoose';

let mongooseConnection = global.mongooseObj;

if (!mongooseConnection) {
  mongooseConnection = global.mongooseObj = { conn: null, promise: null };
}

async function connectMongo(): Promise<typeof mongoose> {
  if (mongooseConnection.conn) {
    return mongooseConnection.conn;
  }

  if (!mongooseConnection.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      useFindAndModify: false,
      useCreateIndex: true,
    };

    mongooseConnection.promise = mongoose
      .connect(process.env.DATABASE_URL, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  mongooseConnection.conn = await mongooseConnection.promise;
  return mongooseConnection.conn;
}

export default connectMongo;
