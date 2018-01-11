/***************************************************************************************************************************************************************
 *
 * rethinkdb.js
 *
 * InsertDB      - Inserts data into the RethinkDB database
 * InsertBulkDB  - Inserts a large amount of data into the RethinkDB database
 * GetDB         - Gets data from the DB
 * HandleResults - Handles the rethinkDB response
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const  RethinkDB  = require( 'rethinkdb' );


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const Log       = require( './helper' ).Log;
const SETTINGS  = require( './settings' );


/**
 * InsertDB - Inserts data into the RethinkDB database
 * @param  {Object} data      - The data to be inserted into the db
 * @param  {Object} dbOptions - Information to connect to the db
 * @param  {String} table     - The table for the data to go into
 * @param  {String} conflict  - How items with the same primary key are inserted
 *
 * @returns {Promise}
 */
const InsertDB = ( data, dbOptions, table, conflict = 'update' ) => {
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
 * InsertBulkDB - Inserts a large amount of data into the RethinkDB database
 * @param  {Object} data      - The data to be inserted into the db
 * @param  {Object} dbOptions - Information to connect to the db
 * @param  {String} table     - The table for the data to go into
 * @param  {String} conflict  - How items with the same primary key are inserted
 *
 * @returns {Promise}
 */
const InsertBulkDB = async ( data, chunkSize, dbOptions, table, conflict = 'update' ) => {
	Log.verbose( `InsertBulkDB  @ DB: ${ dbOptions.db }, TABLE: ${ table }` );

	// Split the data into sizable chunks for rethinkDB insertion
	Log.verbose( `InsertBulkDB  - Split the data into chunks of ${ chunkSize } ` );
	const chunkedBatch = [];
	while ( Object.keys( data ).length ) {
		chunkedBatch.push( data.splice( 0, chunkSize ) );
	}

	Log.verbose( `InsertBulkDB  - Inserting the chunks into DB` );
	for( let itemBatch of chunkedBatch ) {
		await InsertDB( itemBatch, dbOptions, table, conflict );
	}
}


/**
 * GetDB - Gets data from the datbase
 * @param  {Object} dbOptions - Information to connect to the db
 * @param  {String} table     - The table for the data to go into
 *
 * @return {Promise}
 */
const GetDB = ( dbOptions, table ) => {
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
			message += `${ result } ${ results[ result ] }; `;
		});

		return message;
	}
}


module.exports = {
	GetDB: GetDB,
	InsertDB: InsertDB,
	InsertBulkDB: InsertBulkDB,
}
