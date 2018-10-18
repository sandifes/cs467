var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  port     : process.env.DB_PORT,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME,
});

exports.findAllAwards = function(cb) {
    connection.query(
      "SELECT * FROM award;",
      function (error, results, fields) {
        if (error) {
          console.log(error);
          cb(error, null);
        }
        else {
          cb(null, results);
        }
      });
  }