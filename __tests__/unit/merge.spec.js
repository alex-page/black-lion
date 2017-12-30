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
const MergeCommerce = require( '../../src/merge' );


// ----------------------------------------------------------------
// MergeCommerce
// ----------------------------------------------------------------
test( 'MergeCommerce: rawdata gets added to data', () => {

	const now = new Date( '2017-11-30T09:40' );

	const test = {
		"data": {},
		"id": 1,
		"rawdata": {
			"2017-10-25T09:40": {
				"buysPrice": 1,
				"buysQuantity": 2,
				"sellsPrice": 3,
				"sellsQuantity": 4
			},
		},
		"whitelisted": false
	};

	const result = {
		"id": 1,
		"data": {
			"2017-10-25": {
				"buysPrice": 1,
				"buysQuantity": 2,
				"sellsPrice": 3,
				"sellsQuantity": 4
			}
		},
		"whitelisted": false,
		"rawdata": {}
	};

	MergeCommerce( test, now )
		.then( data => expect( data ).toEqual( result ) );

});


test( 'MergeCommerce: rawdata gets merged with data if it is on the same date', () => {

	const now = new Date( '2017-11-30T09:40' );

	const test = {
		"data": {
			"2017-10-25": {
				"buysPrice": 10,
				"buysQuantity": 20,
				"sellsPrice": 30,
				"sellsQuantity": 40
			},
		},
		"id": 2,
		"rawdata": {
			"2017-10-25T09:40": {
				"buysPrice": 1,
				"buysQuantity": 2,
				"sellsPrice": 3,
				"sellsQuantity": 4
			},
		},
		"whitelisted": false
	};

	const result = {
		"id": 2,
		"data": {
			"2017-10-25": {
				"buysPrice": 6,
				"buysQuantity": 11,
				"sellsPrice": 17,
				"sellsQuantity": 22
			}
		},
		"whitelisted": false,
		"rawdata": {}
	};

	MergeCommerce( test, now )
		.then( data => expect( data ).toEqual( result ) );

});


test( 'MergeCommerce: merge data should not merge today or yesterdays data', () => {

	const now = new Date( '2015-11-20T09:40' );

	const test = {
		"data": {},
		"id": 3,
		"rawdata": {
			"2015-11-19T09:40": {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			},
			"2015-11-20T09:45": {
				"buysPrice": 9,
				"buysQuantity": 10,
				"sellsPrice": 11,
				"sellsQuantity": 12
			}
		},
		"whitelisted": false
	};

	const result = {
		"id": 3,
		"data": {},
		"rawdata": {
			"2015-11-19T09:40": {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			},
			"2015-11-20T09:45": {
				"buysPrice": 9,
				"buysQuantity": 10,
				"sellsPrice": 11,
				"sellsQuantity": 12
			}
		},
		"whitelisted": false
	};

	MergeCommerce( test, now )
		.then( data => expect( data ).toEqual( result ) )
		.catch( error => console.error( error ) );

});


test( 'MergeCommerce: Old data should get merged with new data', () => {

	const now = new Date( '2015-11-20T09:40' );

	const test = {
		"data": {
			"2015-10-10": {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			},
			"2015-11-10": {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			}
		},
		"id": 4,
		"rawdata": {
			"2015-11-10T09:40": {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			},
			"2015-11-10T09:45": {
				"buysPrice": 9,
				"buysQuantity": 10,
				"sellsPrice": 11,
				"sellsQuantity": 12
			},
			"2015-11-10T09:50": {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			}
		},
		"whitelisted": false
	};

	const result = {
		"id": 4,
		"data": {
			"2015-10-10": {
				"buysPrice": 13,
				"buysQuantity": 14,
				"sellsPrice": 15,
				"sellsQuantity": 16
			},
			"2015-11-10": {
				"buysPrice": 12,
				"buysQuantity": 13,
				"sellsPrice": 14,
				"sellsQuantity": 15
			}
		},
		"rawdata": {},
		"whitelisted": false
	};

	MergeCommerce( test, now )
		.then( data => expect( data ).toEqual( result ) )
		.catch( error => console.error( error ) );

});


test( 'MergeCommerce: past dates should get merged into data from rawdata', () => {

	MergeCommerce( false, false )
		.catch( error => expect( error ).toEqual( 'Invalid data: MergeCommerce function (ID: undefined )' ) );

});
