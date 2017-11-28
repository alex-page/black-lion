/***************************************************************************************************************************************************************
 *
 * merge.js
 *
 * MergeCommerce - Merges items by day and commerce keys
 *
 **************************************************************************************************************************************************************/


'use strict';


// Time to the day when the file was ran
const today       = new Date();
const yesterday   = new Date( today.setDate( today.getDate() - 1 ) );


/**
 * MergeCommerce - Merges items by day and commerce keys
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
export const MergeCommerce = ( data ) => {
	// MergeDay - Merging item buy/sell data if it's on the same day

	const merged = Object.keys( data.rawdata ).reduce( ( previous, timestamp ) => {

		// If the items data is less then yesterday
		if ( new Date( timestamp ) <= yesterday ) {

			const date = timestamp.slice( 0, 10 );

			// Add the day if it doesn't exist
			if( !( date in previous.data ) ) {
				previous.data = {
					[ date ]: {}
				};
			}

			// Go through the keys and get the total and the number of iterations
			for ( let key in data.rawdata[ timestamp ] ) {

				// If the key already is in previous, add to it
				if( key in previous.data[ date ] ) {
					// Add the previous to the current, get the average, remove the decimal
					previous.data[ date ][ key ] = ( ( previous.data[ date ][ key ] + data.rawdata[ timestamp ][ key ] ) / 2 ) | 0;
				}

				// The key isn't in previous, create new instance
				else {
					previous.data[ date ][ key ] =  data.rawdata[ timestamp ][ key ];
				}
			}
		}
		else {
			// Add the rawdata to previous as its fresh data
			previous.rawdata[ timestamp ] = data.rawdata[ timestamp ];
		}

		return previous;

	},
	// Set the initial value of previous for the reduce function
	{
		id: data.id,
		data: {},
		rawdata: {},
	});

	return merged;
}
