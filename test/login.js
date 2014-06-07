var http = require("http");

var data = JSON.stringify({
    FBToken : 'CAAVcE9atRkABAE90TFZAkm40lA3XFZAsZCtEIFc2uA1HcsTdc1OaHA3CNZA0tezOcpNuDHNsvXE9pv8J8aoj41EqVIeNvssg4X2cm2lfPOMYZA0yEi22JYiU5toluyj176cvt4mYh4nGEhecxHvVZBNpCE8ZC3ZA7KeZCVmF1aJC90HeZAWQV5sthX3sYLlGGCbC9gwnieZBLcfKQZDZD',
    GCMID : 'APA91bFaORY1G7FCx6sO-n92t8172KXaKo3Ul8DH9LgwdScZRDvRMQDkC5GS_78MznYPk1nOS5LOfbgwWRDV4CrgRwWMYB56OtVn1P5PE9GAli37953YMOmVm4nP7vWTy3XfqG-BVDZ80PRT7Ur8wXRIonpve0yH3A'
});

var options = {
    host: 'localhost',
    port: 8888,
    path: '/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
    }
};

var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log(chunk);
    });
});

req.write(data);
req.end();

