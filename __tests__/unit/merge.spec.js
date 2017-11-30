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

	const now = new Date( '2017-11-30T09:40' );

	const test = {
		"data": {
			"2017-10-25": {
				"buysPrice": 100,
				"buysQuantity": 200,
				"sellsPrice": 300,
				"sellsQuantity": 400
			},
			"2017-11-25": {
				"buysPrice": 100,
				"buysQuantity": 200,
				"sellsPrice": 300,
				"sellsQuantity": 400
			}
		},
		"id": 1,
		"rawdata": {
			"2017-10-25T09:40": {
				"buysPrice": 1,
				"buysQuantity": 2,
				"sellsPrice": 3,
				"sellsQuantity": 4
			},
			"2017-11-25T09:43": {
				"buysPrice": 5,
				"buysQuantity": 6,
				"sellsPrice": 7,
				"sellsQuantity": 8
			},
			"2017-11-25T09:46": {
				"buysPrice": 9,
				"buysQuantity": 10,
				"sellsPrice": 11,
				"sellsQuantity": 12
			},
		},
		"whitelisted": false
	};

	const result = {
		"id": 1,
		"data": {
			"2017-11-25": {
				"buysPrice": 5,
				"buysQuantity": 6,
				"sellsPrice": 7,
				"sellsQuantity": 8,
			},
		},
		"rawdata": {}
	};

	MergeCommerce( test, now )
		.then( data => expect( data ).toEqual( result ) )
		.catch( error => console.error( error ) );
});


// test( 'MergeCommerce: merge data should not merge todays data', () => {

// 	// Date.now for jest to mock 2015-11-20T09:40
// 	const now = new Date( '2015-11-20T09:40' );

// 	const test = {
// 		"data": {
// 			"2015-11-10": {
// 				"buysPrice": 1,
// 				"buysQuantity": 2,
// 				"sellsPrice": 3,
// 				"sellsQuantity": 4
// 			},
// 			"2015-11-15": {
// 				"buysPrice": 100,
// 				"buysQuantity": 101,
// 				"sellsPrice": 102,
// 				"sellsQuantity": 103
// 			}
// 		},
// 		"id": 2,
// 		"rawdata": {
// 			"2015-11-15T09:40": {
// 				"buysPrice": 1,
// 				"buysQuantity": 2,
// 				"sellsPrice": 3,
// 				"sellsQuantity": 4
// 			},
// 			"2015-11-15T09:43": {
// 				"buysPrice": 5,
// 				"buysQuantity": 6,
// 				"sellsPrice": 7,
// 				"sellsQuantity": 8
// 			},
// 			"2015-11-15T09:49": {
// 				"buysPrice": 9,
// 				"buysQuantity": 10,
// 				"sellsPrice": 11,
// 				"sellsQuantity": 12
// 			},
// 			"2015-11-15T09:51": {
// 				"buysPrice": 13,
// 				"buysQuantity": 14,
// 				"sellsPrice": 15,
// 				"sellsQuantity": 16
// 			},
// 			"2015-11-19T09:40": {
// 				"buysPrice": 13,
// 				"buysQuantity": 14,
// 				"sellsPrice": 15,
// 				"sellsQuantity": 16
// 			},
// 			"2015-11-20T09:40": {
// 				"buysPrice": 9,
// 				"buysQuantity": 10,
// 				"sellsPrice": 11,
// 				"sellsQuantity": 12
// 			}
// 		},
// 		"whitelisted": false
// 	};

// 	const result = {
// 		"id": 2,
// 		"data": {
// 			"2015-11-10": {
// 				"buysPrice": 1,
// 				"buysQuantity": 2,
// 				"sellsPrice": 3,
// 				"sellsQuantity": 4
// 			},
// 			"2015-11-15": {
// 				"buysPrice": 100,
// 				"buysQuantity": 200,
// 				"sellsPrice": 300,
// 				"sellsQuantity": 400,
// 			}
// 		},
// 		"rawdata": {
// 			"2015-11-19T09:40": {
// 				"buysPrice": 13,
// 				"buysQuantity": 14,
// 				"sellsPrice": 15,
// 				"sellsQuantity": 16
// 			},
// 			"2015-11-20T09:40": {
// 				"buysPrice": 9,
// 				"buysQuantity": 10,
// 				"sellsPrice": 11,
// 				"sellsQuantity": 12
// 			}
// 		}
// 	};

// 	MergeCommerce( test, now )
// 		.then( data => expect( data ).toEqual( result ) )
// 		.catch( error => console.error( error ) );

// });


// test( 'MergeCommerce: past dates should get merged into data from rawdata', () => {

// 	MergeCommerce( false, false )
// 		.catch( error => expect( error ).toEqual( 'Invalid data: MergeCommerce function (ID: undefined )' ) );

// });
