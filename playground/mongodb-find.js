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

	//This will fetch all documents from the table.  toArray turns the pointer into a javascript array.
	db.collection('Todos').find().toArray().then((docs)=>{
			console.log('Todos');
			console.log(JSON.stringify(docs, undefined, 2));
	}, (err)=>{
		console.log('Unalbe to fetch todos', err)
	});


	//This gets all todos where completed - false
	db.collection('Todos').find({completed:false}).toArray().then((docs)=>{
			console.log('Todos');
			console.log(JSON.stringify(docs, undefined, 2));
	}, (err)=>{
		console.log('Unalbe to fetch todos', err)
	});


	//get item with an id. first you have to convert the id to an object id
	db.collection('Todos').find({

		_id: new ObjectID('584f4b541f9e9f0e44cfeb4b')

	}).toArray().then((docs)=>{
			console.log('Todos');
			console.log(JSON.stringify(docs, undefined, 2));
	}, (err)=>{
		console.log('Unalbe to fetch todos', err)
	});

	//we are going to count all todos in the collection
	db.collection('Todos').find().count().then((count)=>{
			console.log('Todos count: ' + count);
	}, (err)=>{
		console.log('Unalbe to fetch todos', err);
	});

	//query for documents where name: jones and print to console
	db.collection('Users').find({name: "Jones"}).toArray().then((docs)=>{
		console.log( "Documents ", JSON.stringify(docs, undefined, 2) );
	}, (err)=>{
		console.log("there was an error ", err);
	});

	//db.close();

});
