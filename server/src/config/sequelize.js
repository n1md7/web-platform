require('dotenv').config();
module.exports = {
    "development": {
        dialect: "mysql",
        host: process.env.MYSQL_HOST,
        username: process.env.MYSQL_USER,
        database: process.env.MYSQL_DB,
        password: process.env.MYSQL_PASS,
        port: Number(process.env.MYSQL_PORT),
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        dialect: "mysql",
        host: process.env.MYSQL_HOST,
        username: process.env.MYSQL_PROD_USER || process.env.MYSQL_USER,
        database: process.env.MYSQL_PROD_DB || process.env.MYSQL_DB,
        password: process.env.MYSQL_PROD_PASS || process.env.MYSQL_PASS,
        port: Number(process.env.MYSQL_PORT),
    }
};