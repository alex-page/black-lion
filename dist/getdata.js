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
exports.GetTotalPages = undefined;

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _helper = require('./helper');

var _settings = require('./settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
var GetTotalPages = exports.GetTotalPages = function GetTotalPages(url) {
	_helper.Log.verbose('GetTotalPages - Counting the number of prey.');
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
 * GetBulkData -
 *
 * @type {string} url     - The URL to get data from
 * @type {object} options - See the options here https://github.com/sindresorhus/got#api
 */
// export const GetBulkData = (
// 		url,
// 		pageNumber = 0,
// 		pageSize = SETTINGS.get().api.maxLimit,
// 	) => {
// 	Log.verbose( `GetBulkData - Searching for groups of prey with maxSize of ${ pageSize }` );

// 	return new Promise( ( resolve, reject ) => {


// 	})
// }