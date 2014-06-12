var test = require("./test").test

var data = JSON.stringify({
    FBToken : 'CAAVcE9atRkABAPaiRse0B7kTzkBu3pXSOqs61f5CmL7TprDSDBBfd4Umzs6cpN0tJxMvWOKSFLKh1PjCuMOkcQgTvjFfTXbUYSUZBSOAKkR5GDZBCeDydndOddoBXxXHieTihGFTRZA2ILszZCjqSkReifW1y6RXwhZB44vq5IKVuutOK6D5j9wAHQgAKsYznDoSYfjUJmgZDZD',
    GCMId : 'APA91bFaORY1G7FCx6sO-n92t8172KXaKo3Ul8DH9LgwdScZRDvRMQDkC5GS_78MznYPk1nOS5LOfbgwWRDV4CrgRwWMYB56OtVn1P5PE9GAli37953YMOmVm4nP7vWTy3XfqG-BVDZ80PRT7Ur8wXRIonpve0yH3A'
});

test("/login",data,function(data){
	console.log(data);
});