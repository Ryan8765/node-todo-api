//load mongoose - library used for mongodb

var mongoose = require('mongoose');




//Need to tell mongoose which promise library to use.
mongoose.Promise = global.Promise;

//connect to database.  If heroku is available - connect to database in heroku - otherwise connect locally.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');



module.exports = {
	mongoose
}