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
exports.GetData = undefined;

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * GotData -
 *
 * @type {string} url     - The URL to get data from
 * @type {object} options - See the options here https://github.com/sindresorhus/got#api
 */
var GetData = exports.GetData = function GetData(url, options) {
  _helper.Log.verbose('Got data from: ' + url);

  return new Promise(function (resolve, reject) {
    (0, _got2.default)(url, options).then(function (data) {
      resolve(data.body);
    }).catch(function (error) {
      reject(error);
    });
  });
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------