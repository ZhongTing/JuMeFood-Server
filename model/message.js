var connection = require("./db").connection;
var mqtt = require("./mqtt");
var gcm = require("./gcm");
var printError = require("./common").printError;
var notifyRoomMember = require("./room").notifyRoomMember;
var checkRoomMemberStatus = require("./room").checkRoomMemberStatus;

function list(response, data)
{
	var actionName = "roomMsgs";
	var sql = "SELECT m.mid, m.uid, user.name, message, UNIX_TIMESTAMP(timestamp) as timestamp 	\
		FROM roommsg as m, user 															\
		WHERE m.rid = ? and user.uid = m.uid";
	
	response.end();
	connection.query(sql, [data.rid], function(err, msgs){
		if(err)return printError(err, data.token, "listRoomMsgs failed");
		var result = {"rid":data.rid};
		result.Msgs = msgs;
		mqtt.action(data.token, actionName, result);
	})
}

function send(response, data)
{
	var errorMsg = "sendMsg failed";
	var actionName = "sendMsg";
	var sql = "insert into roommsg(rid,uid,message) select ?, uid,? from user where token = ?";
	var querySQL = "SELECT m.uid, user.name, message, UNIX_TIMESTAMP(timestamp) as timestamp 	\
		FROM roommsg as m, user 																\
		WHERE m.rid = ? and user.uid = m.uid and user.token = ?";
	var sqlData = [data.rid, data.message, data.token];
	var queryData = [data.rid, data.token];
	response.end();
	checkRoomMemberStatus(data.rid, data.token, 'accept', function(err){
		if(err)return printError(err, data.token, "not in room");
		connection.query(sql, sqlData, function(err, result){
			if(err)return printError(err, data.token, errorMsg);
			connection.query(querySQL, queryData, function(err, result){
				if(err||result.length==0)
					return printError(err, data.token, errorMsg);
				notifyRoomMember(data.rid, actionName, result[0], function(err){
					if(err)printError(err, data.token, "unable to mqtt other member to send advice");
				})
			})
		})
	});
}

exports.list = list;
exports.send = send;