'use strict';

const Alexa = require('alexa-sdk');

const handlers = require('./src/handlers');

module.exports = {
    handler: handler
};

function handler(event, context, callback) {
    if (event.session.application.applicationId !== process.env.app_id) {
        callback('Invalid Application ID');
        return;
    }

    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = process.env.app_id;
    alexa.registerHandlers(handlers.handlers);
    alexa.execute();
}