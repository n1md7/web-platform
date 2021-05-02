import Sequelize from "sequelize";
import mysql from "../Sequelize";

export const tableName = "assessmentAnswers";
export default mysql.define(tableName, {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    assessmentId: {
        type: Sequelize.INTEGER({decimals: 11}),
        allowNull: false
    },
    questionGroupId: {
        type: Sequelize.INTEGER({decimals: 11}),
        allowNull: false
    },
    questionId: {
        type: Sequelize.INTEGER({decimals: 11}),
        allowNull: false
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
