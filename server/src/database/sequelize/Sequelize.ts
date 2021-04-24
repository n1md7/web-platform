import {Sequelize} from "sequelize";

const connection = new Sequelize({
    dialect: "mysql",
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    password: process.env.MYSQL_PASS,
    port: Number(process.env.MYSQL_PORT),
});

export default connection;