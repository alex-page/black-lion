/***************************************************************************************************************************************************************
 *
 * timestamp.js
 *
 * TimestampCommerce - Timestamps the data
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { now } from './bl-commerce';


/**
 * TimestampCommerce - Timestamps the data
 *
 * @param {Object} data             - The data to be formatted
 * @param {String} data.id          - The item ID
 * @param {Object} data.buys        - The items buy data
 * @param {Object} data.sells       - The items sell data
 * @param {Object} data.whitelisted - Status of the item
 *
 * @returns {Object}                - The newly formatted object
 */
export const TimestampCommerce = ( data ) => {
	// No log here as it gets looped a lot!

	return {
		id: data.id,
		'whitelisted': data.whitelisted,
		rawdata: {
			[ now ]: {
				'buysQuantity' : data.buys.quantity,
				'buysPrice'    : data.buys.unit_price,
				'sellsQuantity': data.sells.quantity,
				'sellsPrice'   : data.sells.unit_price,
			}
		}
	}
}
