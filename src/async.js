/***************************************************************************************************************************************************************
 *
 * async.js
 *
 * AsyncMapFormat - Map the data asynchronously and run a function against it
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import AsyncMap from 'async/map';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log } from './helper';


/**
 * AsyncMapFormat - Map the data asynchronously and run a format function for each item
 *
 * @param   {Object}   data          - The data to iterate and push into the FormatPattern
 * @param   {Function} FormatPattern - The function to format the data
 *
 * @returns {Promise}
 */
export const AsyncMapFormat = ( data, FormatPattern ) => {
	Log.verbose( `AsyncMap      - Changing the data asynchonously` );

	return new Promise( ( resolve, reject ) => {

		// For each item, asynchronously map them and format the data.
		AsyncMap( data, ( item, Callback ) => {

			const formattedData = FormatPattern( item );

			// Return the formatted data based on the pattern chosen
			if ( formattedData ) {
				Callback( null, formattedData );
			}
			else {
				Callback( 'Issue with FormatPattern function.' );
			}

		// Once iterated resolve/reject promise
		}, ( error, results ) => {
			if ( error ) {
				reject( error );
			}
			else {
				resolve( results );
			}
		});
	});
}



