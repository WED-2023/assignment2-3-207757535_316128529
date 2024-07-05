var mysql = require('mysql2');
require("dotenv").config();


const config={
connectionLimit:4,
  // host: process.env.host,//"localhost"
  // user: process.env.user,//"root"
  // password: "pass_root@123",
  host: "localhost",
  user: "root",
  password: "I29B07D98",
  database: "recipes_website",
  port: 3308
};

const pool = mysql.createPool(config);

const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting MySQL connection:', err);
        reject(err);
      }
      if (connection) {
        console.log('MySQL pool connected: threadId ' + connection.threadId);
      } else {
        console.log('Connection object is undefined');
      }

      const query = (sql, binding) => {
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (err, result) => {
            if (err) {
              console.error('Error executing query:', err);
              reject(err);
              return;
            }
            resolve(result);
          });
        });
      };
      const release = () => {
        return new Promise((resolve, reject) => {
          console.log("MySQL pool released: threadId " + connection.threadId);
          resolve(connection.release());
        });
      };
      resolve({ query, release });
    });
  });
};

const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result, fields) => {
      if (err) {
        console.error('Error executing query:', err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};
module.exports = { pool, connection, query };
