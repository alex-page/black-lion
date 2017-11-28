/***************************************************************************************************************************************************************
 *
 * merge.js unit tests
 *
 * @file src/async.js
 *
 * Tested methods:
 * - MergeCommerce
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { MergeCommerce } from '../../src/merge';


// ----------------------------------------------------------------
// MergeCommerce
// ----------------------------------------------------------------
test( 'MergeCommerce: past dates should get merged into data from rawdata', () => {

	const test = {
		"data": {},
		"id": 70,
		"rawdata": {
			"2017-11-27T09:40": {
				"buysPrice": 1,
				"buysQuantity": 2,
				"sellsPrice": 3,
				"sellsQuantity": 4
			},
			"2017-11-27T09:43": {
				"buysPrice": 5,
				"buysQuantity": 6,
				"sellsPrice": 7,
				"sellsQuantity": 8
			},
			"2017-11-27T09:46": {
				"buysPrice": 9,
				"buysQuantity": 10,
				"sellsPrice": 11,
				"sellsQuantity": 12
			},
		},
		"whitelisted": false
	};

	const result = {
		"data": {
			"2017-11-27": {
				"buysPrice": 6,
				"buysQuantity": 7,
				"sellsPrice": 8,
				"sellsQuantity": 9,
			},
		},
		"id": 70,
		"rawdata": {}
	};

	expect( MergeCommerce( test ) ).toEqual( result );

});


test( 'MergeCommerce: merge data should not merge todays data', () => {

	const today     = ( new Date() ).toJSON().slice( 0, 16 );
	const yesterday = ( new Date( Date.now() + 1*24*60*60*1000 ) ).toJSON().slice( 0, 16 )

	const test = {
		"data": {},
		"id": 70,
		"rawdata": {
			"2015-11-20T09:40": {
				"buysPrice": 1,
				"buysQuantity": 2,
				"sellsPrice": 3,
				"sellsQuantity": 4
			},
			"2015-11-20T09:43": {
				"buysPrice": 5,
				"buysQuantity": 6,
				"sellsPrice": 7,
				"sellsQuantity": 8
			},
			[ today ]: {
				"buysPrice": 9,
				"buysQuantity": 10,
				"sellsPrice": 11,
				"sellsQuantity": 12
			},
			[ yesterday ]: {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			}
		},
		"whitelisted": false
	};

	const result = {
		"data": {
			"2015-11-20": {
				"buysPrice": 3,
				"buysQuantity": 4,
				"sellsPrice": 5,
				"sellsQuantity": 6,
			},
			[ yesterday.slice( 0, 10 ) ]: {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			},
		},
		"id": 70,
		"rawdata": {
			[ today ]: {
				"buysPrice": 9,
				"buysQuantity": 10,
				"sellsPrice": 11,
				"sellsQuantity": 12
			}
		}
	};

	expect( MergeCommerce( test ) ).toEqual( result );

});
