var connection = require("./db").connection;
var uuid = require('node-uuid');
var graph = require('fbgraph');

var debug = true;
function login(response,data)
{
    var responseData = {};
    graph.setAccessToken(data.FBToken);
    graph.get("me?fields=id,name", function(err, res) {
        if(err)return printError(err, response, "fb auth failed");
        graph.get("me/picture?width=100&height=100&redirect=false", function(err, photoRes){
            if(err)return printError(err, response, "fb auth failed");
            doLoginOrSignUp(res.id, res.name, data.GCMId, photoRes.data.url);
        })
        
    });
    function doLoginOrSignUp(fbid, name, gcmId, url)
    {
        connection.query("select uid, token, name, FBID as FBId, photo from user where FBID = ?", [fbid], function(err, userInfo){
            if(err)return printError(err, response, "login failed")
            if(userInfo.length==0)
            {
                var token = uuid.v1();
                var insertData = {"FBID":fbid, "name":name, "gcmId":gcmId, "token":token, "photo":url};
                connection.query("insert into user set ?", insertData, function(err, insertResult){
                    if(err)return printError(err, response,  "login failed");
                    var userInfo = {"FBId":fbid, "name":name, "uId":insertResult.insertId, "token":token, "photo":url};
                    response.write(JSON.stringify(userInfo));
                    response.end();
                })
            }
            else
            {
                var updateSQL = "update user set gcmId = ? where FBID = ?";
                connection.query(updateSQL, [gcmId, fbid], function(err, updateResult){
                    response.write(JSON.stringify(userInfo[0]));
                    response.end();
                });
            }
        })
    }
}

function printError(err, response, errMsg)
{
    if(err)
    {
        if(!debug) return errorResponse(response, errMsg);
        console.log(err);
        return errorResponse(response, err);
    }
}
function errorResponse(response, errorMsg)
{
    var responseData = {};
    responseData.errors = errorMsg;
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(JSON.stringify(responseData));
    response.end();
}
exports.login = login;