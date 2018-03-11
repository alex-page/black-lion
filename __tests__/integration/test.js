/***************************************************************************************************************************************************************
 *
 * INTEGRATION TEST
 *
 * Running integration tests
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const SETTINGS          = require( '../../src/settings' );
const originalData      = require( './fixture/original-data.json' );
const mergedData        = require( './fixture/merged-data.json' );
const Log               = require( '../../src/helper' ).Log;
const InsertBulkDB      = require( '../../src/rethinkdb' ).InsertBulkDB;
const GetDB             = require( '../../src/rethinkdb' ).GetDB;
const MergeData         = require( '../../src/bl-merge' );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEPENDENCIES
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Path         = require( 'path' );


let PASS = true;


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
	Log.verbose( `--- Verbose mode activated ---`);
}


const Test = () => {
	Log.info( 'Running tests' );

	const testDB    = SETTINGS.get().testdb;
	const testTable = SETTINGS.get().table.integration;
	const testDate  = new Date( '2018-01-08T00:00' );

	// Insert the fixtured test data
	InsertBulkDB( originalData, SETTINGS.get().api.limit, testDB, testTable, 'replace' )
		.then( () => {
			MergeData( testDB, testTable, testDate )
				.then( () => GetDB( testDB, testTable ) )
				.then( testResults => {
					console.log( testResults.length );
				})
		})
		.catch( error => Log.error( error ) )
};



/**
 * Get the checksum hash for the fixture of a test
 *
 * @param  {string} path     - The path to the test folder
 * @param  {object} settings - The settings object for this test
 *
 * @return {Promise object}  - The hash object of all files inside the fixture
 */
const Fixture = ( path, settings ) => {
	Log.verbose( 'Get the hash for the fixture of a test' );

	return new Promise( ( resolve, reject ) => {
		if( !settings.empty ) {
			Dirsum.digest( Path.normalize(`${ path }/_fixture/${ settings.compare }/`), 'sha256', ( error, hashes ) => {
				if( error ) {
					Log.error( error );

					PASS = false;

					reject( error );
				}
				else {
					resolve( hashes );
				}
			});
		}
		else {
			resolve({});
		}
	});
};


/**
 * Get the checksum hash for the result of the test
 *
 * @param  {string} path     - The path to the test folder
 * @param  {object} settings - The settings object for this test
 * @param  {object} fixture  - The hash results of the fixture to be passed on
 *
 * @return {Promise object}  - The hash object of all files inside the resulting files
 */
const Result = ( path, settings, fixture ) => {
	Log.verbose( 'Get the hash for the result of the test' );

	const location = Path.normalize(`${ path }/${ settings.compare }/`);

	return new Promise( ( resolve, reject ) => {
		if( !settings.empty ) {
			Dirsum.digest( location, 'sha256', ( error, hashes ) => {
				if( error ) {
					Log.error( error );

					PASS = false;

					reject();
				}
				else {

					resolve({ // passing it to compare later
						fixture,
						result: hashes,
					});

				}
			});
		}
		else {
			Fs.access( location, Fs.constants.R_OK, error => {

				if( !error || error.code !== 'ENOENT' ) {
					Log.error(`${ settings.name } failed becasue it produced files but really shoudn’t`);

					PASS = false;

					resolve({
						fixture: {
							hash: 'xx',
							files: {
								location: 'nope',
							},
						},
						result: {
							hash: 'xxx',
							files: {
								location: 'nope',
							},
						},
					});

				}
				else {

					resolve({
						fixture: {
							hash: 'xxx',
						},
						result: {
							hash: 'xxx',
						},
					});

				}
			});
		}
	});
};


/**
 * Compare the output of a test against its fixture
 *
 * @param  {object} settings - The settings object for this test
 * @param  {object} result   - The hash results of fixture and result
 *
 * @return {Promise object}  - The hash object of all files inside the fixture
 */
const Compare = ( settings, hashes ) => {
	Log.verbose( 'Comparing the output of a test against its fixture' );

	return new Promise( ( resolve, reject ) => {
		if( hashes.fixture.hash === hashes.result.hash ) {
			Log.done(`${ settings.name } passed`); // yay

			resolve( true );
		}
		else { // grr
			PASS = false;
			Log.error(`${ settings.name } failed`);

			// flatten hash object
			const fixture = hashes.fixture.files;
			const result = hashes.result.files;

			// iterate over fixture
			for( const file of Object.keys( fixture ) ) {
				const compare = result[ file ]; // get the hash from our result folder
				delete result[ file ];          // remove this one so we can keep track of the ones that were not inside the fixture folder

				if( compare === undefined ) {  // we couldn’t find this file inside the resulting folder
					Log.error(`Missing ${ file } file inside result folder`);
				}
				else {
					const fileName = file.split('/');

					if( fixture[ file ] !== compare && fileName[ fileName.length - 1 ] !== 'hash' ) { // we don’t want to compare folders
						Log.error(`Difference inside ${ settings.folder} ${ file } file`);
					}
				}
			}

			if( Object.keys( result ).length > 0 ) { // found files that have not been deleted yet
				let files = [];

				for( const file of Object.keys( result ) ) {
					files.push( file ); // make ’em readable
				}

				Log.error(`Some new files not accounted for: ${ files.join(', ') } inside the fixture folder`);
			}

			resolve( false );
		}
	});
};



// InsertBulkDB( data, SETTINGS.get().api.limit, SETTINGS.get().db, SETTINGS.get().table.commerce )
// 	.then(  ()    => console.log( 'jobs done' ))
// 	.catch( error => console.error( error ) );


Test();
