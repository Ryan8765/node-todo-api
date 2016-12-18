//load mongoose - library used for mongodb

var mongoose = require('mongoose');




//Need to tell mongoose which promise library to use.
mongoose.Promise = global.Promise;

//connect to database.  
mongoose.connect(process.env.MONGODB_URI);



module.exports = {
	mongoose
}