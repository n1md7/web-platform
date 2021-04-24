require('dotenv').config();

const {
    MONGO_DB_NAME,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_USER,
    MONGO_PASS
} = process.env;
const connectionString = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;
console.debug({connectionString});
module.exports = {
    mongodb: {
        url: connectionString,
        databaseName: MONGO_DB_NAME,
        options: {
            useNewUrlParser: true, // removes a deprecation warning when connecting
            useUnifiedTopology: true, // removes a deprecating warning when connecting
            //   connectTimeoutMS: 3600000, // increase connection timeout up to 1 hour
            //   socketTimeoutMS: 3600000, // increase socket timeout up to 1 hour
        }
    },
    // The migrations dir can be a relative or absolute path. Only edit this when really necessary.
    migrationsDir: "./migrations/mongo",
    // The MongoDB collection where the applied changes are stored. Only edit this when really necessary.
    changelogCollectionName: "changelog"
};
