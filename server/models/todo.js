var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
	//these are our fields and what they should be
	text: {
		type: String,
		//you can require a field be entered. If a document is added without this, we get a validation error. 
		required: true,
		//there are also custom validators
		minlength: 1,
		//trim removes leading/trailing whitespace
		trim: true
		//for other validators see http://mongoosejs.com/docs/validation.html
	},
	completed: {
		type: Boolean,
		default: false
	}, 
	completedAt: {
		type: Number,
		//set a default value 
		default: null
	}

});


module.exports = {Todo};