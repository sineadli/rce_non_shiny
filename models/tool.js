
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

// app/models/tool.js
// load the things we need
var mongoose = require('mongoose');

var Field = mongoose.Schema({
    Name: String,
	InputType: String,
	Example: String,
    HelpText: String,
    MissingText: String,
	HasDependency: Boolean,
	DependentOn: [String],
	DependentValue: String,
	Step: String

});

// define the schema for our evaluation model
var toolSchema = mongoose.Schema({
    name: String,
	screenName: String,
    desc: String,
    note: String,
    type: String,
    coachStep: Number,
    order: Number,
    evalPath: String,
    prereq: Boolean,
    path: String,
	fields: [Field]
});

toolSchema.methods.setPeekingNote = function (sess) {
   // console.log("session step = " + sess.step + " and tool step = " + this.coachStep);
	if (this.coachStep > 3) {
		sess.defaults.peekingnote = this.path == "" ? "You need to complete &ldquo;Determine Your Approach,&rdquo; before you can use this tool." : "Based on your answers in &ldquo;Determine Your Approach,&rdquo; you do not need to use this tool to complete your evaluation.";
	} else {
		sess.defaults.peekingnote = "You need to complete &ldquo;The Basics&rdquo; before you can use this tool.";
	}

    return;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Tool', toolSchema);