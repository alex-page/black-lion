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
// test( 'MergeCommerce: past dates should get merged into data from rawdata', () => {

//	const now = new Date( '2015-11-20T09:40' );

// 	const test = {
// 		"data": {},
// 		"id": 70,
// 		"rawdata": {
// 			"2017-11-25T09:40": {
// 				"buysPrice": 1,
// 				"buysQuantity": 2,
// 				"sellsPrice": 3,
// 				"sellsQuantity": 4
// 			},
// 			"2017-11-25T09:43": {
// 				"buysPrice": 5,
// 				"buysQuantity": 6,
// 				"sellsPrice": 7,
// 				"sellsQuantity": 8
// 			},
// 			"2017-11-25T09:46": {
// 				"buysPrice": 9,
// 				"buysQuantity": 10,
// 				"sellsPrice": 11,
// 				"sellsQuantity": 12
// 			},
// 		},
// 		"whitelisted": false
// 	};

// 	const result = {
// 		"id": 70,
// 		"data": {
// 			"2017-11-25": {
// 				"buysPrice": 6,
// 				"buysQuantity": 7,
// 				"sellsPrice": 8,
// 				"sellsQuantity": 9,
// 			},
// 		},
// 		"rawdata": {}
// 	};

// 	MergeCommerce( test )
// 		.then( data => expect( data ).toEqual( result ) );
// });


test( 'MergeCommerce: merge data should not merge todays data', () => {

	// Date.now for jest to mock 2015-11-20T09:40
	const now = new Date( '2015-11-20T09:40' );

	const test = {
		"data": {},
		"id": 70,
		"rawdata": {
			"2015-11-15T09:40": {
				"buysPrice": 1,
				"buysQuantity": 2,
				"sellsPrice": 3,
				"sellsQuantity": 4
			},
			"2015-11-15T09:43": {
				"buysPrice": 5,
				"buysQuantity": 6,
				"sellsPrice": 7,
				"sellsQuantity": 8
			},
			"2015-11-19T09:40": {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			},
			"2015-11-20T09:40": {
				"buysPrice": 9,
				"buysQuantity": 10,
				"sellsPrice": 11,
				"sellsQuantity": 12
			}
		},
		"whitelisted": false
	};

	const result = {
		"id": 70,
		"data": {
			"2015-11-15": {
				"buysPrice": 3,
				"buysQuantity": 4,
				"sellsPrice": 5,
				"sellsQuantity": 6,
			}
		},
		"rawdata": {
			"2015-11-19T09:40": {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			},
			"2015-11-20T09:40": {
				"buysPrice": 9,
				"buysQuantity": 10,
				"sellsPrice": 11,
				"sellsQuantity": 12
			}
		}
	};

	MergeCommerce( test, now )
		.then( data => expect( data ).toEqual( result ) );

});


test( 'MergeCommerce: past dates should get merged into data from rawdata', () => {

	MergeCommerce( false, false )
		.catch( error => expect( error ).toEqual( 'Invalid data for MergeCommerce function' ) );

});
