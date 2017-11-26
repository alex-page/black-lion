/***************************************************************************************************************************************************************
 *
 * init.js
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS }                   from './settings';
import { Log }                        from './helper';
import { FormatAsync, Timestamp }     from './formatData';
import { SaveData }                   from './db';
import { GetTotalPages, GetBulkData } from './get';


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
}


// The startup message
Log.welcome( `Starting the feast` );


// The main promise chain
GetTotalPages( SETTINGS.get().api.commerce )
	.then( totalPages => GetBulkData( SETTINGS.get().api.commerce, totalPages ) )
	.then( data => FormatAsync( data, Timestamp ) )
	// then send data to db with timestamp
	// .then( data => UpdateData( data, SETTINGS.get().db, SETTINGS.get().table.commerce ) )
	.then( data => Log.done( `The lions are full and go to sleep` ) )
	.catch( error => Log.error( `The lions went hungry: ${ error }` ) );


