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
import { SETTINGS }              from './settings';
import { Log }                   from './helper';
import { GetDB }                 from './db';
import { ChangeAsync, MergeDay } from './change-data';


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
}


/**
 * MergeData - Merge data that is on the same day
 */
const MergeDataInit = () => {
	Log.welcome( `Starting the merge` );

	GetDB( SETTINGS.get().db, SETTINGS.get().table.commerce )
		.then(  data   => ChangeAsync( data, MergeDay ) )
		// .then(  data   => console.log( data ) )
		.then(  ()     => Log.done( `Merge completed` ) )
		.catch( error  => Log.error( `Merge failed: ${ error }` ) );
};

MergeDataInit();
