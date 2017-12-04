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
import { SETTINGS }                    from './settings';
import { Log }                         from './helper';
import { GetDB, InsertBatchDB }        from './rethinkdb';
import { Bundle }                      from './bundle';
import { MergeCommerce, MergeResults } from './merge';


/**
 * MergeData - Merge data that is on the same day
 */
export const MergeData = () => {
	Log.message( `MergeData() Started` );

	const now = new Date( Date.now() );

	GetDB( SETTINGS.get().db, SETTINGS.get().table.commerce )
		.then(  data         => Bundle( data, MergeCommerce, now ) )
		.then(  data         => InsertBatchDB( data, SETTINGS.get().db, SETTINGS.get().table.commerce, 'replace', 50 ) )
		.then(  batchResults => MergeResults( batchResults ) )
		.then(  results      => Log.message( `MergeData() ${ results }` ) )
		.catch( error        => Log.error( `MergeData() {Failed}: ${ error }` ) );
};
