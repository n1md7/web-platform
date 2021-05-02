import Sequelize from "sequelize";
import mysql from "../Sequelize";

export const tableName = "templateQuestions";
export default mysql.define(tableName, {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
}, {
    tableName,
    timestamps: true
});
