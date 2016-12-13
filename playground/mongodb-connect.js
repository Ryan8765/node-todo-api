//how to load and connect to the database
//first install mongo db - npm install mongodb@2.2.5 --save

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

	//insert a new record into the collection (table).  insert has two arguments, the first one is the document to enter into the database, the second is error and result handling.
	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, res)=> {

	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}

	// 	//ops attribute stores all of the docs that were inserted into the database.
	// 	console.log(JSON.stringify(res.ops, undefined, 2));

	// });



	//insert new document into the Users collection with a name and age and location string. 
	db.collection('Users').insertOne({
		name: "Ryan Haas",
		age: "32",
		location: "215 W Stedhill Loop Spring Texas"
	}, (err, res)=>{
		if(err) {
			return console.log('Unable to insert todo', err);
		}
		//ops attribute stores all of the docs that were inserted into the database.
		console.log(JSON.stringify(res.ops, undefined, 2));
		//mongo db adds an identifier _id to all docs that are created.  This id contains the date created value within it.  You can access it like below:
		console.log(res.ops[0]._id.getTimestamp());

	});

	db.close();

});
