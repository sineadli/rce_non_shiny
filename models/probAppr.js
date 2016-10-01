// app/models/probAppr.js   --01
// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
units = ["students", "schools", "teachers", "parents", "others"];
var options = ["Yes", "No"];

var probApprSchema = mongoose.Schema({
    userid: { type: mongoose.Schema.ObjectId, require: true },
    evalid: { type: mongoose.Schema.ObjectId, require: true },
    Prob_Appr_A: { type: String }, //Q.A.1
    Prob_Appr_B: {type: String },   //q8
    Prob_Apprr_B_other: { type: String },  //Q.A.2
  
    Prob_Appr_C: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});

// create the model for users and expose it to our app
module.exports = mongoose.model('ProbAppr', probApprSchema);