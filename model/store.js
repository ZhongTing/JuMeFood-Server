var connection = require("./db").connection;
var mqtt = require("./mqtt");
var debug = true;

function list(response, data)
{
	var tag = data.tag;
	response.end();
	connection.query("select sid, name, price, latitude, longitude from store", function(err, result){
		if(err)
		{
			if(!debug)return mqtt.action(data.token, "error", err);
			console.log(err);
			mqtt.action(data.token, "error", "list store failed");
		}
		mqtt.action(data.token, "listStore", result);
	})
}

exports.list = list;