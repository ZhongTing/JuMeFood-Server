var connection = require("./db").connection;
var mqtt = require("./mqtt");
var gcm = require("./gcm");
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
}

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
	var addMemberSQL = "INSERT INTO roommember( rid, uid ) 			\
		SELECT ?, uid												\
		FROM user													\
		WHERE FBID IN "+memberListStr+" 							\
		OR token = ?";
	var queryRoomInfoSQL = "SELECT rid, title, UNIX_TIMESTAMP(time) as time, 	\
		masterUid, name	as masterName, photo									\
		FROM room, user 														\
		WHERE rid = ? and user.uid = masterUid";
	response.end();
	connection.query(createRoomSQL, [data.name, data.time, data.token], function(err, roomResult){
		if(err)return printError(err, data.token, "create room failed");
		console.log(roomResult);
		if(roomResult.affectedRows==0)return mqtt.action(data.token, "error", "token error");
		var addMemberData = [roomResult.insertId, data.token];
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

exports.create = create;
