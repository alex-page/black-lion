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

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SETTINGS = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Keeping our settings across multiple imports
 *
 * @type {Object}
 */
var SETTINGS = exports.SETTINGS = {
	/**
  * The default settings
  *
  * @type {Object}
  */
	defaults: {
		api: {
			commerce: 'https://api.guildwars2.com/v2/commerce/prices',
			items: 'https://api.guildwars2.com/v2/items',
			limit: 200
		},
		got: {
			default: {
				json: true
			},
			totalPages: {}
		}
	},

	/**
  * Getting our settings
  *
  * @return {object} - The settings object
  */
	get: function get() {
		return SETTINGS.defaults;
	},

	/**
  * Merge with default settings
  *
  * @param  {object} newSettings - The new settings object to be merged
  *
  * @return {object}               - Our new settings
  */
	set: function set(newSettings) {
		_helper.Log.verbose('Setting new settings');

		if (newSettings) {

			SETTINGS.default = newSettings;
			return SETTINGS.default;
		} else {
			return SETTINGS.get();
		}
	}
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------