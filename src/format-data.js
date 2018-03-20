/***************************************************************************************************************************************************************
 *
 * format-data.js
 *
 * FormatData - Map the data and run a format function for each item
 *
 **************************************************************************************************************************************************************/


'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEPENDENCIES
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Log = require( 'lognana' );


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

	try {
		const formattedData = data.map( item => FormatPattern( item, now ) );
		return formattedData;
	}
	catch ( error ) {
		Log.error( `FormatData() ${ error }` );
	}
}


module.exports = FormatData;
