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
import { Bundle }                     from './bundle';
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

	// Time to minute when the file was ran
	const now = ( new Date() ).toJSON().slice( 0, 16 );

	GetTotalPages( SETTINGS.get().api.commerce )
		.then(  totalPages      => GetBulkData( SETTINGS.get().api.commerce, totalPages ) )
		.then(  unformattedData => Bundle( unformattedData, TimestampCommerce, now ) )
		.then(  data            => InsertDB( data, SETTINGS.get().db, SETTINGS.get().table.commerce ) )
		.then(  results         => Log.done( `The lions are full and go to sleep` ) )
		.catch( error           => Log.error( `The lions went hungry: ${ error }` ) );
};

GetData();
