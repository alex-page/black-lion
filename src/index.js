/**
 * BlackLion - index.js
 *
 * Init - Start fetching and save data to API
 */


// Dependencies
const CFonts = require( 'cfonts' );


// Local dependencies
const GetData = require( './getdata' );
// const SaveData = require( './savedata' );


// Global settings
const api = 'api.guildwars2.com/v2/commerce/prices';
const limit = 200;


/**
 * Init - start black lion
 */
const Init = async () => {
	CFonts.say( 'Black|Lion', { align: 'center', colors: [ 'system', 'yellow' ] });
	CFonts.say( '- Look alive, you lot. Let\'s make some coin. -', { align: 'center', font: 'console' });

	const data = await GetData( api, limit );

	// await SaveData( data );
};


Init();
