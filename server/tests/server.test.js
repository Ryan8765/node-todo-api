const expect  = require('expect');
const request = require('supertest');

const {app}   = require('./../server');
const {Todo}  = require('./../models/todo');

//thi sis used to populate the database with some todos before each run
const todos = [{
	text: "first test todo"
}, {
	text: 'Second test todo'
}];
//this runs before the test case and clears all of the database.  this runs before each test below.
beforeEach( (done) => {	
	Todo.remove({}).then( () => {
		//this lets us insert the todos above 
		return Todo.insertMany(todos);
	}).then( () => {done()});
});

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