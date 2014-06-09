var connection = require("./db").connection;
var mqtt = require("./mqtt");
var gcm = require("./gcm");
var printError = require("./common").printError;
var notifyRoomMember = require("./room").notifyRoomMember;
var checkRoomMemberStatus = require("./room").checkRoomMemberStatus;

function list(response, data)
{
	var sql = "SELECT * FROM roomadvice WHERE rid = ?";
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
	var sql = "insert into roomadvice(rid,uid,??) select ?,uid,? from user where token = ?";
	var querySQL = "SELECT r.* FROM roomadvice AS r \
		INNER JOIN user ON r.uid = user.uid			\
		WHERE rid = ? and token = ?";
	var errorMsg = "addAdvice failed";
	response.end();

	if(data.sid)sqlData = ["sid", data.rid, data.sid, data.token]
	else if(data.name)sqlData = ["name", data.rid, data.name, data.token]
	checkRoomMemberStatus(data.rid, data.token, 'accept', function(err){
		if(err)return printError(err, data.token, "not in room");
		connection.query(sql, sqlData, function(err, result){
			if(err)
			{
				if(err.code == "ER_DUP_ENTRY")errorMsg = "already has advice";
				return printError(err, data.token, errorMsg);
			}
			connection.query(querySQL, [data.rid, data.token], function(err, result){
				var actionName = "sendAdvice";
				notifyRoomMember(data.rid, actionName, result, function(err){
					if(err)printError(err, data.token, "unable to mqtt other member to send advice");
				})
			})
		})
	});
}

function go(response, data)
{
	var tag = data.tag;
	var actionName = "go";
	var infoSQL = "SELECT * 										\
		FROM ( SELECT uid FROM user WHERE token = ?) AS u,  		\
		( SELECT masterUid, goalUid FROM room WHERE rid = ?) AS r,	\
		( SELECT COUNT(*) AS count FROM roommember WHERE rid = ?) AS m";
	response.end();
	connection.query(infoSQL, [data.token, data.rid, data.rid], function(err, info){
		if(err)return printError(err, data.token, "go failed");
		console.log(info[0]);
		if(info[0].goalUid!=null)
		{
			return printError(err, data.token, "already have goal");
		}
		if(info[0].uid !== info[0].masterUid)
		{
			return printError(err, data.token, "not master");
		}
		connection.query("SELECT * FROM roomadvice WHERE rid = ?", [data.rid], function(err, result){
			if(err)return printError(err, data.token, "go failed");
			if(result.length*2 < info[0].count)
			{
				return printError(err, data.token, "plz wait 1/2 member give advices");
			}
			var i = Math.round(Math.random(new Date) * (result.length - 1));
			var boardcastData = {};
			boardcastData.goal = result[i].uid;
			var updateData = [boardcastData.goal, data.rid];
			connection.query("UPDATE room SET goalUid = ? WHERE rid = ?", updateData, function(err, result){
				if(err)return printError(err, data.token, "update goalUid failed");
				if(result.affectedRows.length==0)
					return printError(err, data.token, "update goalUid failed");
				notifyRoomMember(data.rid, actionName, boardcastData, function(err){
					if(err)printError(err, data.token, "unable to mqtt other member to send advice");
				})
			})
		})
	})
}

exports.list = list;
exports.send = send;
exports.go = go;