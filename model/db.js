var mysql = require('mysql');
var connection = mysql.createConnection({
	host: '140.124.181.190',
	port: '3306',
	user: 'keming',
	password: '1421root',
	database: 'jumefood'
});
connection.connect();

exports.connection = connection;
