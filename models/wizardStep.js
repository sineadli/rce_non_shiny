
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

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