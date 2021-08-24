import { mongoose } from '@typegoose/typegoose';

interface MongooseObject {
  conn: null | typeof mongoose;
  promise: null | Promise<typeof mongoose>;
}

declare global {
  namespace NodeJS {
    interface Global {
      mongooseObj: MongooseObject;
    }
  }
  interface Window {
    gtag: any;
  }
}
