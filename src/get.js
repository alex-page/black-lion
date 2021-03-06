/***************************************************************************************************************************************************************
 *
 * get.js
 *
 * GetData       - Gets data body from a url
 * GetTotalPages - Does a small request to get the total data items ( x-result-total )
 * GetBulkData   - Gets a lot of data from a url
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const Got = require( 'got' );


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const Log      = require( './helper' ).Log;
const SETTINGS = require( './settings' );


/**
 * GetData - Gets data body from a url
 *
 * @param    {String} url        - The URL to get data from
 * @param    {Object} option     - The options from the https://github.com/sindresorhus/got
 *
 * @returns {Promise}           - The data body
 */
const GetData = ( url, option ) => {
	Log.verbose( `GetData       - Getting page #${ option.query.page + 1 } from: ${ url }.` );
	return new Promise( ( resolve, reject ) => {
		Got( url, option )
			.then( data => resolve( data.body ) )
			.catch( error => reject( error ) );
	});
}


/**
 * GetTotalPages - Does a small request to get the total data items ( x-result-total )
 *
 * @param    {String} url - The URL to get data from
 *
 * @returns {Promise}    - The total number of data items
 */
const GetTotalPages = ( url ) => {
	Log.verbose( `GetTotalPages - Getting total pages from x-result-total.` );
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
 * @param    {String} url        - The URL to get data from
 * @param    {Number} totalItems - The total number of items to get data for
 * @param    {Number} apiLimit   - The number of items that can be requested
 *
 * @returns {Promise}           - The data from all of the requests
 */
const GetBulkData = ( url, totalItems, apiLimit = SETTINGS.get().api.limit ) => {
	Log.verbose( `GetBulkData   - Getting ${ totalItems } items` );

	return new Promise( ( resolve, reject ) => {

		// Get total requests and remove decimal
		const dataBundle    = [];
		const totalRequests = ( totalItems / apiLimit ) | 0;
		let   page          = 0;

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


module.exports = {
	GetData: GetData,
	GetBulkData: GetBulkData,
	GetTotalPages: GetTotalPages,
};
