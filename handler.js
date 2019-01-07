'use strict'

module.exports.handler = async () => ({
    version: '1.0',
    response: {
        outputSpeech: {
            type: 'PlainText',
            text: `Was today better than yesterday?`
        },
        shouldEndSession: false,
    }
})