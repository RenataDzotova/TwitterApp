const sqlite = require("better-sqlite3");
const path = require("path");
const db = new sqlite(path.resolve("../DB"), { fileMustExist: true });

initTables();

function initTables() {
  execute(
    `CREATE TABLE IF NOT EXISTS users ( 
      id INTEGER primary key autoincrement,
      name varchar(20),
      email varchar(20) UNIQUE,
      password varchar(15)
      );`,
    []
  );
  execute(
    `CREATE TABLE IF NOT EXISTS posts ( 
      id INTEGER primary key autoincrement,
      text varchar(250),
      user_name varchar(20),
      user_id INTEGER
      );`,
    []
  );
  execute(
    `CREATE TABLE IF NOT EXISTS followers ( 
      id INTEGER primary key autoincrement,
      user_id INTEGER,
      follower_id INTEGER
      );`,
    []
  );
  execute(
    `CREATE TABLE IF NOT EXISTS reports ( 
      id INTEGER primary key autoincrement,
      user_id INTEGER,
      reportingUser_id INTEGER
      );`,
    []
  );
}

function execute(sql, params) {
  return db.prepare(sql).run(...params);
}

function query(sql, params) {
  return db.prepare(sql).all(params);
}

module.exports = {
  query,
  execute,
};
