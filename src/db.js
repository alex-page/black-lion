/***************************************************************************************************************************************************************
 *
 * db.js
 *
 * UpdateData - inserts data into the RethinkDB database
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
import { Log }      from './helper';


/**
 * InsertData - Inserts data into the RethinkDB database
 * @param  {Object} data      - The data to be inserted into the db
 * @param  {Object} dbOptions - Information to connect to the db
 * @param  {String} table     - The table for the data to go into
 *
 * @returns {Promise}
 */
export const InsertData = ( data, dbOptions, table ) => {
	Log.verbose( `InsertData    @ DB: ${ dbOptions.db }, TABLE: ${ table }` );

	return new Promise( ( resolve, reject ) => {

		RethinkDB
			.connect( dbOptions )
			.then( connection => {

				RethinkDB
					.table( table )
					.insert( data, { conflict: 'update' } )
					.run( connection )
					.then( results => {
						// Check that there were no errors inserting the data
						if ( results.errors !== 0 ) {
							reject( `There was ${ results.errors } issues adding the items:\n\n${ results.first_error }` )
						}
						// Close the connection and send back the results
						else {
							Object.keys( results ).map( result => {
								Log.verbose( `${ result }: ${ results[result] }`)
							});
							connection.close();
							resolve( results );
						}
					})
					.catch( error => reject( error ) )

			})
			.catch( error => reject( error ) )
	})
}
