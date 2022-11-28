const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db");

// db.run("DROP TABLE UserInfo");
db.run(
  `CREATE TABLE IF NOT EXISTS UserInfo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName varchar(25),
    Email varchar(25),
    Password varchar(10)
  )`
);

module.exports = db;
