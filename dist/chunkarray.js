/***************************************************************************************************************************************************************
 *
 * ChunkArray
 *
 * ChuckArray - Split an array into chunks of arrays based on the size.
 *
 **************************************************************************************************************************************************************/

'use strict';

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChunkArray = undefined;

var _helper = require('./helper');

/**
 * Split an array into chunks of arrays based on the size.
 *
 * @param  {Array}   arrayToChunk - Array to split
 * @param  {Integer} chunkSize    - Size of every group
 *
 * @return {Array}   results      - The original array divided
 */
var ChunkArray = exports.ChunkArray = function ChunkArray(arrayToChunk, chunkSize) {
  _helper.Log.verbose('ChunkArray - Herding ' + arrayToChunk.length + ' antelopes into managable ' + chunkSize + ' size pieces.');

  var results = [];

  while (arrayToChunk.length) {
    results.push(arrayToChunk.splice(0, chunkSize));
  }

  return results;
};