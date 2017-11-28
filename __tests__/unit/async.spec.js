/***************************************************************************************************************************************************************
 *
 * async.js unit tests
 *
 * @file src/async.js
 *
 * Tested methods:
 * - AsyncMapFormat
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { AsyncMapFormat } from '../../src/async';


// ----------------------------------------------------------------
// AsyncMapFormat
// ----------------------------------------------------------------
test('AsyncMapFormat: should take a function and data and run it asynchronously', () => {

	const test = [{ "a": 24, "b": 15 }, { "a": 12, "b": 99 }, { "a": 1, "b": 1 } ];

	const result = [ 39, 111, 2 ].sort();

	const TestFunction = ( item ) => {
		return item.a + item.b;
	};

	AsyncMapFormat( test, TestFunction )
		.then( data => expect( result ).toEqual( data.sort() ) )

});


test('AsyncMapFormat: should throw an error if the result of the function is not truthy', () => {

	const test = [{ "a": 24, "b": 15 } ];

	const TestFunction = ( item ) => {
		return null;
	};

	AsyncMapFormat( test, TestFunction )
		.catch( error => expect( error ).toEqual( 'Issue with FormatPattern function.' ) );

});
