// app/models/planQuestion.js
// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
achievement = ["Student academic achievement", "Student non-academic achievement", "Teacher performance", "other"];
direction = ["Increase", "Decrease"]
//techs = ["a. Yes, all of them are using it", "b. Yes, some of them are using it but others are not", "c. No, none of them are using it."];
//rds = ["a. Yes, we used a lottery (random number generator, fair coin, etc.)", "", "", ""]
//techs = [1, 2, 3];
var planQuestionSchema = mongoose.Schema({
    userid: { type: mongoose.Schema.ObjectId, require: true },
    evalid: { type: mongoose.Schema.ObjectId, require: true },
    Plan_Question_A: { type: String, required: true },
    Plan_Question_B_1: { type: String, required: true, enum: achievement },
    Plan_Question_B_Other: { type: String, required: false },
    Plan_Question_B_2: { type: String, required: true },  
    Plan_Question_B_3: { type: String, required: true, enum: direction },
    Plan_Question_C: { type: String, required: true },
    Plan_Question_D: String,
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});

// create the model for users and expose it to our app
module.exports = mongoose.model('PlanQuestion', planQuestionSchema);