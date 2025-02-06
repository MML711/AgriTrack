import mysql from "mysql2";

const devConfig = {
    host: "localhost",
    user: "root",
    password: "M0947937786m",
    database: "thesis",
};

export const db = mysql.createConnection(devConfig);