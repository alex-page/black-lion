/***************************************************************************************************************************************************************
 *
 * init.js
 *
 * GetCommerceData - Gets the commerce data from the API
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Schedule         from 'node-schedule';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log }          from './helper';
import { GetData }      from './bl-commerce';
import { MergeData }    from './bl-merge';


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
};

// Log the welcome message then run the scheduled jobs
Promise.resolve( Log.welcome( 'Starting up black lion' ) )
	.then( () => {

		// GetData();
		MergeData();

		// Every two minutes get the commerce data
	 	// Schedule.scheduleJob('*/2 * * * *', () => {
		// 	GetData();
		// });

		// // Every two days merge the data
		// Schedule.scheduleJob('0 0 */2 * *', () => {
		// 	MergeData();
		// });
	})
	.catch( error => Log.error( error ) );



