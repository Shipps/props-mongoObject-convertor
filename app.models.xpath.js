'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// define the schema for xpath model
var xpathSchema   = new Schema({
    app_type: String,
    xpath: {
        key: String,
        value: String
    },
    last_modified: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('xpath', xpathSchema);