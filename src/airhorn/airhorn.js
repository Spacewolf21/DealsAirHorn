'use strict';

const AWS = require('aws-sdk');
AWS.config.region = process.env.AWS_REGION;  
const sns = new AWS.SNS();

module.exports = {
    blastHorn: blastHorn
};

function blastHorn() {
    return new Promise((resolve, reject) => {
        sns.publish({
            Message: 'New Deal!',
            TopicArn: process.env.sns_topic
        }, (err, data) => {
            // don't care if it errors
            resolve({});
        });
    });
}