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
var toollist = new mongoose.Schema({
    name: String,
    status: String,
    visited_at: Date
});

var evaluationSchema = mongoose.Schema({
    userid: { type: mongoose.Schema.ObjectId, required: true },
    title: { type: String, required: true },
    last_step: Number,
    next_path: Number,
    is_completed: Boolean,
    is_current: Boolean,
    created_at: { type: Date, default: Date.now },
    updated_at: Date,
    toolsvisited: [toollist]
});


//evaluationSchema.methods.findToolList = function findToolList(name, cb) {
   // return this.toolsvisited.filter(x => x.name === name);
///};

evaluationSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});
// create the model for users and expose it to our app
module.exports = mongoose.model('Evaluation', evaluationSchema);