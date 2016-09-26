// app/models/evaluation.js
// load the things we need
var mongoose = require('mongoose');


//define enums:
units = ["students", "schools", "teachers", "parents", "others"];
achievement = ["Student academic achievement", "Student non-academic achievement", "Teacher performance", "other"];
direction = ["Increase", "Decrease"];
spendresults = ["costs", "saves"];
unitmeasured = ["student", "teacher", "school"];

// define the schema for our evaluation model
var evaluationSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.ObjectId, required: true },
    title: { type: String, required: true },
    last_step: Number,
    next_path: Number,
    is_current: Boolean,
    created_at: { type: Date, default: Date.now },
    updated_at: Date,
   


});

// create the model for users and expose it to our app
module.exports = mongoose.model('Evaluation', evaluationSchema);