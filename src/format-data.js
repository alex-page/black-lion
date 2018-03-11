/***************************************************************************************************************************************************************
 *
 * format-data.js
 *
 * FormatData - Map the data and run a format function for each item
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const Log = require( './helper' ).Log;


/**
 * FormatData - Iterate the data and run a format function for each item
 *
 * @param   {Object}   data          - The data to iterate and push into the FormatPattern
 * @param   {Function} FormatPattern - The function to format the data
 * @param   {Object}   now           - The time the function started
 *
 * @returns {Promise}
 */
const FormatData = ( data, FormatPattern, now ) => {
	Log.verbose( `FormatData      - Changing the data asynchonously` );

	return new Promise( ( resolve, reject ) => {

		const formattedData = [];

		data.map( item => {
			formattedData.push( FormatPattern( item, now ) );
		});

		Promise.all( formattedData )
			.then( resolve )
			.catch( error => reject( error ) );
	});
}


module.exports = FormatData;
