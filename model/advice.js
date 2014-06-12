var connection = require("./db").connection;
var mqtt = require("./mqtt");
var gcm = require("./gcm");
var printError = require("./common").printError;
var notifyRoomMember = require("./room").notifyRoomMember;
var checkRoomMemberStatus = require("./room").checkRoomMemberStatus;
var message = require("./message");

function list(response, data)
{
	var sql = "SELECT * FROM  `roomadvice` NATURAL JOIN store WHERE rid = ?";
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
	var sqlData,updateData;
	var sql = "insert into roomadvice(uid,??,rid) select uid,?,? from user where token = ?";
	var updateSQL = "UPDATE roomadvice as a, user SET ?? = NULL , ?? = ?	\
		WHERE  rid = ? AND  a.uid = user.uid and user.token = ?;"
	var querySQL = "SELECT r.*, s.name, s.price, user.name as userName FROM roomadvice AS r \
		LEFT JOIN store as s ON r.sid = s.sid	\
		INNER JOIN user ON r.uid = user.uid			\
		WHERE rid = ? and token = ?";
	var errorMsg = "addAdvice failed";
	response.end();

	if(data.sid)
	{
		sqlData = ["sid", data.sid, data.rid, data.token];
		updateData = ["customName"].concat(sqlData);
	}
	else if(data.name)
	{
		sqlData = ["customName", data.name, data.rid, data.token];
		updateData = ["sid"].concat(sqlData);
	}
	checkRoomMemberStatus(data.rid, data.token, 'accept', function(err){
		if(err)return printError(err, data.token, "not in room");
		connection.query(sql, sqlData, function(err, result){
			if(err)
			{
				if(err.code == "ER_DUP_ENTRY")
				{
					// errorMsg = "already has advice";
					return connection.query(updateSQL, updateData, function(err, result){
						console.log(result);
						next();
					})
				}
				else return printError(err, data.token, errorMsg);
			}
			next();
			function next(){
				connection.query(querySQL, [data.rid, data.token], function(err, result){
					if(err||result.length==0)return printError(err, data.token, errorMsg);
					var actionName = "sendAdvice";
					var itemName = result[0].name;
					if(!itemName)itemName = result[0].customName;
					var msg = result[0].userName + "推薦了" + itemName;
					message.send(response, {"rid":data.rid,"token":data.token,"message":msg});
					notifyRoomMember(data.rid, actionName, result[0], function(err){
						if(err)printError(err, data.token, "unable to mqtt other member to send advice");
					})
				})
			}
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
	var queryAdviceSQL = "SELECT r.*, s.name 	\
		FROM roomadvice as r 					\
		natural join store as s 				\
		WHERE rid = ?"
	response.end();
	connection.query(infoSQL, [data.token, data.rid, data.rid], function(err, info){
		if(err)return printError(err, data.token, "go failed");
		console.log(info[0]);
		if(info[0].goalUid!=null)
		{
			// return printError(err, data.token, "already have goal");
		}
		if(info[0].uid !== info[0].masterUid)
		{
			return printError(err, data.token, "not master");
		}
		connection.query(queryAdviceSQL, [data.rid], function(err, result){
			if(err)return printError(err, data.token, "go failed");
			if(result.length*2 < info[0].count)
			{
				return printError(err, data.token, "plz wait 1/2 member give advices");
			}
			var i = Math.round(Math.random(new Date) * (result.length - 1));
			var boardcastData = {};
			boardcastData.rid = data.rid;
			boardcastData.goal = result[i].uid;
			var itemName = result[i].name;
			if(!itemName)itemName = result[i].customName;
			var updateData = [boardcastData.goal, data.rid];
			connection.query("UPDATE room SET goalUid = ? WHERE rid = ?", updateData, function(err, result){
				if(err)return printError(err, data.token, "update goalUid failed");
				if(result.affectedRows.length==0)
					return printError(err, data.token, "update goalUid failed");
				var msg = "室長轉出了---"+itemName;
				message.send(response, {"rid":data.rid,"token":data.token,"message":msg});
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