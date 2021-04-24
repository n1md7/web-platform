import {INTEGER, STRING, BIGINT} from "sequelize";
import mysql from "../Sequelize";

export const tableName = "users";
export default mysql.define(tableName, {
    id: {
        type: BIGINT({decimals: 11}),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: STRING(32),
        allowNull: false,
        unique: true
    },
    email: {
        type: STRING(128),
        allowNull: false,
        unique: true
    },
    password: {
        type: STRING(512),
        allowNull: false
    },
    role: INTEGER({decimals: 2}),
    active: INTEGER({decimals: 1}),
}, {
    tableName,
    timestamps: true
});
