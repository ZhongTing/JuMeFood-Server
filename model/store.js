var connection = require("./db").connection;
var mqtt = require("./mqtt");
var printError = require("./common").printError;

function list(response, data)
{
	var tag = data.tag;
	response.end();
	connection.query("select sid, name, price, latitude, longitude from store", function(err, result){
		if(err)return printError(err, data.token, "list store failed");
		mqtt.action(data.token, "listStore", result);
	})
}

exports.list = list;