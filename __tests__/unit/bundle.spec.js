/***************************************************************************************************************************************************************
 *
 * bundle.js unit tests
 *
 * @file src/bundle.js
 *
 * Tested methods:
 * - Bundle
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const Bundle = require( '../../src/bundle' );


// ----------------------------------------------------------------
// Bundle
// ----------------------------------------------------------------
test( 'Bundle: should take a function and data and run it asynchronously', () => {

	const test = [{ "a": 24, "b": 15 }, { "a": 12, "b": 99 }, { "a": 1, "b": 1 } ];

	const result = [ 39, 111, 2 ].sort();

	const TestFunction = ( item ) => {
		return item.a + item.b;
	};

	Bundle( test, TestFunction )
		.then( data => expect( data.sort() ).toEqual( result ) )

});


test( 'Bundle: should throw an error if the result of the function is not truthy', () => {

	const test = [{ "a": 24, "b": 15 } ];

	const TestFunction = ( item ) => {
		return new Promise( ( resolve, reject ) =>{
			reject( 'Nope!' );
		})
	};

	Bundle( test, TestFunction )
		.catch( error => expect( error ).toEqual( 'Nope!' ) );

});
