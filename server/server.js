//root of the application
var express    = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');


//get mongoose
var {mongoose} = require('./db/mongoose.js');
var {Todo}     = require('./models/todo');
var {User}     = require('./models/user');

var app = express();

//this is middleware
app.use(bodyParser.json());

//this is for resource creation - this is for creating a new todo
app.post('/todos',  (req, res) => {
	console.log( req.body );
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then( (doc) => {
		//send the newly created document back to the user in the body of the request
		res.send(doc);
	},  (error) => {
		//send a 400 error with the error
		res.status(400).send(error);
		console.log( "There was an error ", error );
	});
});


//get all todos
app.get('/todos',  (req, res) => {

	Todo.find().then( (todos ) => {
		//sending 
		res.send({
			//send the todos back to the requesting resource.
			todos,
		});
	},  (e) => {
		res.status(400).send(e);
	});

});


//get a single todo by ID.  To use a param - just use req.params.id to get the id from the params object.
// GET /todos/12132323
app.get('/todos/:id',  (req, res) => {
	var id = req.params.id;
		
	//validate id using isval to make sure we are given a good id
	if( !ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	//query database findById
	Todo.findById( id )
		.then( (todo) => {
			//success
				if( todo ) {
					res.send({todo});
				} else {
					res.status(404).send();
				}

		},  (e) => {
			//error
				//400 - don't send back the error argument. 
			res.status(400).send();
		});

});






app.listen(3000,  () => {
	console.log('Started on port 3000');
});

module.exports = {app};



