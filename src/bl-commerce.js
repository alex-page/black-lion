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
import { SETTINGS }                   from './settings';
import { Log }                        from './helper';
import { InsertDB }                   from './db';
import { GetTotalPages, GetBulkData } from './get';
import { AsyncMapFormat }             from './async';
import { TimestampCommerce }          from './timestamp';


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
}


/**
 * GetCommerceData - Gets the commerce data from the API
 */
const GetData = () => {
	Log.welcome( `Getting data from: ${ SETTINGS.get().api.commerce } ` );

	GetTotalPages( SETTINGS.get().api.commerce )
		.then(  totalPages      => GetBulkData( SETTINGS.get().api.commerce, totalPages ) )
		.then(  unformattedData => AsyncMapFormat( unformattedData, TimestampCommerce ) )
		.then(  data            => InsertDB( data, SETTINGS.get().db, SETTINGS.get().table.commerce ) )
		.then(  results         => Log.done( `The lions are full and go to sleep` ) )
		.catch( error           => Log.error( `The lions went hungry: ${ error }` ) );
};

GetData();
