const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
	_id: userOneId,
	email: 'rmhaas22111@gmail.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id:userOneId, access:'auth'}, 'abc123').toString()
	}]
}, {
	_id: userTwoId,
	email: 'jessssss@gmail.com',
	password: 'userTwoPass'
}];

const populateUsers =  (done) => {
	//remove all records to start off
	User.remove({}). then( () => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		//promise.all takes an array of promises and yo ucan run then off of it - all promises in the array must resolve before it runs
		return Promise.all([userOne, userTwo]).then( () => {done();});
	});
};

//this file is used for seeding the database for test runs.  basically creating records in the database.

//thi sis used to populate the database with some todos before each run
const todos = [{
	_id: new ObjectID(),
	text: "first test todo"
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 333
}];
//this runs before the test case and clears all of the database.  this runs before each test below.
const populateTodos = (done) => {	
	Todo.remove({}).then( () => {
		//this lets us insert the todos above 
		return Todo.insertMany(todos);
	}).then( () => {done()});
};



module.exports = {
	todos, populateTodos, users, populateUsers
};