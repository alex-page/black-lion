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
			commerce: 'https://api.guildwars2.com/v2/commerce/listings/',
			items: 'https://api.guildwars2.com/v2/items/',
		},
		got: {
			json: true
		}
	},


	/**
	 * Getting our settings
	 *
	 * @return {object} - The settings object
	 */
	get: () => {
		return SETTINGS.defaults;
	},


	/**
	 * Merge with default settings
	 *
	 * @param  {object} newSettings - The new settings object to be merged
	 *
	 * @return {object}               - Our new settings
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
