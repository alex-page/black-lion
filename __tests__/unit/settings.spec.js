/***************************************************************************************************************************************************************
 *
 * settings.js unit tests
 *
 * @file - src/settings.js
 *
 * Tested methods:
 * SETTINGS.get()
 * SETTINGS.set()
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS } from '../../src/settings';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SETTINGS.GET()
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test( 'Settings.get() - The default settings are correct', () => {
	const defaults = {
		api: {
			commerce: 'https://api.guildwars2.com/v2/commerce/prices',
			items: 'https://api.guildwars2.com/v2/items',
			limit: 5,
		},
		db: {
			db: 'blacklion',
			host: 'localhost',
			port: '28015',
		},
		table: {
			commerce: 'commerce'
		}
	};

	expect( SETTINGS.get() ).toMatchObject( defaults );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SETTINGS.SET()
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test( 'Settings.set() - Not setting anything will merge default correctly', () => {
	const changes = undefined;
	const settings = {
		api: {
			commerce: 'https://api.guildwars2.com/v2/commerce/prices',
			items: 'https://api.guildwars2.com/v2/items',
			limit: 5,
		},
		db: {
			db: 'blacklion',
			host: 'localhost',
			port: '28015',
		},
		table: {
			commerce: 'commerce'
		}
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test( 'Settings.set() - An empty object as settings folder will merge default correctly', () => {
	const changes = {};
	const settings = {};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test( 'Settings.set() - Set settings correctly', () => {

	const newSettings = SETTINGS.get();

	newSettings.api.test = 'test';
	newSettings.api.limit = 200;
	newSettings.table.commerce = 'test';

	const settings = {
		api: {
			commerce: 'https://api.guildwars2.com/v2/commerce/prices',
			items: 'https://api.guildwars2.com/v2/items',
			limit: 200,
			test: 'test'
		},
		db: {
			db: 'blacklion',
			host: 'localhost',
			port: '28015',
		},
		table: {
			commerce: 'test'
		}
	};

	expect( SETTINGS.set( newSettings ) ).toMatchObject( settings );
});
