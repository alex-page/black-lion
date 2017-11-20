/***************************************************************************************************************************************************************
 *
 * gotdata.js
 *
 * GotData -
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Got         from 'got';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log }      from './helper';
import { SETTINGS } from './settings';


/**
 * GetData - Gets data body from a url
 *
 * @type   {String} url        - The URL to get data from
 * @type   {Object} option     - The options from the https://github.com/sindresorhus/got
 *
 * @return {Promise}           - The data body
 */
export const GetData = ( url, option ) => {
	Log.verbose( `GetData       - Serving meal #${ option.query.page + 1 } from: ${ url }.` );
	return new Promise( ( resolve, reject ) => {
		Got( url, option )
			.then( data => resolve( data.body ) )
			.catch( error => reject( error ) );
	});
}


/**
 * GetTotalPages - Does a small request to get the total data items ( x-result-total )
 *
 * @type   {String} url - The URL to get data from
 *
 * @return {Promise}    - The total number of data items
 */
export const GetTotalPages = ( url ) => {
	Log.verbose( `GetTotalPages - Counting the number of meals.` );
	return new Promise( ( resolve, reject ) => {
		Got( url, {
				json: true,
				query: {
					page: 0,
					page_size: 1
				}
			})
			.then( data => resolve( data.headers[ 'x-result-total' ] ) )
			.catch( error => reject( error ) );
	});
}


/**
 * GetBulkData - Gets a lot of data from a url
 *
 * @type   {String} url        - The URL to get data from
 * @type   {Number} totalItems - The total number of items to get data for
 * @type   {Number} apiLimit   - The number of items that can be requested
 *
 * @return {Promise}           - The data from all of the requests
 */
export const GetBulkData = ( url, totalItems, apiLimit = SETTINGS.get().api.limit ) => {
	Log.verbose( `GetBulkData   - Searching ${ totalItems } meals for tasty treats` );

	return new Promise( ( resolve, reject ) => {

		// Get total requests and remove decimal
		const totalRequests = ( totalItems / apiLimit ) | 0;
		const dataBundle = [];
		let   page = 0;

		// Iterate through all the pages
		while ( page <= totalRequests ) {

			dataBundle.push(
				GetData( url, {
					json: true,
					query: {
						page: page,
						page_size: apiLimit
					}
				})
			)

			// Increase page number
			page++;
		}

		Promise.all( dataBundle )
			.then( data => resolve( [].concat.apply([], data ) ) )
			.catch( error => reject( error ) );

	})

}

