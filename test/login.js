var test = require("./test").test

var data = JSON.stringify({
    FBToken : 'CAAEZCUgPhszQBACNZAUi1ISUuEAaZBbsT3eVkZC7W1TuiZA6FaAGXBoA1HVDtYpwH94tCTfpoeOjfcfv2KsdjMrhXC5yjQ7YLW2Q8CWRgsLLVOKUauGlSUVZByrEIG2tBRzooRBfFBfZBgBY5lhSWk45SlbdL7v5LLZBGKxasDZC90UTtJCFXhCZCLZBv4INloaTvEZD',
    GCMId : 'APA91bFaORY1G7FCx6sO-n92t8172KXaKo3Ul8DH9LgwdScZRDvRMQDkC5GS_78MznYPk1nOS5LOfbgwWRDV4CrgRwWMYB56OtVn1P5PE9GAli37953YMOmVm4nP7vWTy3XfqG-BVDZ80PRT7Ur8wXRIonpve0yH3A'
});

test("/login",data,function(data){
	console.log(data);
});