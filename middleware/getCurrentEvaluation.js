
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

// middleware/getCurrentEvaluation.js
//load the thing we need
var Evaluation = require('../models/evaluation');
var isLoggedIn = require('../middleware/isLoggedIn.js');


var getCurrentEvaluation = function (req, res, next) {
	console.log("getting current eval");
    sess = req.session;

        Evaluation.findOne({ _id: req.user.evalid }).exec(function (err, eval) {
            if (err) {
                console.log(err);
                return next();
            } else {

                if (eval) {
                 //   console.log("In get current eval if eval");
					
                    sess.eval = eval;
                    if (!sess.step) { sess.step = eval.last_step; }
                    req.user.evalid = eval._id;
                    if (req.user._id == eval.userid) {
                        req.user.save();
                    }
     //               console.log("updating udate date for evaluation:" + eval.title);
					//eval.updated_at = new Date();
     //               eval.save();

					// Set values that are used in other tools.
                    sess.defaults = {};
					eval.setBasics(sess);
					eval.setResearchQ(sess);
					eval.setPlanNext(sess);
					eval.setPrepareRandom(sess);
					eval.setGetResults(sess);
					eval.setApproach(sess);
					eval.setPlanContext(sess);
					eval.setShareResults(sess);
                    eval.setRandom(sess);
		
                    return next();
                }
                return next();
            }
        });

   
    
};
function setBasics(sess) {
     var basicsUsers = "the technology users";
	 var singularUser = "user";
	 var basicsTechName = "the educational technology";
	 var basicsOutcome = "Outcome";
     var eval = sess.eval;
    console.log("in set Basics in get current eval");
	//console.log(eval.basics);
	basicsUsers = eval.basics.Basics_Users;
	singularUser = basicsUsers.substring(0, basicsUsers.length - 1);
	if (basicsUsers.toLowerCase() === "other") { basicsUsers = eval.basics.Basics_Users_Other; }
	basicsTechName = eval.basics.Basics_Tech_Name || basicsTechName;
		basicsOutcome = eval.basics.Basics_Outcome;
		if (basicsOutcome.toLowerCase() === "other") { basicsOutcome = eval.basics.Basics_Outcome_Other; }

		sess.defaults.Basics_Users = basicsUsers;
		sess.defaults.Singular_User = singularUser;
		sess.defaults.Basics_Tech_Name = basicsTechName;
		sess.defaults.Basics_Outcome = basicsOutcome;
    
		console.log("in set Basics in get current eval");
		//console.log(sess.defaults);
    return;
};
function setResearchQ(sess) {

	var outcomeDirection = "improve";
	var outcomeMeasure = "outcome measure";
	var interventionGroupDesc = "group using technology";
	var comparisonGroupDesc = "non-users";
	

     var planQuestion = sess.eval.planQuestion;

        if (!planQuestion.Outcome_Direction) {

        } else if (planQuestion.Outcome_Direction.toLowerCase() === 'select an option') {

        } else {
            outcomeDirection = planQuestion.Outcome_Direction || outcomeDirection;
        }

        outcomeMeasure = planQuestion.Outcome_Measure || outcomeMeasure;
		interventionGroupDesc = planQuestion.Intervention_Group_Desc || interventionGroupDesc;
		comparisonGroupDesc = planQuestion.Comparison_Group_Desc || comparisonGroupDesc;

		sess.defaults.Outcome_Direction = outcomeDirection;
		sess.defaults.Outcome_Measure = outcomeMeasure;
		sess.defaults.Intervention_Group_Desc = interventionGroupDesc;
		sess.defaults.Comparison_Group_Desc = comparisonGroupDesc;
		console.log('in set research Q');
		console.log(sess.defaults.Outcome_Direction);
  
    return;
};
function setPlanNext(sess) {

	var units = "units";


	var planNext = sess.eval.planNext;
	if (!planNext.Measure_Units) {

	} else if (planNext.Measure_Units.toLowerCase() === 'select an option') {

	} else {
		units = planNext.Measure_Units || units;
	}
	   units = (units == "other") ? (eval.planNext.Measure_Units_Other || "other units") : units;

	   sess.defaults.Success_Effect_Size = planNext.Success_Effect_Size == "" ? '0' : planNext.Success_Effect_Size;
	  
	   sess.defaults.Pass_Prob = planNext.Pass_Probability == "" ? '75' : planNext.Pass_Probability;

	   sess.defaults.Fail_Prob = planNext.Fail_Probability == "" ? '50' : planNext.Fail_Probability;

	   sess.defaults.Units = units;
    return;
};

function setPrepareRandom(sess) {

	var prepareRandom = sess.eval.prepareRandom;
	var randomLevel = sess.defaults.Basics_Users;

	if (prepareRandom.Individual_Group.toLowerCase() == "groups") {
        var cluster = prepareRandom.Cluster_Group == "other" ? prepareRandom.Cluster_Group_Other : prepareRandom.Cluster_Group;
        randomLevel = (cluster == "") ? "groups of " + sess.defaults.Basics_Users : cluster;
	}
	sess.defaults.Random_Level = randomLevel.charAt(0).toUpperCase() + randomLevel.slice(1);

    return;
};
module.exports = getCurrentEvaluation;



