'use strict';

const constants = require('./constants/constants');
const airhorn = require('./airhorn/airhorn');
const slack = require('./slack/slack');
const utils = require('./utils/utils');

const mainIntent = 'NewDealIntent';

exports.handlers = {
    'AMAZON.CancelIntent': cancelIntent,
    'AMAZON.HelpIntent': helpIntent,
    'AMAZON.RepeatIntent': repeatIntent,
    'AMAZON.NoIntent': noIntent,
    'AMAZON.YesIntent': yesIntent,
    'AMAZON.StopIntent': stopIntent,
    'NewDealIntent': newDealIntent,
    'AmountIntent': amountIntent,
    'CorporationIntent': corporationIntent,
    'EngagementIntent': engagementIntent,
    'Unhandled': unhandledIntent
};

function cancelIntent() {
    this.emit(':tell', constants.cancelText);
}

function helpIntent() {
    this.emit(':ask', constants.helpText, constants.helpQuestion);
}

function repeatIntent() {
    this.emit(mainIntent);
}

function noIntent() {
    this.attributes.corporation = null;
    this.attributes.amount = null;
    this.attributes.engagement = null;
    this.emit(':ask', constants.startOverText);
}

function yesIntent() {
    const corporation = this.attributes.corporation;
    const amount = this.attributes.amount;
    const engagement = this.attributes.engagement;
    const token = this.event.session.user.accessToken;

    if (corporation && amount && engagement) {
        Promise.all([airhorn.blastHorn(), slack.sendSlackMessage(token, utils.generateSlackResponse(corporation, amount, engagement))])
            .then(() => {
                this.emit(':tell', constants.successText);
            });
    } else {
        this.emit(mainIntent);
    }
}

function stopIntent() {
    this.emit(':tell', constants.stopText);
}

function newDealIntent() {
    if (utils.isEmptyObject(this.attributes) && (!this.event.request.intent.slots || utils.isEmptyObject(this.event.request.intent.slots))) {
        this.emit(':ask', constants.whoSignedQuestion);
        return;
    }

    let corporation = this.attributes.corporation;
    let amount = this.attributes.amount;
    let engagement = this.attributes.engagement;

    if (this.event.request.intent.slots && this.event.request.intent.slots.corporation) {
        corporation = this.event.request.intent.slots.corporation.value;
        this.attributes.corporation = corporation;
    }

    if (this.event.request.intent.slots && this.event.request.intent.slots.amount) {
        amount = this.event.request.intent.slots.amount.value;
        this.attributes.amount = amount;
    }

    if (this.event.request.intent.slots && this.event.request.intent.slots.engagement) {
        engagement = this.event.request.intent.slots.engagement.value;
        this.attributes.engagement = engagement;
    }

    if (corporation && amount && engagement) {
        this.emit(':ask', utils.generateConfirmResponse(corporation, amount, engagement));
    } else if (corporation && amount) {
        this.emit(':ask', constants.engagementsTypeQuestion);
    } else if (corporation || (corporation && engagement)) {
        this.emit(':ask', constants.dealSizeQuestion);
    } else {
        this.emit(':ask', constants.whoSignedQuestion);
    }
}

function amountIntent() {
    this.attributes.amount = this.event.request.intent.slots.amount.value;
    this.emit(mainIntent);
}

function corporationIntent() {
    this.attributes.corporation = this.event.request.intent.slots.corporation.value;
    this.emit(mainIntent);
}

function engagementIntent() {
    this.attributes.engagement = this.event.request.intent.slots.engagement.value;
    this.emit(mainIntent);
}

function unhandledIntent() {
    this.emit(mainIntent);
}