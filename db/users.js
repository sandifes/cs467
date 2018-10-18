var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  port     : process.env.DB_PORT,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME,
});
        
exports.findById = function(id, cb) {
  connection.query(
    "SELECT * FROM users WHERE id = ?;",
    [id],
    function (error, results, fields) {
      if (results.length > 0) {
        return cb(null, results[0]);
      } else {
        return cb(null, null);
      }
    });
}

exports.findByUsername = function(username, cb) {
  connection.query(
    "SELECT * FROM users WHERE username = ?;",
    [username],
    function (error, results, fields) {
      if (results.length > 0) {
        return cb(null, results[0]);
      } else {
        return cb(null, null);
      }
    });
}

exports.registerNewUser = function(user, cb) {
  connection.query(
    "INSERT INTO users (email, username, firstname, lastname, password, account_type, dept_id) values (?, ?, ?, ?, ?, ?, ?);",
    [user.email, user.username, user.firstName, user.lastName, user.password, user.accountType, user.department],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        cb(error, null);
      }
      else {
        cb(null, results.insertId);
      }
    });
}