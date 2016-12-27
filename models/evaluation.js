
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

// app/models/evaluation.js
// load the things we need
var mongoose = require('mongoose');
var User = require('./user');

function getSingular(v) {
    if (v === 'users') v = 'members';
	return v.substring(0, v.length-1);
}
function useOther(v,o) {
    if (v === 'other') {
        if (o === '') return v;
        else return o;
    }
	else return v;
}
//define enums:
units = ["students", "schools", "teachers", "parents", "others"];
achievement = ["Student academic achievement", "Student non-academic achievement", "Teacher performance", "other"];
direction = ["Increase", "Decrease"];
spendresults = ["costs", "saves"];
unitmeasured = ["student", "teacher", "school"];
totalToolNumber = 8; //for completed status

//02.03 determine your approach
var Basics = mongoose.Schema({
    Basics_Have: { type: String, default: '' },
    Basics_Tech_Name: { type: String, default: '' }, // was Plan_Question_A
    Basics_Using: { type: String, default: '' }, // was Prob_Appr_A This is not used.  Replaced by Prob_Appr_Current_or_New
    Basics_Users: { type: String, default: 'users' }, // Was Prob_Appr_B
	Basics_Users_Other: { type: String, default: '' }, // Was Prob_Appr_B_other
	//Eval_Users: {type: String, set: useOther(Basics_Users, Basics_Users_Other)},
//	Singular_User: { type:String, set: getSingular(Basics_Users)}, 
    Basics_Outcome: { type: String, default: '' }, 
	Basics_Outcome_Other: { type: String, default: '' },    
	//Eval_Outcome: { type: String, set: useOther(Basics_Outcome, Basics_Outcome_Other) },
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});
var ProbAppr = mongoose.Schema({
	Appr_Current_or_New: { type: String, default: '' }, // Replaces Prob_Appr_A but values are different.
    Appr_All_Using: { type: String, default: '' }, // was Prob_Appr_C
    Appr_Can_Group: { type: String, default: '' },
    Appr_How_Choose: { type: String, default: '' }, 
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});
//03.01 crafting a research question
var PlanQuestion = mongoose.Schema({
    Outcome_Measure: { type: String, default: '' }, // was Plan_Question_B_2
    Outcome_Direction: { type: String, default: '' }, // was  Plan_Question_B_3
    Intervention_Group_Desc: { type: String, default: '' }, // was  Plan_Question_C
    Comparison_Group_Desc: { type: String, default: '' }, // was Plan_Question_D
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});
//03.02 plan next steps
var PlanNext = mongoose.Schema({
    Tech_Cost_Saves: { type: String, default: '' }, // was Plan_Next_A_1
    Tech_Amount: { type: Number, default: 0 }, // was Plan_Next_A_2
    Tech_Cost_User: { type: String, default: '' }, // was Plan_Next_A_3
    Tech_Cost_Desc: { type: String, default:'' }, // was Plan_Next_A_4
	Measure_Units: { type: String, default: '' }, // was Plan_Next_Units
	Measure_Units_Other: { type: String, default: '' }, // was Plan_Next_Units_Other
    Success_Effect_Size: { type: Number, default: 0 }, // was  Plan_Next_B
    Pass_Probability: { type: String, default: '' },// was Plan_Next_C_1
    Fail_Probability: { type: String, default: '' },// was Plan_Next_C_2
    Action_Success: { type: String, default: '' }, // was Plan_Next_D_1
    Action_Fail: { type: String, default: '' },// was Plan_Next_D_2
    Action_Inconclusive: { type: String, default: '' }, // Plan_Next_D_3
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});
//03.03 context and usage
var PlanContext = mongoose.Schema({
    Plan_Context_A_1: { type: String, default: ''  },
    Plan_Context_A_2: { type: String, default: ''  },
    Plan_Context_A_3: { type: String, default: ''  },
    Plan_Context_A_4: { type: String, default: ''  },
    Plan_Context_A_5: { type: String, default: ''  },
    Plan_Context_A_6: { type: String, default: ''  },
    Plan_Context_B: { type: String, default: '' },
    Plan_Context_C: { type: String, default: '' },
    Plan_Context_D: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});

var Random = mongoose.Schema({
	// Q_M_1: { type: String, default: '' }, replaced by planQuestion.Intervention_Group_Desc
	// Q_M_2: { type: String, default: '' }, replaced by planQuestion.Comparison_Group_Desc
    Individual_Group: { type: String, default: '' }, // was Q_9
	Cluster_Group: { type: String, default: '' },
	Cluster_Group_Other: { type: String, default: '' },
	User_Limit_Exist: { type: String, default: '' },
	intervention_quantity: { type: Number, default: 0 },
	intervention_type: { type: String, default: '' },
	s_unit_id: { type: String, default: '' },
    s_pretest: { type: String, default: '' },
    s_block_id: { type: String, default: '' },
    s_baseline_vars: { type: String, default: '' },  
    Result: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: Date
});

//05.01 matching
var Matching = mongoose.Schema({
   // Q_M_1: { type: String, default: '' }, replaced by planQuestion.Intervention_Group_Desc
   // Q_M_2: { type: String, default: '' }, replaced by planQuestion.Comparison_Group_Desc
	Targeted_Access: { type: String, default: '' },
	Target_Group_Desc: { type: String, default: '' }, // was Q_9
    s_treat_var: { type: String, default: '' },
    s_match_vars: { type: String, default: '' },
    s_grade_var: { type: String, default: '' },
    n_full: { type: String, default: '' },
    n_full_treat: { type: String, default: '' },
    n_matched: { type: String, default: '' },
    n_matched_treat: { type: String, default: '' },
    Result: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: Date
});
//05.2 get results
var GetResult = mongoose.Schema({
    Result: { type: String, default: '' },
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
	basics: { type: Basics, default: Basics },
    probAppr: { type: ProbAppr, default: ProbAppr },
	planQuestion: { type: PlanQuestion, default: PlanQuestion },
    planNext: {
        type: PlanNext,
        default: PlanNext
    },
    planContext: {
        type: PlanContext,
        default: PlanContext
    },
	random: {
        type: Random,
        default: Random
    },
    matching: {
        type: Matching,
        default: Matching
    },
    getresult: {
        type: GetResult,
        default: GetResult
    },
    stepsclicked: [String],
	last_tool: String,
    flag: { type: String, default: 1 },
    path: { type: String, default: "" },
    published_at: Date,
    author: { type: String, default: "" },
    company: { type: String, default: "" }


});


//evaluationSchema.methods.findToolList = function findToolList(name, cb) {
// return this.toolsvisited.filter(x => x.name === name);
///};

evaluationSchema.pre('save', function (next) {
    //this.flag = '';
    var tool1 = 'Determine Your Approach', tool2 = 'Summarize Context', tool3 = 'Prepare Your Data for Analysis';
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
  
    if (this.toolsvisited.length > 0) {
        if (this.toolsvisited[this.toolsvisited.length - 1].status === "completed") {
            this.flag = 0;
            // if (this.toolsvisited[this.toolsvisited.length - 1].name === tool1 || this.toolsvisited[this.toolsvisited.length - 1].name === tool2 || this.toolsvisited[this.toolsvisited.length - 1].name === tool3) { this.flag = this.last_step + 1; }
        }
        var per = this.toolsvisited.filter(function (x) { return x.status.toLowerCase() === "completed" }).length / 8 * 100;
        this.status = parseInt(per);
        if (this.toolsvisited.length == totalToolNumber) this.status = " 100";
        if (this.basics) {
            if (this.basics.Basics_Have.toLowerCase() == "no" || (this.basics.Basics_Outcome && this.basics.Basics_Outcome.toLowerCase()) == "not sure") {
                this.flag = 1;
                this.toolsvisited.filter(function (x) { return x.name.toLowerCase() === "the basics" })[0].status = "started";
            }
        }
        //path determine
        if (this.probAppr) {
            if (this.probAppr.Appr_Can_Group.toLowerCase() === "no" ||
                this.probAppr.Appr_All_Using.toLowerCase() === "yes" ||
                this.probAppr.Appr_How_Choose.toLowerCase() === "i will choose users based on specific criteria") {
                this.path = "path-none";  //what should we do?
            }
            else {
                if (this.probAppr.Appr_Current_or_New.toLowerCase() === "current") {
                    this.path = "path-matching";  //disable random tools or hide them
                }
                else {
                    if (this.probAppr.Appr_How_Choose.toLowerCase() === "i will choose randomly") {
                        this.path = "path-random"; //disable matching tools or hide them
                    }
                    else if (this.probAppr.Appr_How_Choose.toLowerCase() === "i will use a cutoff") {
                        this.path = "path-regression";  //no available yet
                    }

                }
            }
        }
        if (this.status === "100") {
            console.log("publishing info");
            if (!this.published_at) { this.published_at = currentDate; }
            var doc = this;
            User.findById(this.userid, function (err, user) {
                if (err) {
                    next(err);
                } else if (user) {
                    doc.author = user.profile.user_name;
                    doc.company = user.profile.organization_name;
                    next();
                } else {
                    next();
                }
            });

        }
    }
    else {
        next();
    }
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Evaluation', evaluationSchema);