var connection = require("./db").connection;
var uuid = require('node-uuid');
var graph = require('fbgraph');

var debug = true;
function login(response,data)
{
    var responseData = {};
    graph.setAccessToken(data.FBToken);
    graph.get("me?fields=id,name", function(err, res) {
        if(err)
        {
            if(!debug) return errorResponse(response, "fb auth failed");
            return errorResponse(response, err);
        }
        doLogin(res.id, res.name, data.GCMID);
    });
    function doLogin(fbid, name, gcmId)
    {
        connection.query("select uid, token from user where FBID = ?", [fbid], function(err, userInfo){
            if(err)
            {
                if(!debug) return errorResponse(response, "login failed");
                console.log(err);
                return errorResponse(response, err);
            }
            if(userInfo.length==0)
            {
                var token = uuid.v1();
                var insertData = {"FBID":fbid, "name":name, "gcmId":gcmId, "token":token};
                connection.query("insert into user set ?", insertData, function(err, insertResult){
                    if(err)
                    {
                        if(!debug) return errorResponse(response, "login failed");
                        console.log(err);
                        return errorResponse(response, err);
                    }
                    var userInfo = {"uid":insertResult.insertId,"token":token};
                    response.write(JSON.stringify(userInfo));
                    response.end();
                })
            }
            else
            {
                response.write(JSON.stringify(userInfo[0]));
                response.end();
            }
        })
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