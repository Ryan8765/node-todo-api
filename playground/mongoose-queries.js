const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');

const {User} = require('./../server/models/user.js');

//all of this can be found in the documentation at mongoosejs.com/docs/guide.html

//grab an existing ID. 
var id = '58532aa0965bf9f425c14d6c';


Todo.find({
	//mongoose will automatically convert to object id and run the query - you don't have to manually convert string to an object id with mongoose.
	_id: id
}).then( (todos) => {
	console.log( 'Todos ', todos );
});

//this finds just one doc - even if there are more than one.
Todo.findOne({
	_id: id
}).then( (todo) => {
	console.log( 'Todo ', todo );
});

//this one lets you find a todo by an ID

Todo.findById(id).then( (todo) => {
	//what happens if you search for an id that isn't in the database
	//if your id doesn't get anything, it will just return null.  You can handle this by console.loging "Id not found".
	if(!todo) {
		return console.log('Id not found');
	}
	console.log( 'Todo by id ', todo );
//if there is an invalid ID passed to the database (an invalid ID is one that doesn't have the correct amount of characters, or isn't formatted correctly) use a catch clause. 
}).catch( (e) => {
	console.log(e);
});

//you can also check to see if the id is valid and not use the catch clause.  YOu would use the following syntax:
/*

		if(!ObjectID.isValid(id)){
			console.log('ID not valid');
		}

*/


console.log( "_____________________________________" );
//test it out on the user model as well

var userID = '585332529038ee8e9aee86f4';

//test if we were given a valid ID
if(!ObjectID.isValid(userID)){
	console.log('User ID not valid');
}


User.find({
	_id: userID
}).then( (users) => {
	console.log( users );
});


User.findOne({
	_id: userID
}).then( (user) => {
	console.log( user );
});

User.findById(userID).then( (user) => {
	if(!user) {
		return console.log('Id not found');
	}
	console.log( 'User by id ', user );
}).catch( (e) => {
	console.log(e);
});





