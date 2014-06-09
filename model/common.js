var mqtt = require("./mqtt");
var debug = true;

function printError(err, token, errMsg)
{
	if(err)
	{
		if(!debug)return mqtt.action(token, "error", errMsg);
		console.log(errMsg);
		console.log(err);
		return mqtt.action(token, "error", err);
	}
	return mqtt.action(token, "error", errMsg);
}

exports.printError = printError;