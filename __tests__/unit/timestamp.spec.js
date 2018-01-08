/***************************************************************************************************************************************************************
 *
 * timestamp.js unit tests
 *
 * @file src/async.js
 *
 * Tested methods:
 * - TimestampCommerce
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const TimestampCommerce = require( '../../src/timestamp' );


// ----------------------------------------------------------------
// TimestampCommerce
// ----------------------------------------------------------------
test( 'TimestampCommerce: should format and add the timestamp', () => {

	const now = ( new Date() ).toJSON().slice( 0, 16 );

	const test = {
		"id": 24,
		"whitelisted": false,
		"buys": {
			"quantity": 35238,
			"unit_price": 211
		},
		"sells": {
			"quantity": 20568,
			"unit_price": 548
		}
	};

	const result = {
		"data": {},
		"id": 24,
		"whitelisted": false,
		"rawdata": {
			[ now ]: {
				"buysQuantity": 35238,
				"buysPrice": 211,
				"sellsQuantity": 20568,
				"sellsPrice": 548
			}
		}
	};


	TimestampCommerce( test, now )
		.then( data => expect( data ).toEqual( result ) )
		.catch( error => console.log( error ) );

});

test( 'TimestampCommerce: should error when object not sent', () => {

	TimestampCommerce( false, false )
		.catch( error => expect( error ).toEqual( 'Invalid object pushed into TimestampCommerce' ) );

});
