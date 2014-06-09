var connection = require("./db").connection;
var mqtt = require("./mqtt");
var gcm = require("./gcm");
var printError = require("./common").printError;
var updateMemberStatus = require("./room").updateMemberStatus;
var checkRoomMemberStatus = require("./room").checkRoomMemberStatus;

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
		AND status = 'wait_decision'";
	response.end();
	connection.query(sql, [data.token], function(err,result){
		if(err)return printError(err, data.token, "list invitation failed");
		mqtt.action(data.token, "listInvited", result);
	})
}

function accept(response, data)
{
	var updateStatus = "accept";
	var errorMsg = "accept invitation failed";
	var actionName = "acceptInvitation";
	response.end();
	checkRoomMemberStatus(data.rid, data.token, 'wait_decision', function(err){
		if(err)return printError(err, data.token, err);
		updateMemberStatus(data, updateStatus, errorMsg, actionName, true);
	});
}

function refuse(response, data)
{
	var updateStatus = "refuse";
	var errorMsg = "refuse invitation failed";
	var actionName = "refuseInvitation";
	response.end();
	checkRoomMemberStatus(data.rid, data.token, 'wait_decision', function(err){
		if(err)return printError(err, data.token, err);
		updateMemberStatus(data, updateStatus, errorMsg, actionName);
	});
}

exports.list = list;
exports.accept = accept;
exports.refuse = refuse;