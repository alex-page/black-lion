/***************************************************************************************************************************************************************
 *
 * bl-merge.js
 *
 * MergeData - Merge data that is on the same day
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const SETTINGS      = require( './settings' );
const Log           = require( './helper' ).Log;
const GetDB         = require( './rethinkdb' ).GetDB;
const Bundle        = require( './bundle' );
const MergeCommerce = require( './merge' );


/**
 * MergeData - Merge data that is on the same day
 */
const MergeData = () => {
	Log.message( `MergeData() Started` );

	const now = new Date( Date.now() );

	GetDB( SETTINGS.get().db, SETTINGS.get().table.commerce )
		.then(  data         => Bundle( data, MergeCommerce, now ) )
		.then(  mergedData   => console.log( mergedData ) )
		.then(  results      => Log.message( `MergeData() Finished - [ ${ results }]` ) )
		.catch( error        => Log.error( `MergeData() Failed   - ${ error }` ) );
};

module.exports = MergeData;
