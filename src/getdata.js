/**
 * getdata.js
 *
 * FormatData - Format the data
 * GetData    - Fetch from the GW2 API
 */


// Dependencies
const Got = require( 'got' );


/**
 * FormatData
 *
 * @param {*} time   - The time the data was fetched
 * @param {*} data   - The data that was received
 *
 * @returns {object} - Formatted object
 */
const FormatData = ( time, { id, whitelisted, buys, sells }) => ({
	[ id ]: {
		whitelisted,
		priceHistory: {
			[ time ]: {
				buys,
				sells,
			},
		},
	},
});


/**
 * GetData
 *
 * @param {*} url   - The url to get data from
 * @param {*} limit - The maximum items to request
 */
const GetData = async ( url, limit ) => {
	try {
		const time = new Date();
		const { headers } = await Got( url );
		const totalQueries = Math.ceil( headers[ 'x-result-total' ] / limit );
		// const totalQueries = 5;

		// Create multiple requests to the URL
		const bulkData = Array( totalQueries ).fill( 0 )
			.map( async ( query, i ) => {
				const { body } = await Got( url, {
					json:  true,
					query: {
						page:      i,
						page_size: limit,
					},
				});

				// Format the data and return it
				return body.map( data => FormatData( time, data ) );
			});

		const results = await Promise.all( bulkData );
		const flattenedResults = [].concat( ...results );

		// Turn the results into an object
		return flattenedResults;
	}
	catch( error ) {
		console.error( error );
	}
};


// Export the functions
module.exports = GetData;
module.exports.FormatData = FormatData;
