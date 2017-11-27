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
import { GetDB, InsertDB } from './db';
import { AsyncMapFormat }  from './async';
import { MergeCommerce }   from './merge';


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
}


// Time to the day when the file was ran
export const today = ( new Date() ).toJSON().slice( 0, 10 );


/**
 * MergeData - Merge data that is on the same day
 */
const MergeData = () => {
	Log.welcome( `Starting the merge` );

	GetDB( SETTINGS.get().db, SETTINGS.get().table.commerce )
		.then(  data   => AsyncMapFormat( data, MergeCommerce ) )
		.then(  data   => InsertDB( data, SETTINGS.get().db, SETTINGS.get().table.commerce ), 'replace' )
		.then(  ()     => Log.done( `Merge completed` ) )
		.catch( error  => Log.error( `Merge failed: ${ error }` ) );
};

MergeData();
