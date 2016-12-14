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

	//deleteMany documents - delete all todos that have a text property = "Eat lunch"
	// db.collection('Todos').deleteMany({
	// 	text: 'Eat Lunch'
	// }).then( ( result )=>{
	// 	console.log( result );
	// });

	//deleteOne - targets one document with the given criteria.
	// db.collection('Todos').deleteOne({
	// 	text: 'Eat Lunch'
	// }).then( ( result )=>{
	// 	console.log( result );
	// });

	//findOneAndDelete - remove one item and return the values that were deleted
	db.collection('Todos').findOneAndDelete({
		text: 'Eat Lunch2'
	}).then(  ( result )=>{
		//this returns the result that was deleted
		console.log( result );
	} );

	//db.close();

});
