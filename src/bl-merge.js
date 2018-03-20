/***************************************************************************************************************************************************************
 *
 * bl-merge.js
 *
 * MergeData - Merge data that is on the same day
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
const SETTINGS      = require( './settings' );
const GetDB         = require( './rethinkdb' ).GetDB;
const FormatData    = require( './format-data' );
const MergeCommerce = require( './merge' );
const InsertBulkDB  = require( './rethinkdb' ).InsertBulkDB;


/**
 * MergeData - Merge data that is on the same day
 */
const MergeData = (
		database = SETTINGS.get().db,
		table = SETTINGS.get().table.commerce,
		now = new Date()
	) => {
	Log.message( `MergeData() Started` );

	return new Promise( ( resolve, reject ) => {
		GetDB( database, table )
			.then(  data         => FormatData( data, MergeCommerce, now ) )
			.then(  mergedData   => InsertBulkDB( mergedData, SETTINGS.get().api.limit, database, table, 'replace' ) )
			.then(  ()           => resolve( `MergeData() Finished` ) )
			.catch( error        => reject( `MergeData() Failed   - ${ error }` ) );
	});
};

module.exports = MergeData;
