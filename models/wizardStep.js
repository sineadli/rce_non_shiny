// app/models/wizard.js
// load the things we need
var mongoose = require('mongoose');




// define the schema for our evaluation model
var wizardStepSchema = mongoose.Schema({
    name: String,
    step: Number,
    numTools: Number,
    intro: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('WizardStep', wizardStepSchema);