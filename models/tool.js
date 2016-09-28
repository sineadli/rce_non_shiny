// app/models/tool.js
// load the things we need
var mongoose = require('mongoose');



// define the schema for our evaluation model
var toolSchema = mongoose.Schema({
    name: String,
    desc: String,
    note: String,
    type: String,
    wizardName: String,
    wizardPath: Number,
    step: Number,
    prereq: Boolean
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Tool', toolSchema);