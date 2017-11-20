/***************************************************************************************************************************************************************
 *
 * gotdata.js
 *
 * GotData -
 *
 **************************************************************************************************************************************************************/

'use strict';

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GetBulkData = exports.GetTotalPages = exports.GetData = undefined;

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _helper = require('./helper');

var _settings = require('./settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * GetData - Gets data body from a url
 *
 * @type   {String} url        - The URL to get data from
 * @type   {Object} option     - The options from the https://github.com/sindresorhus/got
 *
 * @return {Promise}           - The data body
 */


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
var GetData = exports.GetData = function GetData(url, option) {
	_helper.Log.verbose('GetData       - Serving meal #' + (option.query.page + 1) + ' from: ' + url + '.');
	return new Promise(function (resolve, reject) {
		(0, _got2.default)(url, option).then(function (data) {
			return resolve(data.body);
		}).catch(function (error) {
			return reject(error);
		});
	});
};

/**
 * GetTotalPages - Does a small request to get the total data items ( x-result-total )
 *
 * @type   {String} url - The URL to get data from
 *
 * @return {Promise}    - The total number of data items
 */
var GetTotalPages = exports.GetTotalPages = function GetTotalPages(url) {
	_helper.Log.verbose('GetTotalPages - Counting the number of meals.');
	return new Promise(function (resolve, reject) {
		(0, _got2.default)(url, {
			json: true,
			query: {
				page: 0,
				page_size: 1
			}
		}).then(function (data) {
			return resolve(data.headers['x-result-total']);
		}).catch(function (error) {
			return reject(error);
		});
	});
};

/**
 * GetBulkData - Gets a lot of data from a url
 *
 * @type   {String} url        - The URL to get data from
 * @type   {Number} totalItems - The total number of items to get data for
 * @type   {Number} apiLimit   - The number of items that can be requested
 *
 * @return {Promise}           - The data from all of the requests
 */
var GetBulkData = exports.GetBulkData = function GetBulkData(url, totalItems) {
	var apiLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _settings.SETTINGS.get().api.limit;

	_helper.Log.verbose('GetBulkData   - Searching ' + totalItems + ' meals for tasty treats');

	return new Promise(function (resolve, reject) {

		// Get total requests and remove decimal
		var totalRequests = totalItems / apiLimit | 0;
		var dataBundle = [];
		var page = 0;

		// Iterate through all the pages
		while (page <= totalRequests) {

			dataBundle.push(GetData(url, {
				json: true,
				query: {
					page: page,
					page_size: apiLimit
				}
			}));

			// Increase page number
			page++;
		}

		Promise.all(dataBundle).then(function (data) {
			return resolve([].concat.apply([], data));
		}).catch(function (error) {
			return reject(error);
		});
	});
};