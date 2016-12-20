const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema(
	{

		email: {
			type: String,
			trim: true,
			required: true,
			minlength: 1,
			//verify that the email is unique
			unique: true,
			//validate is used wtih mongoose validation "http://mongoosejs.com/docs/validation.html"
			//go to the docs to get an idea of what is going on with it
			//to validate the email we use the npm validator module - https://www.npmjs.com/package/validator
			validate: {
				validator: (value)=> {
					//this uses the validator module "isEmail" method.
					return validator.isEmail(value);
				}, 
				message: '{VALUE} is not a valid email'
			}

		},
		password: {
			type: String,
			required: true,
			minlength: 6
		},
		//tokens will be used to pass tokens to individual users
		tokens: [{
			access: {
				type: String,
				required: true
			},
			token: {
				type: String,
				required: true
			}
		}]

	});


//you can override methods to update how mongoose does certain things.  Here was want to override what gets sent back when a mongoose model is returned as a json value.

UserSchema.methods.toJSON = function() {
	var user = this;
	var userObject = user.toObject();
	//this allows the password and other sensitive information to not be sent back in the header response
	return _.pick(userObject, ['_id', 'email']);
};

//add method on UserSchema.methods - this is an object that allows you to add methods.  Arrow functions do not bind, so we are using the regular function.
UserSchema.methods.generateAuthToken = function() {
	var user = this;
	//get access value and token value
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens.push({
		access: access,
		token: token
	});

	return user.save().then( () => {
		return token;
	});
};

var User = mongoose.model("User", UserSchema);


module.exports = {User};


