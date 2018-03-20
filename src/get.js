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


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEPENDENCIES
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Got = require( 'got' );
const Log = require( 'lognana' );


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const SETTINGS = require( './settings' );


/**
 * GetData - Gets data body from a url
 *
 * @param    {String} url        - The URL to get data from
 * @param    {Object} option     - The options from the https://github.com/sindresorhus/got
 *
 * @returns {Promise}           - The data body
 */
const GetData = async ( url, option ) => {
	Log.verbose( `GetData       - Getting page #${ option.query.page + 1 } from: ${ url }.` );
	try {
		const data = Got( url, option );
		return data.body;
	}
	catch( error ) {
		Log.error( `GetData() error: ${ error.message }` );
	}
}


/**
 * GetTotalPages - Does a small request to get the total data items ( x-result-total )
 *
 * @param    {String} url - The URL to get data from
 *
 * @returns {Promise}    - The total number of data items
 */
const GetTotalPages = async ( url ) => {
	Log.verbose( `GetTotalPages - Getting total pages from x-result-total.` );
	try {
		const data = await Got( url, {
			json: true,
			query: {
				page: 0,
				page_size: 1
			}
		});
		return data.headers[ 'x-result-total' ];
	}
	catch( error ) {
		Log.error( `GetTotalPages() error: ${ error.message }` );
	};
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
const GetBulkData = async ( url, totalItems, apiLimit = SETTINGS.get().api.limit ) => {
	Log.verbose( `GetBulkData   - Getting ${ totalItems } items` );

	try {
		// Get total requests and remove decimal
		const dataBundle    = [];
		const totalRequests = ( totalItems / apiLimit ) | 0;
		let   page          = 0;

		// Iterate through all the pages
		while ( page <= totalRequests ) {

			const rawData = await GetData( url, {
				json: true,
				query: {
					page: page,
					page_size: apiLimit
				}
			});

			dataBundle.push( rawData );

			// Increase page number
			page++;
		}

		const data = [].concat.apply( [], dataBundle );

		return data;
	}

	catch( error ) {
		Log.error( `GetBulkData() error: ${ error.message }` );
	};
}


module.exports = {
	GetData: GetData,
	GetBulkData: GetBulkData,
	GetTotalPages: GetTotalPages,
};
