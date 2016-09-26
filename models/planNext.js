// app/models/planNext.js
// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
spendresults = ["costs", "saves"];
unitmeasured = ["student", "teacher", "school"];
//techs = ["a. Yes, all of them are using it", "b. Yes, some of them are using it but others are not", "c. No, none of them are using it."];
//rds = ["a. Yes, we used a lottery (random number generator, fair coin, etc.)", "", "", ""]
//techs = [1, 2, 3];
var planNextSchema = mongoose.Schema({
    userid: { type: mongoose.Schema.ObjectId, require: true },
    evalid: { type: mongoose.Schema.ObjectId, require: true },
    Plan_Next_A_1: { type: String, require: true, enum: spendresults }, //id=dropdn-cost-saves
    Plan_Next_A_2: { type: Number, required: true },
    Plan_Next_A_3: { type: String, required: true, enum: unitmeasured },
    Plan_Next_A_4: { type: String, required: false },
    Plan_Next_B: { type: Number, required: true },
    Plan_Next_C_1: { type: Number, required: true, max:100 },
    Plan_Next_C_2: { type: Number, required: true, max:100 },
    Plan_Next_D_1: String,
    Plan_Next_D_2: String,
    Plan_Next_D_3: String,
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});

// create the model for users and expose it to our app
module.exports = mongoose.model('PlanNext', planNextSchema);