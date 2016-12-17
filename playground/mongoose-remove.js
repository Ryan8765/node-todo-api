const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');

const {User} = require('./../server/models/user.js');

//three methods for deleting records

//Todo.remove({pass arguments})

//if you want to remove all documents Todo.remove({}) - must pass an object. 


//removes all documents. 
// Todo.remove({}).then( (result) => {
// 	console.log(result);
// });

//Todo.findOneAndRemove({_id: '23423423423423'}).then( (todo) => {});
//Todo.findByIdAndRemove() 


Todo.findByIdAndRemove('585556b431a7942438a0f15c').then( (todo) => {
	console.log( "Deleted document ", todo );
});



