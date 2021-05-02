import Sequelize from "sequelize";
import mysql from "../Sequelize";

export const tableName = "assessments";
export default mysql.define(tableName, {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    templateId: {
        type: Sequelize.INTEGER({decimals: 11}),
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER({decimals: 11}),
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
