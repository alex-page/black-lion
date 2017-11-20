/***************************************************************************************************************************************************************
 *
 * Init
 *
 * Initialise -
 *
 **************************************************************************************************************************************************************/

'use strict';

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------

var _settings = require('./settings');

var _helper = require('./helper');

var _get = require('./get');

// Check if the user is in verbose mode
if (process.argv.includes('-v') || process.argv.includes('--verbose')) {
  _helper.Log.verboseMode = true;
}

_helper.Log.welcome('Black Lion: Starting the feast');

(0, _get.GetTotalPages)(_settings.SETTINGS.get().api.commerce).then(function (totalPages) {
  return (0, _get.GetBulkData)(_settings.SETTINGS.get().api.items, totalPages);
}).then(function (data) {
  return _helper.Log.done('The lions are full and go to sleep');
}).catch(function (error) {
  return _helper.Log.error('The lions went hungry: ' + error);
});