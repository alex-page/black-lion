/***************************************************************************************************************************************************************
 *
 * timestamp.js
 *
 * TimestampCommerce - Timestamps the data
 *
 **************************************************************************************************************************************************************/


'use strict';


/**
 * TimestampCommerce - Timestamps the data
 *
 * @param {Object} data             - The data to be formatted
 * @param {String} data.id          - The item ID
 * @param {Object} data.buys        - The items buy data
 * @param {Object} data.sells       - The items sell data
 * @param {Object} data.whitelisted - Status of the item
 * @param {Object} now              - The current time
 *
 * @returns {Object}                - The newly formatted object
 */
const TimestampCommerce = ( data, now ) => {

	return new Promise( ( resolve, reject ) => {

		if( !data || typeof data !== 'object' ) {
			reject( 'Invalid object pushed into TimestampCommerce' );
		}

		resolve({
			id: data.id,
			whitelisted: data.whitelisted,
			data: {},
			rawdata: {
				[ now ]: {
					buysQuantity  : data.buys.quantity,
					buysPrice     : data.buys.unit_price,
					sellsQuantity : data.sells.quantity,
					sellsPrice    : data.sells.unit_price,
				}
			}
		});

	})
}


module.exports = TimestampCommerce;
