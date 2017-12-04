/***************************************************************************************************************************************************************
 *
 * rethinkdb.js
 *
 * InsertDB      - Inserts data into the RethinkDB database
 * GetDB         - Gets data from the DB
 * HandleResults - Handles the rethinkDB response
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import RethinkDB      from 'rethinkdb';
import Queue          from 'async/queue';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log }        from './helper';
import { SETTINGS }   from './settings';


/**
 * InsertBatchDB - Inserts data into the RethinkDB database
 * @param  {Object} data      - The data to be inserted into the db
 * @param  {Object} dbOptions - Information to connect to the db
 * @param  {String} table     - The table for the data to go into
 * @param  {String} conflict  - The way the data is inserted into the database [https://rethinkdb.com/api/javascript/insert/]
 * @param  {Number} queueSize - The total number of insertions at once
 * @param  {String} batchSize - Number of items to be inserted at once  [https://rethinkdb.com/docs/troubleshooting/]
 *
 * @returns {Promise}
 */
export const InsertBatchDB = (
	data,
	dbOptions,
	table,
	conflict = 'update',
	queueSize = 1,
	batchSize = SETTINGS.get().api.limit,
) => {
	Log.verbose( `InsertBatchDB - DB: ${ dbOptions.db }, TABLE: ${ table }` );

	return new Promise( ( resolve, reject ) => {

		const allResults      = [];
		const totalItems      = Object.keys( data ).length;
		let   iteration       = 0;


		// Limit the number of inserts based off the queueSize
		const q = Queue( ( task, Callback ) => {
			Log.verbose( `Inserting ${ task.iteration } / ${ totalItems }` )

			RethinkDB
				.connect( dbOptions )
				.then( connection => {

					RethinkDB
						.table( table )
						.insert( task.data, { conflict: conflict } )
						.run( connection )
						.then( results => {
							connection.close()
								.then( () => Callback( null, results ) )
								.catch( error => Callback( error ) );
						})
						.catch( error => Callback( error ) );
				});

		}, queueSize );


		// Split the data for insertion into chunks of batchSize
		while ( iteration <= totalItems ) {

			const dataChunk = Object.values( data ).slice( iteration, iteration + batchSize );
			iteration += batchSize;

			// Add the dataChunk to the queue
			q.push({
				data: dataChunk,
				iteration: iteration
			},( error, results ) => {

				// If there was an error reject
				if ( error ) {
					reject( error );
				}

				// If it was inserted, add the results to the array
				else {
					allResults.push( results );
				}
			});
		};


		// When the Queue is finished
		q.drain = () => resolve( allResults );
	});
}


/**
 * InsertDB - Inserts data into the RethinkDB database
 * @param  {Object} data      - The data to be inserted into the db
 * @param  {Object} dbOptions - Information to connect to the db
 * @param  {String} table     - The table for the data to go into
 *
 * @returns {Promise}
 */
export const InsertDB = ( data, dbOptions, table, conflict = 'update' ) => {
	Log.verbose( `InsertDB      @ DB: ${ dbOptions.db }, TABLE: ${ table }` );

	return new Promise( ( resolve, reject ) => {

		RethinkDB
			.connect( dbOptions )
			.then( connection => {

				RethinkDB
					.table( table )
					.insert( data, { conflict: conflict } )
					.run( connection )
					.then( HandleResults )
					.then( () => connection.close() )
					.catch( error => reject( error ) )

			})
			.catch( error => reject( error ) )
	})
}


/**
 * GetDB - Gets data from the datbase
 * @param  {Object} dbOptions - Information to connect to the db
 * @param  {String} table     - The table for the data to go into
 *
 * @return {Promise}
 */
export const GetDB = ( dbOptions, table ) => {
	Log.verbose( `GetDB         - DB: ${ dbOptions.db }, TABLE: ${ table }` );

	return new Promise( ( resolve, reject ) => {

		RethinkDB
		.connect( dbOptions )
		.then( connection => {

			RethinkDB
				.table( table )
				.run( connection )
				.then( rethinkData => rethinkData.toArray() )
				.then( data => {
					connection.close();
					resolve( data );
				})
				.catch( error => reject( error ) )

		})
		.catch( error => reject( error ) )
	})
}


/**
 * HandleResults - Handles the rethinkDB response
 *
 * @param   {Object} results             - Object returned by rethinkDB
 * @param   {Number} results.error       - Number of errors found
 * @param   {String} results.first_error - The first error found
 *
 * @returns {Promise}
 */
const HandleResults = ( results ) => {
	Log.verbose( `Handling results` );

	let message = "";

	// Check that there were no errors inserting the data
	if ( results.errors !== 0 ) {
		reject( `There was ${ results.errors } errors:\n\n${ results.first_error }` )
	}

	// Close the connection and send back the results
	else {
		Object.keys( results ).map( result => {
			message += result;
		});

		return result;
	}
}
