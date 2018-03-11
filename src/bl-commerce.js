/***************************************************************************************************************************************************************
 *
 * bl-commerce.js
 *
 * GetCommerceData - Gets the commerce data from the API
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const SETTINGS          = require( './settings' );
const Log               = require( './helper' ).Log;
const InsertDB          = require( './rethinkdb' ).InsertDB;
const GetTotalPages     = require( './get' ).GetTotalPages;
const GetBulkData       = require( './get' ).GetBulkData;
const FormatData        = require( './format-data' );
const TimestampCommerce = require( './timestamp' );


/**
 * GetCommerceData - Gets the commerce data from the API
 */
const GetData = (
		url = SETTINGS.get().api.commerce,
		now = new Date()
	) => {
	Log.message( `GetData()   Started`);

	now = now.toJSON().slice( 0, 16 );

	return new Promise( ( resolve, reject ) => {
		GetTotalPages( url )
			.then(  totalPages      => GetBulkData( url, totalPages ) )
			.then(  unformattedData => FormatData( unformattedData, TimestampCommerce, now ) )
			.then(  data            => InsertDB( data, SETTINGS.get().db, SETTINGS.get().table.commerce ) )
			.then(  results         => resolve( `GetData()   Finished - [ ${ results }]` ) )
			.catch( error           => reject( `GetData()   Failed   - ${ error }` ) );
	})
};

module.exports = GetData;
