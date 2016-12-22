const expect  = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app}   = require('./../server');
const {Todo}  = require('./../models/todo');
const {User}  = require('./../models/user');
const{todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);

//before each run, populate some todos.
beforeEach(populateTodos);


describe('POST /todos',  () => {
	it('Should create a new todo',  (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text: text})
			.expect(200)
			.expect( (res) => {
				expect(res.body.text).toBe(text);
			})
			.end( (err,res) => {
				if(err) {
					return done(err);
				}

				Todo.find({text}).then( (todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch( (e) => done());
			});
		});	

		it('Should not create todo with invalid body data',  (done) => {
			//make a request to the same url - and send send as an empty object. expect 400.  length of the todos is 0
			request(app)
				.post('/todos')
				.send({})
				.expect(400)
				.end(  (err, res) => {
					if(err) {
						return done("hello ", err);
					}
				});
//helloo
				Todo.find().then(  (todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch( (e) => {
					done("hello 2 ", e);
				});
		});

	
});


describe('GET /todos',  () => {
	it('should get all todos',  (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect( (res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});


describe('GET /todos/:id',  () => {
	it('should return todo doc',  (done) => {
		request(app)
			//toHexString converts an id to a string
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect( (res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});


	it('should return a 404 if todo not found',  (done) => {
		//create a valid ID - make sure it returns a 404 return status
		var id = new ObjectID();
		request(app)
			.get(`/todos/${id.toHexString()}`)
			.expect(404)
			.end(done);
	});


	it('should return 404 for non-object ids',  (done) => {
		var id = 23423423;
		request(app)
			.get(`/todos/${id}`)
			.expect(404)
			.end(done);
	});
});



describe('Delete /todos/:id',  () => {


	it('Should remove a todo',  (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect( (res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end( (err, res) => {
				if(err) {
					return done(err);
				}

				//query database using findById - it should fail.  toNotExist 
				Todo.findById(hexId).then( (todo) => {
					expect(todo).toNotExist();
					done();
				}).catch( (e) => {
					done(e);
				});
			});
	});


	// it('Should return 404 if todo not found',  (done) => {

	// });

	it('Should return 404 if todo not found',  (done) => {
		var hexId = new ObjectID().toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done);

	});

	// it('Should return 404 if object id is invalid',  (done) => {

	it('Should return 404 if object id is invalid',  (done) => {
		
		request(app)
			.delete(`/todos/asdwersd`)
			.expect(404)
			.end(done);
	});

});




describe('PATCH /todos/:id',  () => {


	it('should update the todo',  (done) => {
		//grab id of first item
		var id = todos[0]._id.toHexString();
		var text = 'This should be the new text';
		//update text, set completed true
		request(app)
			.patch(`/todos/${id}`)
			.send({
				completed: true,
				text
			})
			.expect(200)
			.expect( (res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);

	});


	it('should clear completedAt when todo is not completed',  (done) => {
		//grab id of first item
		var id = todos[1]._id.toHexString();
		var text = 'This should be the new text 22';
		//update text, set completed true
		request(app)
			.patch(`/todos/${id}`)
			.send({
				completed: false,
				text
			})
			.expect(200)
			.expect( (res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);
	});

});



//test route that returns newly authenticated user
describe('GET /users/me',  () => {
	it('should return user if authenticated',  (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect( (res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if not authenticated',  (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect( (res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

//for signing up users
describe('POST /users',  () => {
	it('should create a user',  (done) => {
		var email = 'example@example.com';
		var password = '123mndb';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect( (res) => {

				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toExist(email);

			})
			.end( (err) => {
			
				if(err) {
					return done(err);
				}

				User.findOne({email}).then( (user) => {
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				}).catch( (e) => done(e));
		
			});
	});

	it('should return validation errors if request invalid',  (done) => {
		request(app)
			.post('/users')
			.send({
				email:'someuser@gmail.com', 
				password: 'wwwaa'
			})
			.expect(400)
			.end(done);
	});

	it('should not create user if email in use',  (done) => {
		request(app)
			.post('/users')
			.send({
				email: users[0].email,
				password: 'Password123!'
			})
			.expect(400)
			.end(done);
	});
});



describe('POST /users/login',  () => {


	it('should login user and return auth token',  (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect( (res) => {
				expect(res.headers['x-auth']).toExist();
			})
			.end( (err, res) => {
				if(err) {
					return done(err);
				}

				User.findById(users[1]._id).then( (user) => {
					expect(user.tokens[0]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch( (e) => done(e));
			});
	}); 

	it('should reject invalid login',  (done) => {

		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: 'bspassword'
			})
			.expect(400)
			.expect( (res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end( (err, res) => {
				if(err) {
					return done(err);
				}

				User.findById(users[1]._id).then( (user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch( (e) => done(e));
			});
	});

});