//how to load and connect to the database
//first install mongo db - npm install mongodb@2.2.5 --save

//documentation - mongodb.github.io/node-mongodb-native/2.2/api/Cursor.html

//const MongoClient = require('mongodb').MongoClient;
//you can desctructure with es6 on options - 
const {MongoClient, ObjectID} = require('mongodb');

//make a new object id.  This is used to make the _id in the mongo db. 
//var obj = new ObjectID();
//console.log(obj);



//testTodoApp is the database.  If it doesn't exist - it will create it. 
MongoClient.connect('mongodb://localhost:27017/testTodoApp', (err, db)=> {

	if( err ) {
		//return just stops anything else from running - we will never see 
		return console.log('Unable to connect to MongoDB server');
	}

	console.log('Connected to MongoDB server');


	//findOneAndUpdate()

	db.collection('Todos').findOneAndUpdate({
		_id: new ObjectID('584f4b3af7c8ab05bc9d07f3') 
	}, {
		//google mondodb update operators.  $set is an update operator
		$set: {
			completed: true
		},
		//increment the age by 1
		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then( ( result )=>{
		console.log( result );
	});
	

	//db.close();

});
