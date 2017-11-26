/***************************************************************************************************************************************************************
 *
 * formatData.js
 *
 * FormatAsync       - Format the data in an async way
 * TimestampCommerce - Timestamps the data
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
 * TimestampData
 *
 * @param   {Object}   data          - The data to get the timestamp added to it
 * @param   {Function} FormatPattern - The function to format the data
 *
 * @returns {Promise}
 */
export const FormatAsync = ( data, FormatPattern ) => {
	Log.verbose( `TimestampData - Adding the time of the meal` );

	return new Promise( ( resolve, reject ) => {

		// For each item, asynchronously map them and format the data.
		AsyncMap( data, ( item, Callback) => {

			// Return the formatted data based on the pattern chosen
			Callback( null, FormatPattern( item ) );
		},

		// Once iterated resolve/reject promise
		( error, results ) => {
			if ( error ) {
				reject( error );
			}
			else {
				resolve( results );
			}
		});
	});
}


/**
 * TimestampCommerce - Timestamps the data
 *
 * @param {Object} data             - The data to be formatted
 * @param {String} data.id          - The item ID
 * @param {Object} data.buys        - The items buy data
 * @param {Object} data.sells       - The items sell data
 * @param {Object} data.whitelisted - Status of the item
 *
 * @returns {Object}                - The newly formatted object
 */
export const TimestampCommerce = ( data ) => {
	return {
		id: data.id,
		'whitelisted': data.whitelisted,
		data: {
			[ Date.now() ]: {
				'buys': data.buys,
				'sells': data.sells,
			}
		}
	}
}
