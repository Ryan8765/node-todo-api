const expect  = require('expect');
const request = require('supertest');

const {app}   = require('./../server');
const {Todo}  = require('./../models/todo');

//this runs before the test case and clears all of the database.  this runs before each test below.
beforeEach( (done) => {	
	Todo.remove({}).then( () => {
		done();
	});
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

				Todo.find().then( (todos) => {
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
					expect(todos.length).toBe(0);
					done();
				}).catch( (e) => {
					done("hello 2 ", e);
				});
		});

	
});