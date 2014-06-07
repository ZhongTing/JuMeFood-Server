var http = require("http");
function test(path, data, callback)
{
	var options = {
	    host: 'localhost',
	    port: 8888,
	    path: path,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/x-www-form-urlencoded',
	        'Content-Length': Buffer.byteLength(data)
	    }
	};

	var req = http.request(options, function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
	        if(callback)callback(chunk);
	        else console.log(chunk);
	    });
	});

	req.write(data);
	req.end();	
}
exports.test = test