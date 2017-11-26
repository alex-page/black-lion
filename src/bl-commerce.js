/***************************************************************************************************************************************************************
 *
 * init.js
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS }                       from './settings';
import { Log }                            from './helper';
import { InsertData }                     from './db';
import { GetTotalPages, GetBulkData }     from './get';
import { FormatAsync, TimestampCommerce } from './format-data';


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
}


// The startup message
Log.welcome( `Starting the feast` );


/**
 * GetCommerceData - Gets the commerce data from the API
 */
const GetCommerceData = () => {
	GetTotalPages( SETTINGS.get().api.commerce )
		.then( totalPages      => GetBulkData( SETTINGS.get().api.commerce, totalPages ) )
		.then( unformattedData => FormatAsync( unformattedData, TimestampCommerce ) )
		.then( data            => InsertData( data, SETTINGS.get().db, SETTINGS.get().table.commerce ) )
		.then( results         =>  Log.done( `The lions are full and go to sleep` ) )
		.catch( error => Log.error( `The lions went hungry: ${ error }` ) );
};

GetCommerceData();
