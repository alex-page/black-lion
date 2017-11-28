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
import { TimestampCommerce } from '../../src/timestamp';


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


	expect( TimestampCommerce( test ) ).toEqual( result )

});
