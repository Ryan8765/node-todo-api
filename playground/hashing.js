//sha256 npm install crypto-js@3.1.6 --save
const {SHA256} = require('crypto-js');
//npm install nsonwebtoken@7.1.9 --save
const jwt = require('jsonwebtoken');
//load bcrypt for hasing 
const bcrypt = require('bcryptjs');



// var message = 'I am user number 3';

// //this is a one way hash
// var hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);



// var data = {
// 	id: 4
// };

// var token = {
// 	data: data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };


// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
// 	console.log( 'data was not changed' );
// } else {
// 	console.log( 'data has been changed' );
// }





/******************************************************************************

	easier library to accomplish the same thing as above - jwt.io

******************************************************************************/

// var data = {
// 	id: 10
// };


// //this returns a token given the data and the 'salt'
// var token = jwt.sign(data, '123abc');
// console.log( token );


// //to make sure a token wasn't modified use jwt.verify
// var decoded = jwt.verify(token, '123abc');
// console.log( 'decoded', decoded );


/******************************************************************************

		Using bcrypt to hash and store password in the database.

******************************************************************************/
var password = '123abc';

//have ot run two methods to generate the hash and salt. 

//generate hte salt.  first number is number of rounds - how long the algorithm takes to run.
bcrypt.genSalt(10,  (er, salt) => {
	bcrypt.hash(password, salt,  (err, hash) => {
		console.log(hash);
	});
});

var hashedPassword = '$2a$10$luBspfqv/IEKk2fkInxLcu9fHQFdGBBhITZl6n7omzTzsdNDf2V3.';

//then i got the password from above that was logged to the console and am trying to reverse engineer  the password

bcrypt.compare(password, hashedPassword,  (	err, res) => {
		console.log(res);
});
