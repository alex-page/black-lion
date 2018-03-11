/***************************************************************************************************************************************************************
 *
 * init.js
 *
 * Initialise the Black Lion 🦁
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const Schedule = require( 'node-schedule' );


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const Log       = require( './helper' ).Log;
const GetData   = require( './bl-commerce' );
const MergeData = require( './bl-merge' );


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
};


// Log the welcome message then run the scheduled jobs
Promise.resolve( Log.welcome( 'Starting up black lion' ) )
	.then( () => {

		// For testing can be removed later for cron jobs below
		MergeData()
			.then(  response => Log.message( response ) )
			.catch( error    => Log.error( error ) );
		// GetData();

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



