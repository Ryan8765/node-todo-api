var env = process.env.NODE_ENV || 'development';


if( env === 'development' || env === 'test' ) {
	//it will automatically parse this to an object
	var config = require('./config.json');
	var envConfig = config[env];

	//takes an object and returns all keys as an array then loops over all keys
	Object.keys(envConfig).forEach( (key) => {
		process.env[key] = envConfig[key];
	});

}








//This allows us to use both a test and a live database to do our test cases in.  So our test cases won't whipe the live database. 
//this was replaced with a json file later in the course....config.json
// if(env === 'development') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }