/***************************************************************************************************************************************************************
 *
 * timestamp.js
 *
 * TimestampCommerce - Timestamps the data
 *
 **************************************************************************************************************************************************************/


'use strict';


// Time to minute when the file was ran
const now = ( new Date() ).toJSON().slice( 0, 16 );


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
