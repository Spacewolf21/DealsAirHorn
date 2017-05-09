'use strict';

const currencyFormatter = require('currency-formatter');

module.exports = {
    isEmptyObject: isEmptyObject,
    generateSlackResponse: generateSlackResponse,
    generateConfirmResponse: generateConfirmResponse
};

function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

function generateSlackResponse(corporation, amount, engagement) {
    const formattedAmount = currencyFormatter.format(amount, { code: 'USD' });
    return `A ${engagement} deal with ${corporation} was just signed for ${formattedAmount}!`;
}

function generateConfirmResponse(corporation, amount, engagement) {
    const formattedAmount = currencyFormatter.format(amount, { code: 'USD' });
    return `Well done. Let me confirm I have everything. You signed a ${engagement} deal with ${corporation} for <say-as interpret-as="cardinal">${formattedAmount}</say-as>?`;
}