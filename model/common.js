var mqtt = require("./mqtt");
var debug = true;

function printError(err, token, errMsg)
{
	if(err)
	{
		if(!debug)
		{
			var errObj = {};
			errObj.errors = errMsg;
			return mqtt.action(token, "error", errObj);
		}
		console.log(errMsg);
		console.log(err);
		return mqtt.action(token, "error", err);
	}
	return mqtt.action(token, "error", errMsg);
}

exports.printError = printError;