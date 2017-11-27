/***************************************************************************************************************************************************************
 *
 * db.js
 *
 * InsertDB      - Inserts data into the RethinkDB database
 * GetDB         - Merges data that has the same day timestamp
 * HandleResults - Handles the rethinkDB response
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import RethinkDB from 'rethinkdb';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log }   from './helper';


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
 * GetDB - Merges data that has the same day timestamp
 * @param  {Object} dbOptions - Information to connect to the db
 * @param  {String} table     - The table for the data to go into
 * @param  {Number} time      - Current epoch time
 *
 * @return {Promise}
 */
export const GetDB = ( dbOptions, table ) => {
	Log.verbose( `GetDB         @ DB: ${ dbOptions.db }, TABLE: ${ table }` );

	return new Promise( ( resolve, reject ) => {

		RethinkDB
		.connect( dbOptions )
		.then( connection => {

			RethinkDB
				.table( table )
				.run( connection )
				.then( rethinkData => {
					connection.close();
					resolve( rethinkData.toArray() );
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
 * @returns {Promise}hy 90
 */
const HandleResults = ( results ) => {
	Log.verbose( `Handling results` );

	return new Promise( ( resolve, reject ) => {

		// Check that there were no errors inserting the data
		if ( results.errors !== 0 ) {
			reject( `There was ${ results.errors } errors:\n\n${ results.first_error }` )
		}

		// Close the connection and send back the results
		else {
			Object.keys( results ).map( result => {
				Log.verbose( `${ result }: ${ results[result] }`)
			});
			resolve();
		}
	})
}
