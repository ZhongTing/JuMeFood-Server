var mysql = require('mysql');
var connection = mysql.createConnection({
	host: '140.124.181.190',
	port: '3306',
	user: 'keming',
	password: 'root1421',
	database: 'jumefood'
});
// var connection = mysql.createConnection({
// 	host: '140.124.181.7',
// 	port: '2819',
// 	user: 'ISLab1221',
// 	password: '1221',
// 	database: 'jumefood'
// });

connection.connect();

exports.connection = connection;
