import mongoose from 'mongoose';
import logWrite from '../../logger';

const initMongoDB = async (): Promise<typeof mongoose> => {
    const {
        MONGO_DB_NAME,
        MONGO_HOST,
        MONGO_PORT,
        MONGO_USER,
        MONGO_PASS
    } = process.env;
    const user = MONGO_USER;
    const pass = MONGO_PASS;
    const host = MONGO_HOST;
    const port = MONGO_PORT;
    const database = MONGO_DB_NAME;
    const connectionString = `mongodb://${user}:${pass}@${host}:${port}/${database}`;

    const mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    };
    await mongoose.connect(connectionString, mongoOptions)
        .catch((error) => {
            logWrite.info(`Connection string is "${connectionString}"`);
            throw new Error(error.message || error);
        });
    logWrite.info(`MongoDB connection to database [${database}] successfully established!`);

    return mongoose;
};

export default initMongoDB;
