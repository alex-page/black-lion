/***************************************************************************************************************************************************************
 *
 * change-data.js
 *
 * ChangeAsync       - Change the data in an async way
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
 * ChangeAsync
 *
 * @param   {Object}   data          - The data to get the timestamp added to it
 * @param   {Function} FormatPattern - The function to format the data
 *
 * @returns {Promise}
 */
export const ChangeAsync = ( data, FormatPattern ) => {
	Log.verbose( `ChangeAsync - Changing the data asynchonously` );

	return new Promise( ( resolve, reject ) => {

		// For each item, asynchronously map them and format the data.
		AsyncMap( data, ( item, Callback) => {

			// Return the formatted data based on the pattern chosen
			Callback( null, FormatPattern( item ) );
		},

		// Once iterated resolve/reject promise
		( error, results ) => {
			if ( error ) reject( error )
			else resolve( results );
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
	// No log here as it gets looped a lot!

	return {
		id: data.id,
		'whitelisted': data.whitelisted,
		rawdata: {
			[ Date.now() ]: {
				'buysQuantity' : data.buys.quantity,
				'buysPrice'    : data.buys.unit_price,
				'sellsQuantity': data.sells.quantity,
				'sellsPrice'   : data.sells.unit_price,
			}
		}
	}
}


/**
 * MergeDay - Merges items with the same day timestamp
 * Based off https://codereview.stackexchange.com/questions/141530/calculate-average-of-array-of-objects-per-key-value-using-reduce
 *
 * @param {Object} data             - The data to be formatted
 * @param {String} data.id          - The item ID
 * @param {Object} data.buys        - The items buy data
 * @param {Object} data.sells       - The items sell data
 * @param {Object} data.whitelisted - Status of the item
 *
 * @returns {Object}                - The newly formatted object
 */
export const MergeDay = ( data ) => {
	// MergeDay - Merging item buy/sell data if it's on the same day

	const merged = Object.keys( data.rawdata ).reduce( ( previous, timestamp ) => {

		const date    = ( new Date( timestamp * 1 ) ).toJSON().slice( 0, 16 );


		// Add the day if it doesn't exist
		if( !( date in previous ) ) {
			previous[ date ] = {};
		}

		// Go through the keys and get the total and the number of iterations
		for ( let key in data.rawdata[ timestamp ] ) {

			if ( typeof data.rawdata[ timestamp ][ key ] !== 'number' ) {
				Log.error( `The key to merge must be a number got: ${ data.rawdata[ timestamp ][ key ] }` );
			}

			// If the key already is in previous, add to it
			if( key in previous[ date ] ) {
				// Add the previous to the current, get the average, remove the decimal
				previous[ date ][ key ] = ( ( previous[ date ][ key ] + data.rawdata[ timestamp ][ key ] ) / 2 ) | 0;
			}

			// The key isn't in previous, create new instance
			else {
				previous[ date ][ key ] =  data.rawdata[ timestamp ][ key ];
			}
		}

		return previous;

	}, {}); // Set initial value to empty object


	return {
		id: data.id,
		data: merged,
		rawdata: {}
	}
}
