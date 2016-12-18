var env = process.env.NODE_ENV || 'development';

//This allows us to use both a test and a live database to do our test cases in.  So our test cases won't whipe the live database. 
if(env === 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}