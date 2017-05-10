'use strict';

const constants = require('../constants/constants');
const webClient = require('@slack/client').WebClient;

module.exports = {
    sendSlackMessage: sendSlackMessage
};

function sendSlackMessage(token, msg) {
    const web = new webClient(token);
    return new Promise((resolve, reject) => {
        web.chat.postMessage(process.env.slack_channel, msg, (err, res) => {
            resolve({}); // dont care if it errors
        });
    });
}
