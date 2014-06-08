var debug = true;
var mqtt = require("./mqtt");

function printError(err, token, errMsg)
{
	if(err)
	{
		if(!debug)return mqtt.action(token, "error", errMsg);
		console.log(errMsg);
		console.log(err);
		return mqtt.action(token, "error", err);
	}
}

exports.printError = printError;