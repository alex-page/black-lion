/***************************************************************************************************************************************************************
 *
 * Settings used throughout the application
 *
 * SETTINGS - Keeping our settings across multiple imports
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path    from 'path';
import Fs      from 'fs';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log } from './helper';


/**
 * Keeping our settings across multiple imports
 *
 * @type {Object}
 */
export const SETTINGS = {
	/**
	 * The default settings
	 *
	 * @type {Object}
	 */
	defaults: {
		api: {
			commerce: 'https://api.guildwars2.com/v2/commerce/prices',
			items: 'https://api.guildwars2.com/v2/items',
			limit: 200,
		},
		db: {
			db: 'blacklion',
			host: 'localhost',
			port: '28015',
		},
		table: {
			commerce: 'commerce'
		}
	},


	/**
	 * Getting our settings
	 *
	 * @returns {object} - The settings object
	 */
	get: () => {
		return SETTINGS.defaults;
	},


	/**
	 * Merge with default settings
	 *
	 * @param   {object} newSettings - The new settings object to be merged
	 *
	 * @returns {object}             - Our new settings
	 */
	set: ( newSettings ) => {
		Log.verbose(`Setting new settings`);

		if( newSettings ) {

			SETTINGS.default = newSettings;
			return SETTINGS.default;
		}
		else {
			return SETTINGS.get();
		}
	},
};
