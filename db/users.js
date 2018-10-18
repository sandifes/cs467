var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', email: 'jack@example.com' }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', email: 'jill@example.com' }
];

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
    "INSERT INTO users (username, firstname, lastname, password) values (?, ?, ?, ?);",
    [user.email, user.firstName, user.lastName, user.password],
    function (error, results, fields) {
      if (error) { cb(error, null); }
      else { cb(null, results.insertId); }
    });
}