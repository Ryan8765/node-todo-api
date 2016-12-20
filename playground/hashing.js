//sha256 npm install crypto-js@3.1.6 --save
const {SHA256} = require('crypto-js');
//npm install nsonwebtoken@7.1.9 --save
const jwt = require('jsonwebtoken');



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

var data = {
	id: 10
};


//this returns a token given the data and the 'salt'
var token = jwt.sign(data, '123abc');
console.log( token );


//to make sure a token wasn't modified use jwt.verify
var decoded = jwt.verify(token, '123abc');
console.log( 'decoded', decoded );

