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
const Bundle            = require( './bundle' );
const TimestampCommerce = require( './timestamp' );


/**
 * GetCommerceData - Gets the commerce data from the API
 */
const GetData = () => {
	Log.message( `GetData()   Started`);

	// Time to minute when the file was ran
	const now = ( new Date() ).toJSON().slice( 0, 16 );

	GetTotalPages( SETTINGS.get().api.commerce )
		.then(  totalPages      => GetBulkData( SETTINGS.get().api.commerce, totalPages ) )
		.then(  unformattedData => Bundle( unformattedData, TimestampCommerce, now ) )
		.then(  data            => InsertDB( data, SETTINGS.get().db, SETTINGS.get().table.commerce ) )
		.then(  results         => Log.message( `GetData()   ${ results } ` ) )
		.catch( error           => Log.error( error ) );
};

module.exports = GetData;
