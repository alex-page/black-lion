/***************************************************************************************************************************************************************
 *
 * bundle.js
 *
 * Bundle - Map the data and run a format function for each item
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log } from './helper';


/**
 * Bundle - Map the data and run a format function for each item
 *
 * @param   {Object}   data          - The data to iterate and push into the FormatPattern
 * @param   {Function} FormatPattern - The function to format the data
 * @param   {Object}   now           - The time the function started
 *
 * @returns {Promise}
 */
export const Bundle = ( data, FormatPattern, now ) => {
	Log.verbose( `AsyncMap      - Changing the data asynchonously` );

	return new Promise( ( resolve, reject ) => {

		const bundle = [];

		data.map( item => {
			bundle.push( FormatPattern( item, now ) );
		});

		Promise.all( bundle )
			.then( resolve )
			.catch( error => reject( error ) );
	});
}



