var connection = require("./db").connection;
var mqtt = require("./mqtt");
var gcm = require("./gcm");
var debug = true;
var printError = require("./common").printError

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
	//to do wait -> accept condiftion
	var updateStatus = "accept";
	var errorMsg = "accept invitation failed";
	var actionName = "acceptInvitation";
	response.end();
	updateMemberStatus(data, updateStatus, errorMsg, actionName);
}

function refuse(response, data)
{
	// to do wait -> refuse condition
	var updateStatus = "refuse";
	var errorMsg = "refuse invitation failed";
	var actionName = "refuseInvitation";
	response.end();
	updateMemberStatus(data, updateStatus, errorMsg, actionName);
}


function updateMemberStatus(data, updateStatus, errorMsg, actionName)
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
				mqtt.action(data.token, actionName, boardcastData);
				for(var i in memberResult)
				{
					mqtt.action(memberResult[i].token, actionName, boardcastData);
				}
			})
		})
	});
}
exports.list = list;
exports.accept = accept;
exports.refuse = refuse;