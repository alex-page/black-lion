/***************************************************************************************************************************************************************
 *
 * bl-commerce.js
 *
 * GetCommerceData - Gets the commerce data from the API
 *
 **************************************************************************************************************************************************************/


'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEPENDENCIES
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Log = require( 'lognana' );


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const SETTINGS          = require( './settings' );
const InsertDB          = require( './rethinkdb' ).InsertDB;
const GetTotalPages     = require( './get' ).GetTotalPages;
const GetBulkData       = require( './get' ).GetBulkData;
const FormatData        = require( './format-data' );
const TimestampCommerce = require( './timestamp' );


/**
 * GetCommerceData - Gets the commerce data from the API
 */
const GetData = async (
	url = SETTINGS.get().api.commerce,
	now = new Date()
) => {
	Log.message( `GetData()   Started`);

	now = now.toJSON().slice( 0, 16 );

	try {
		const totalPages      = await GetTotalPages( url );
		const unformattedData = await GetBulkData( url, totalPages );
		const data            = await FormatData( unformattedData, TimestampCommerce, now );
		const results         = await InsertDB( data, SETTINGS.get().db, SETTINGS.get().table.commerce );
		Log.message( `GetData()   Finished - [ ${ results }]` );
	}
	catch( error ) {
		Log.error( `GetData() failed: ${ error }` );
	}

};

module.exports = GetData;
