var gcm = require('node-gcm');
var sender = new gcm.Sender('AIzaSyBsf4l9d4mpSaT2QH9ybpRd6GccU-367RU');

function send(regId, message, callback)
{
	var registrationIds = [];
	var msgObject = getMessage(message);
	registrationIds.push(regId);

	sender.send(msgObject, registrationIds, 4, function (err, result) {
    	console.log(msgObject);
    	console.log(result);
	});
}
function getMessage(message)
{
	var m = new gcm.Message();
	m.delayWhileIdle = true;
	m.addData("message",message);
	return m;
}
exports.send = send;