// app/models/wizard.js
// load the things we need
var mongoose = require('mongoose');


var tool = mongoose.Schema({
    name: String,
    desc: String,
    note: String,
    type: String,
    wizardName: String,
    wizardPath: Number,
    step: Number,
    prereq: Boolean,
    path: String
});

// define the schema for our evaluation model
var wizardStepSchema = mongoose.Schema({
    name: String,
    step: Number,
    tools: [tool],
    intro: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('WizardStep', wizardStepSchema);