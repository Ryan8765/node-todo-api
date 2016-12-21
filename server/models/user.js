const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');
//middleware methods check out the mongoose middleware

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

//you can create model methods - these are used on the actual models "User" (it isn't an instance it works off of, it is the actual class).  Everything added to statics is made a model method
UserSchema.statics.findByToken = function(token) {
	//the model is the "this"
	var User = this;
	var decoded; 

	try {
		decoded = jwt.verify(token, 'abc123');
	} catch(e) {
		return new Promise( (resolve, reject) => {
			reject();
		});
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token':token,
		'tokens.access':'auth'
	});
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


//this is gonig to run some code before running an event - this is from mongoose documenation
UserSchema.pre('save', function(next) {
	var user = this;

	if( user.isModified('password') ) {
		//user.password
		bcrypt.genSalt(10,  (er, salt) => {
			bcrypt.hash(user.password, salt,  (err, hash) => {
				user.password = hash;
				next();
			});
		});
		//user.password = hash;



		//next();
	} else {
		next();
	}
});

var User = mongoose.model("User", UserSchema);


module.exports = {User};


