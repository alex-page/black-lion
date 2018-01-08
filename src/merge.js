/***************************************************************************************************************************************************************
 *
 * merge.js
 *
 * MergeCommerce - Merge items buy and sell data if it's on the same day
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const Log       = require( './helper' ).Log;


/**
 * MergeCommerce - Merge items buy and sell data if it's on the same day
 * Based off https://codereview.stackexchange.com/questions/141530/calculate-average-of-array-of-objects-per-key-value-using-reduce
 *
 * @param {Object} data                                     - The data to merge
 * @param {String} data.id                                  - The item ID
 * @param {String} data.whitelisted                         - The items status
 * @param {Object} data.rawdata                             - Unmerged data
 * @param {Object} data.data                                - Previously merged data
 * @param {String} data.rawdata[ timestamp ]                - The timestamp of when it was added to the DB
 * @param {Object} data.rawdata[ timestamp ][ key ]         - The data we need to calculate an average for
 * @param {Object} data.rawdata.whitelisted                 - Status of the item
 * @param {String} data.data[ timestamp ]                   - The day the data was added
 * @param {Object} data.data[ timestamp ][ key ]            - The data we need to calculate an average for
 * @param {Object} now                                      - The current time
 *
 * @returns {Object}    - The merged data
 */
const MergeCommerce = ( data, now ) => {

	return new Promise( ( resolve, reject ) => {

		// Check that the data is somewhat valid
		if( !data.rawdata && !data.data && typeof now !== 'object' ) {
			reject( `Invalid data: MergeCommerce function (ID: ${ data.id } )` );
		}

		// --------------------------------------------------------------
		// Reduce all of the new data ( data.rawdata ) into an array of values
		// --------------------------------------------------------------
		const yesterday = new Date( now.setDate( now.getDate() - 1 ) ); // Get yesterdays date

		const mergeObjects =  Object.keys( data.rawdata ).reduce( ( previous, timestamp ) => {

			// If the items timestamped data is older then yesterday
			if ( new Date( timestamp ) < yesterday ) {

				// Format the date as we no longer need minutes
				const date  = timestamp.slice( 0, 10 );

				// If the previous object doesn't have this date, add it
				if( !( date in previous.data ) ) {
					previous.data[ date ] = {};
				};

				// Move rawdata into an array inside previous.data[ date ][ key ]
				for ( let key in data.rawdata[ timestamp ] ) {

					// If there is existing data in previous.data[ date ]
					if( key in previous.data[ date ] ) {

						// If there is an array of data
						if ( previous.data[ date ][ key ].length ) {
							previous.data[ date ][ key ][ previous.data[ date ][ key ].length ] = data.rawdata[ timestamp ][ key ];
						}

						// Found old data with the same date, lets add it to the array
						else {
							previous.data[ date ][ key ] = [ data.data[ date ][ key ], data.rawdata[ timestamp ][ key ] ];
						}
					}

					// Create a new instance as previous.data[ date ][ key ] doesn't exist
					else {
						previous.data[ date ][ key ] = [ data.rawdata[ timestamp ][ key ] ];
					}
				}
			}

			// Keep the data in rawdata as it is still gathering data on the same day
			else {
				previous.rawdata[ timestamp ] = data.rawdata[ timestamp ];
			}

			return previous; // Return current iteration

		},
		// Set the initial value of previous for the reduce function
		{
			data: data.data || {},
			rawdata: {},
		});


		// --------------------------------------------------------------
		// Calculate the average
		// --------------------------------------------------------------
		const averageData = {}; // Empty object for the average to be inserted

		for ( let timestamp in mergeObjects.data ) {

			// Create an empty object in
			averageData[ timestamp ] = {};

			for ( let key in mergeObjects.data[ timestamp ] ) {
				// Calculate the average
				if ( typeof mergeObjects.data[ timestamp ][ key ] === 'object' ) {
					const count = mergeObjects.data[ timestamp ][ key ].length;                     // Total number of values
					const sum = mergeObjects.data[ timestamp ][ key ].reduce( ( x, y ) => x + y );  // The sum of the values
					averageData[ timestamp ][ key ] = Math.round( sum / count );
				}
				// Old data that can be left as is.
				else {
					averageData[ timestamp ][ key ] = mergeObjects.data[ timestamp ][ key ];
				}
			}
		};

		resolve({
			id: data.id,
			data: averageData,
			rawdata: mergeObjects.rawdata,
			whitelisted: data.whitelisted
		});
	})
}


module.exports = MergeCommerce;
