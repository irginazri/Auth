import { Sequelize } from "sequelize";
import { config } from "dotenv";

config()
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_USE} = process.env

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD,{
    host : DB_HOST,
    dialect: DB_USE
});

export default db;