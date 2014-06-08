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
		AND isAccept =0";
	response.end();
	connection.query(sql, [data.token], function(err,result){
		if(err)return printError(err, data.token, "list invitation failed");
		mqtt.action(data.token, "listInvited", result);
	})
}

function accept(response, data)
{
	var sql = "UPDATE roommember as m, user	\
		SET isAccept = 1					\
		WHERE rid = ? AND token = ?			\
		AND user.uid = m.uid";
	response.end();
	connection.query(sql, [data.rid, data.token], function(err, result){
		if(err)return printError(err, data.token, "accept invitation failed");
		mqtt.action(data.token, "accept invitation", {rid:data.rid});
	})
}

exports.list = list;
exports.accept = accept;