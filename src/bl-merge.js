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
import { SETTINGS }        from './settings';
import { Log }             from './helper';
import { GetDB, InsertDB } from './rethinkdb';
import { Bundle }          from './bundle';
import { MergeCommerce }   from './merge';


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
}


/**
 * MergeData - Merge data that is on the same day
 */
const MergeData = () => {
	Log.welcome( `Starting the merge` );

	const now = new Date( Date.now() );

	GetDB( SETTINGS.get().db, SETTINGS.get().table.commerce )
		.then(  data   => Bundle( data, MergeCommerce, now ) )
		.then(  data   => InsertDB( data, SETTINGS.get().db, SETTINGS.get().table.commerce, 'replace' ) )
		.then(  ()     => Log.done( `Merge completed` ) )
		.catch( error  => Log.error( `Merge failed: ${ error }` ) );
};

MergeData();
