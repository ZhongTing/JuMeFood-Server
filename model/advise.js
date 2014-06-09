var connection = require("./db").connection;
var mqtt = require("./mqtt");
var gcm = require("./gcm");
var printError = require("./common").printError;
var notifyRoomMember = require("./room").notifyRoomMember;
var checkRoomMemberStatus = require("./room").checkRoomMemberStatus;

function list(response, data)
{
	var sql = "SELECT * FROM roomadvise WHERE rid = ?";
	var roomSQL = "SELECT rid, goalUid FROM room WHERE rid = ?";
	response.end();
	connection.query(sql, [data.rid], function(err, advices){
		if(err)return printError(err, data.token, "listRoomAdvices failed");
		connection.query(roomSQL, [data.rid], function(err, room){
			if(err)return printError(err, data.token, "listRoomAdvices failed");
			var result = room[0];
			result.advices = advices;
			mqtt.action(data.token, "listRoomAdvices", result);
		})
	})
}

function send(response, data)
{
	var sqlData;
	var sql = "insert into roomadvise(rid,uid,??) select ?,uid,? from user where token = ?";
	var querySQL = "SELECT r.* FROM roomadvise AS r \
		INNER JOIN user ON r.uid = user.uid			\
		WHERE rid = ? and token = ?";
	var errorMsg = "addAdvise failed";
	response.end();

	if(data.sid)sqlData = ["sid", data.rid, data.sid, data.token]
	else if(data.name)sqlData = ["name", data.rid, data.name, data.token]
	checkRoomMemberStatus(data.rid, data.token, 'accept', function(err){
		if(err)return printError(err, data.token, "not in room");
		connection.query(sql, sqlData, function(err, result){
			if(err)
			{
				if(err.code == "ER_DUP_ENTRY")errorMsg = "already has advise";
				return printError(err, data.token, errorMsg);
			}
			connection.query(querySQL, [data.rid, data.token], function(err, result){
				var actionName = "sendAdvise";
				notifyRoomMember(data.rid, actionName, result, function(err){
					if(err)printError(err, data.token, "unable to mqtt other member to send advise");
				})
			})
		})
	});
}
exports.list = list;
exports.send = send;
