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
import { InsertDB }                   from './rethinkdb';
import { GetTotalPages, GetBulkData } from './get';
import { Bundle }                     from './bundle';
import { TimestampCommerce }          from './timestamp';


/**
 * GetCommerceData - Gets the commerce data from the API
 */
export const GetData = () => {
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
