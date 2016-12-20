require('./config/config.js');

const _=require('lodash');

//root of the application
const express    = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


//get mongoose
var {mongoose}     = require('./db/mongoose.js');
var {Todo}         = require('./models/todo');
var {User}         = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

//this allows heroku to use port, if not use 3000 loocally.  Then in app.listen below, you need to switch out the port number with "port"
const port = process.env.PORT;

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



app.delete('/todos/:id',  (req, res) => {
	//get the id
	var id = req.params.id;
	console.log(id);

	//validate the id->not valid?  return 404
	if( !ObjectID.isValid(id)  ) {

		return res.status(404).send();
	}

	//remove todo by id
	Todo.findByIdAndRemove(id).then( (todo) => {

		if( !todo ) {

			return res.status(404).send();
		}
		
		return res.send({todo});

	}).catch( (e) => {
		
		res.status(400).send();
	});

});


app.patch('/todos/:id',  (req, res) => {

	var id = req.params.id;

	//this only allows "text" and "completed" to be updatd
	var body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectID.isValid(id)) {
		console.log("not valid");
		return res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed) {
		//returns javascript timestamp
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}


	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( (todo) => {
		if(!todo) {
			console.log("not finding by id");
			return res.status(404).send();
		}
		res.send({todo});
	}).catch( (e) => {
		res.status(400).send();
	});

});




//passing the third argument lets this use the authenticate middleware 
app.get('/users/me', authenticate, (req, res)=> {
	res.send(req.user);
});

/******************************************************************************

	Users requests

******************************************************************************/

//POST /users
app.post('/users',  (req, res) => {

	var body = _.pick(req.body, ['email', 'password']);

	var user = new User({
		email: body.email,
		password: body.password
	});

	user.save().then(() => {
		return user.generateAuthToken();
	}).then( (token) => {
		res.header('x-auth', token).send(user);
	}).catch( (e) => {
		res.status(400).send(e);
	});

});








app.listen(port,  () => {
	console.log(`Started up at port ${port}`);
});

module.exports = {app};



