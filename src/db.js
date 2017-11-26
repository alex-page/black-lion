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
 * UpdateData - updates data into the RethinkDB database
 * @param  {Object} data      - The data to be inserted into the db
 * @param  {Object} dbOptions - Information to connect to the db
 * @param  {String} table     - The table for the data to go into
 *
 * @returns {Promise}
 */
export const UpdateData = ( data, dbOptions, table ) => {
	Log.verbose( `UpdateData - Saving the leftovers for later` );

	return new Promise( ( resolve, reject ) => {

		RethinkDB
			.connect( dbOptions )
			.then( connection => {

				RethinkDB
					.table( table )
					.update( data, { conflict: 'replace' } )
					.run( connection )
					.then( results => {

						let messages = '';

						// For each result check if there is data and log the correct message
						Object.keys( results ).map( result => {
							if ( results[ result ] !== 0 ) {
								if( result === 'error' ){
									reject( `There was ${ result.error } issues adding the items:\n\n${ result.first_error }` )
								}
								else {
									messages += `${ results[ result ] } items ${ result }\n`;
								}
							}
						});

						console.log( messages );

						resolve( messages );

					})
					.catch( error => reject( error ) )

			})
			.catch( error => reject( error ) )
	})
}
