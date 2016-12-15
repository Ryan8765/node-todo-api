//root of the application
var express    = require('express');
var bodyParser = require('body-parser');


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



app.listen(3000,  () => {
	console.log('Started on port 3000');
});



