var test = require("./test").test

var data = JSON.stringify({
    FBToken : 'CAAVcE9atRkABAIYAIExyTBkfCKeZCgerexzzuhbEH4C5bkkCAJRTzYYS97kuKGZAdTGrISW1mXWfa643mWhnJDegopkwLNkC7DHKuzJgIBqfbClGBP5cypXPPL8j3A4DRQ30Rx3ojAWJRlkzwWwzAcvv94tBeG200JWv3Hlj7WsUL80FzOr0e0NbxVrKdf5QYTL8g8GwZDZD',
    GCMID : 'APA91bFaORY1G7FCx6sO-n92t8172KXaKo3Ul8DH9LgwdScZRDvRMQDkC5GS_78MznYPk1nOS5LOfbgwWRDV4CrgRwWMYB56OtVn1P5PE9GAli37953YMOmVm4nP7vWTy3XfqG-BVDZ80PRT7Ur8wXRIonpve0yH3A'
});

test("/login",data,function(data){
	console.log(data);
});