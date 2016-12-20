const {User} = require('./../models/user');


var authenticate = (req, res, next) => {
	var token = req.header('x-auth');

	User.findByToken(token).then( (user) => {
		if(!user) {
			//this stops the rest of the fucntion from firing and goes straight to the catch block. 
			return Promise.reject();
		}

		req.user = user;
		req.token = token;
		next();
	}).catch( (e) => {
		return res.status(401).send();
	});
};

module.exports = {authenticate};