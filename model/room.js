var connection = require("./db").connection;
var mqtt = require("./mqtt");
var gcm = require("./gcm");
var printError = require("./common").printError

function create(response, data)
{
	var memberListStr = JSON.stringify(data.FBIds).replace('[','(').replace(']',')')
	var createRoomSQL = "INSERT INTO room( masterUId, title, time)	\
		SELECT uid, ?, from_unixtime(?)								\
		FROM user 													\
		WHERE token = ?";
	var queryMemberSQL = "SELECT uid, gcmId, token					\
		FROM user													\
		WHERE FBID IN "+memberListStr;
	var addMemberSQL = "INSERT INTO roommember( rid, uid, status)	\
		SELECT ?, uid, 'wait_decision'								\
		FROM user													\
		WHERE FBID IN "+memberListStr+" 							\
		UNION 														\
		SELECT ?, uid, 'accept'										\
		FROM user													\
		WHERE token = ?";
	var queryRoomInfoSQL = "SELECT rid, title, UNIX_TIMESTAMP(time) as time, 	\
		masterUid, name	as masterName, photo									\
		FROM room, user 														\
		WHERE rid = ? and user.uid = masterUid";
	response.end();
	connection.query(createRoomSQL, [data.name, data.time, data.token], function(err, roomResult){
		if(err)return printError(err, data.token, "create room failed");
		console.log(roomResult);
		if(roomResult.affectedRows==0)return mqtt.action(data.token, "error", "token error");
		var addMemberData = [roomResult.insertId,roomResult.insertId, data.token];
		connection.query(addMemberSQL, addMemberData, function(err, result){
			if(err)return printError(err, data.token, "add member failed");
			connection.query(queryMemberSQL, function(err, memberInfo){
				if(err)return;
				connection.query(queryRoomInfoSQL, [roomResult.insertId], function(err, roomInfo){
					if(err)return printError(err, data.token, "get room info failed");
					mqtt.action(data.token, "createRoom", roomInfo[0]);
					for(var i in memberInfo)
					{
						var gcmMsg = roomInfo[0].masterName + " Invite you to join "+ roomInfo[0].title;
						mqtt.action(memberInfo[i].token, "newInvited", roomInfo[0]);
						gcm.send(memberInfo[i].gcmId, gcmMsg);
					}
				})
			})
		})
	})
}

function list(response, data)
{
	var sql = "SELECT r. * 						\
		FROM roommember	NATURAL JOIN user, (	\
			SELECT rid, title, masterUid, name AS masterName, photo AS masterPhoto, UNIX_TIMESTAMP(TIME) as time\
			FROM room INNER JOIN user 			\
			ON room.masterUid = user.uid 		\
			) AS r 								\
		WHERE user.token = ?					\
		AND roommember.rid = r.rid				\
		AND status = 'accept'";
	response.end();
	connection.query(sql, [data.token], function(err,result){
		if(err)return printError(err, data.token, "list invitation failed");
		mqtt.action(data.token, "listRooms", result);
	})
}

function members(response, data)
{
	var sql = "SELECT m.uid, m.status, user.name, user.photo 	\
		FROM roommember AS m 									\
		NATURAL JOIN user										\
		WHERE rid = ? and status = 'accept'";
	response.end();
	connection.query(sql, [data.rid], function(err, membersResult){
		if(err)return printError(err, data.token, "listRoomMembers failed");
		var result = {};
		result.rid = data.rid;
		result.members = membersResult;
		mqtt.action(data.token, "listRoomMembers", result);
	})
}

function quit(response, data)
{
	var updateStatus = "quit";
	var errorMsg = "quit room failed";
	var actionName = "quitRoom";
	response.end();
	checkRoomMemberStatus(data.rid, data.token, 'accept', function(err){
		if(err)return printError(err, data.token, "not in room");
		updateMemberStatus(data, updateStatus, errorMsg, actionName, true);
	});
}

function updateMemberStatus(data, updateStatus, errorMsg, actionName, mqttSelf)
{
	var sql = "UPDATE roommember as m, user		\
		SET status = '"+updateStatus+"'			\
		WHERE rid = ? AND token = ?				\
		AND user.uid = m.uid";
	var memberSQL = "SELECT uid, status, token	\
		FROM roommember AS m 					\
		NATURAL JOIN user						\
		WHERE rid = ? and status = 'accept'";
	var meSQL = "SELECT uid, name, photo 		\
		FROM user WHERE token = ?";
	connection.query(memberSQL, [data.rid], function(err, memberResult){
		if(err)return printError(err, data.token, errorMsg);
		connection.query(meSQL, [data.token], function(err, result){
			if(err || result.length==0)
				return printError(err, data.token, errorMsg);
			var boardcastData = result[0];
			boardcastData.rid = data.rid;
			connection.query(sql, [data.rid, data.token], function(err, result){
				if(err)return printError(err, data.token, errorMsg);
				if(mqttSelf)
					mqtt.action(data.token, actionName, boardcastData);
				for(var i in memberResult)
				{
					mqtt.action(memberResult[i].token, actionName, boardcastData);
				}
			})
		})
	});
}

function notifyRoomMember(rid, actionName, data, errCallback)
{
	var memberSQL = "SELECT uid, token			\
		FROM roommember AS m 					\
		NATURAL JOIN user						\
		WHERE rid = ? and status = 'accept'";
	connection.query(memberSQL, [rid], function(err, result){
		if(err)return errCallback(err);
		for(var i in result)
		{
			mqtt.action(result[i].token, actionName, data);
		}
	});
}

function checkRoomMemberStatus(rid, token, status, callback)
{
	var memberSQL = "SELECT status				\
		FROM roommember AS m 					\
		NATURAL JOIN user						\
		WHERE rid = ? and token = ?";
	connection.query(memberSQL, [rid, token], function(err, result){
		if(err)return callback(err);
		if(result.length==0)return callback("member check failed");
		if(result[0].status!==status)
		{
			err = "status not match, expect:"+status+" actual:"+result[0].status;
		}
		callback(err);
	});
}

exports.create = create;
exports.list = list;
exports.members = members;
exports.quit = quit;

exports.updateMemberStatus = updateMemberStatus;
exports.notifyRoomMember = notifyRoomMember;
exports.checkRoomMemberStatus = checkRoomMemberStatus;