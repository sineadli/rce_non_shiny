// app/models/evaluation.js
// load the things we need
var mongoose = require('mongoose');


//define enums:
units = ["students", "schools", "teachers", "parents", "others"];
achievement = ["Student academic achievement", "Student non-academic achievement", "Teacher performance", "other"];
direction = ["Increase", "Decrease"];
spendresults = ["costs", "saves"];
unitmeasured = ["student", "teacher", "school"];
totalToolNumber = 7; //for completed status

//02.03 determine your approach
var ProbAppr = mongoose.Schema({
    Prob_Appr_A: { type: String }, //Q.A.1
    Prob_Appr_B: { type: String },   //q8
    Prob_Appr_B_other: { type: String },  //Q.A.2
    Prob_Appr_C: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});
//03.01 crafting a research question
var PlanQuestion = mongoose.Schema({
    Plan_Question_A: { type: String },
    Plan_Question_B_1: { type: String },
    Plan_Question_B_Other: { type: String },
    Plan_Question_B_2: { type: String },
    Plan_Question_B_3: { type: String },
    Plan_Question_C: { type: String },
    Plan_Question_D: String,
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});
//03.02 plan next steps
var PlanNext = mongoose.Schema({
    Plan_Next_A_1: { type: String }, //id=dropdn-cost-saves
    Plan_Next_A_2: { type: Number },
    Plan_Next_A_3: { type: String },
    Plan_Next_A_4: { type: String },
    Plan_Next_B: { type: Number },
    Plan_Next_C_1: { type: String },
    Plan_Next_C_2: { type: String },
    Plan_Next_D_1: String,
    Plan_Next_D_2: String,
    Plan_Next_D_3: String,
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});
//03.03 context and usage
var PlanContext = mongoose.Schema({
    Plan_Context_A_1: { type: String },
    Plan_Context_A_2: { type: String },
    Plan_Context_A_3: { type: String },
    Plan_Context_A_4: { type: String },
    Plan_Context_A_5: { type: String },
    Plan_Context_A_6: { type: String },
    Plan_Context_B: String,
    Plan_Context_C: String,
    Plan_Context_D: String,
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});

//Tools visited array
var toollist = new mongoose.Schema({
    name: String,
    status: String,
    visited_at: Date
});

// define the schema for our evaluation model
var evaluationSchema = mongoose.Schema({
    userid: { type: mongoose.Schema.ObjectId, required: true },
    title: { type: String, required: true },
    last_step: Number,
    next_path: Number,
    is_completed: Boolean,
    is_current: Boolean,
    created_at: { type: Date, default: Date.now },
    updated_at: Date,
    toolsvisited: [toollist],
    status: String,
    probAppr: ProbAppr,
    planQuestion: PlanQuestion,
    planNext: PlanNext,
    planContext: PlanContext,
    stepsclicked: [String],
    last_tool: String

});


//evaluationSchema.methods.findToolList = function findToolList(name, cb) {
// return this.toolsvisited.filter(x => x.name === name);
///};

evaluationSchema.pre('save', function (next) {
    
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    if (!this.toolsvisited) {
        this.status = 'New';
    }
    else {
        if (this.toolsvisited.length > 0) {
            //console.log(this.toolsvisited.length);
            if (this.toolsvisited.length == totalToolNumber) this.status = " 100% Completed"
            if (this.toolsvisited.length > 0) {
                var per = this.toolsvisited.filter(function (x) { return x.status.toLowerCase() === "completed" }).length / 7 * 100;
                this.status = per.toPrecision(3) + "% Completed";
            }
        }


    }
    next();
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Evaluation', evaluationSchema);