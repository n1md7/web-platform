import Sequelize from "sequelize";
import mysql from "../Sequelize";

export const tableName = "templates";
export default mysql.define(tableName, {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(512),
        allowNull: false
    },
    status: {
        type: Sequelize.STRING(64),
        allowNull: false
    }
}, {
    tableName,
    timestamps: true
});
