/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

// middleware/getEvalDevaults.js
//load the thing we need
var Evaluation = require('../models/evaluation');
var isLoggedIn = require('../middleware/isLoggedIn.js');
var textHelpers = require('../public/js/textHelpers.js');
var configDB = require('../config/database.js');
var async = require('async');

var getEvalDefaults = function (sess, user) {

    sess.defaults = {};
	if (sess.eval) {
		setShareResults(sess, user);
		setBasics(sess);
		setApproach(sess);
		setResearchQ(sess);
		setPlanNext(sess);
		setPrepareRandom(sess);
		setMatching(sess);
		setRandom(sess);
		setGetResults(sess);
		setPlanContext(sess);
		setEvalPlan(sess);
	}
    sess.defaults.shiny_url = configDB.shiny_url;
    return;
}



module.exports = getEvalDefaults;


// set defaults for tools
function setBasics(sess) {

    var defstocheck = {
        Basics_Users: "the technology users",
		Basics_Tech_Name: "the educational technology",
		Basics_Outcome: "Outcome"
	}

    sess.defaults.BasicsIncomplete = populateDefaults(defstocheck, sess.eval.basics, sess, false);
	if (sess.defaults.Basics_Users)
		sess.defaults.Singular_User = sess.defaults.Basics_Users.substring(0, sess.defaults.Basics_Users.length - 1);
	sess.defaults.Cap_Basics_Outcome = textHelpers.capitalize(sess.defaults.Basics_Outcome);

	sess.defaults.Cap_Basics_Tech_Name = textHelpers.capitalize(sess.defaults.Basics_Tech_Name);
    return;
};

function setApproach(sess) {

    var currentNew = sess.eval.probAppr.Appr_Current_or_New;
    var verb = currentNew === "Current" ? "did" : "will";
    var verb2 = currentNew === "Current" ? "is" : "was";

    sess.defaults.VerbDidWill = verb;
    sess.defaults.VerbIsWas = verb2;

    return;
}

function setResearchQ(sess) {
	var defstocheck = {
        Outcome_Direction: "improve",
        Outcome_Measure: "outcome measure",
        Intervention_Group_Desc: "group using technology",
        Comparison_Group_Desc: "non-users"
    }

	sess.defaults.planQuestionIncomplete = populateDefaults(defstocheck, sess.eval.planQuestion, sess, false);

    return;
};

function setPlanNext(sess) {
	var defstocheck = {
		Measure_Units: "units",
		Success_Effect_Size: '0',
		Pass_Probability: '75',
		Fail_Probability: '50',
        Tech_Cost_Saves: '[Saves/Costs]',
        Tech_Amount: '[amount]',
		Tech_Cost_User: '[user]',
		Action_Success: '[next step if moving the needle]',
		Action_Fail: '[next step if not moving the needle]',
		Action_Inconclusive: '[next step if results inconclusive]'
	}

    sess.defaults.planNextIncomplete = populateDefaults(defstocheck, sess.eval.planNext, sess, false);
	sess.defaults.Tech_Cost_Saves = textHelpers.capitalize(sess.defaults.Tech_Cost_Saves);
    return;
};

function setPrepareRandom(sess) {
	var prepareRandom = sess.eval.prepareRandom;


	var defstocheck = {
		Individual_Group: "individuals or groups",
		Cluster_Group: "group (e.g. classroom or school)"
	}
	sess.defaults.prepareRandomIncomplete = populateDefaults(defstocheck, prepareRandom, sess, false);

	if (sess.defaults.Basics_Users)
		sess.defaults.Random_Level = sess.defaults.Basics_Users.charAt(0).toUpperCase() + sess.defaults.Basics_Users.slice(1);

    return;
};

function setPlanContext(sess) {
	var planContext = sess.eval.planContext;

	var defstocheck = {
        Tech_Purpose: 'Not reported',
        Tech_Components: 'Not reported',
        Total_Students: "Not reported",
        District_State: "Not reported",
        Ethnicity_Hispanic: "Not reported",
        Gender_Female: "Not reported",
        English_Learners: "Not reported",
        IEP: "Not reported",
		Expected_Dosage: "No information was provided regarding the usage of the technology by the treatment group.",
		Developer_Guidelines: "No information was provided regarding the recommended usage by the developer of the technology.",
		Other_Notes: "No other factors or initiatives were identified as potentially contributing to the results."
	}

    sess.defaults.planContextIncomplete = populateDefaults(defstocheck, planContext, sess, false);
	sess.defaults.Components = textHelpers.capitalize(sess.defaults.Tech_Components);
	sess.defaults.Purpose = textHelpers.punctuate(sess.defaults.Tech_Purpose);

	//List of arrays to turn into comma delimited lists;
    var checkArrays = {
        Program_Types: [planContext.Type_Curriculum, planContext.Type_Practice, planContext.Type_Supplement, planContext.Type_Assessment, planContext.Type_Professional_Learning, planContext.Type_Information_Management],
        Delivery_Types: [planContext.Delivered_School_Wide, planContext.Delivered_Whole_Class, planContext.Delivered_Small_Group, planContext.Delivered_Individually],
        School_Types: [planContext.SchoolType_Charter, planContext.SchoolType_Private, planContext.SchoolType_Parochial, planContext.SchoolType_Public],
        Urbanicity: [planContext.Urbanicity_Urban, planContext.Urbanicity_Suburban, planContext.Urbanicity_Rural],
        Classroom_Types: [planContext.ClassroomType_General, planContext.ClassroomType_Inclusion],
        Outcomes: planContext.Outcomes
	}

    sess.defaults.planContextIncomplete = populateArrayDefaults(checkArrays, sess, sess.defaults.planContextIncomplete);

	var nonWhite = [planContext.Race_Asian, planContext.Race_Black, planContext.Race_Native_American, planContext.Race_Other, planContext.Race_Pacific_Islander];

    sess.defaults.Non_White = calculateOtherPercent(nonWhite, planContext.Race_White);

    sess.defaults.Eval_Duration = textHelpers.calculateDuration(planContext.Eval_Begin_Date, planContext.Eval_End_Date);

	sess.defaults.Grades_Used = planContext.Grades.length == 0 ? "" : textHelpers.createGradeString(planContext.Grades);

	sess.defaults.planContextIncomplete = (sess.defaults.Eval_Duration == "Not reported") || (sess.defaults.Grades_Used == "Not reported") || (sess.defaults.Non_White == "Not reported") ? true : sess.defaults.planContextIncomplete;

    return;
}

function setEvalPlan(sess) {
    // Pre-populate milestones. 
	if (sess.eval.evalPlan.Milestones.length === 0) {
		for (var i = 0; i < 12; i++) {
			var m = ({
				Order: i + 1,
				Milestone_Name: '',
				Complete_Date: '',
				Assigned_To: '',
				Status: '',
				Notes: '',
				Hide: ''
			});
			sess.eval.evalPlan.Milestones.push(m);
		}
	}
	sess.eval.evalPlan.Milestones.sort(textHelpers.dynamicSort("Order"));
    return;
}

function setMatching(sess) {

    var matching = sess.eval.matching;
    var mresult = null;
    sess.defaults.wasMatched = false;

	if (matching.Result) {
		sess.defaults.wasMatched = matching.Result === "" ? false : (sess.eval.path == "path-matching" ? true : false);
        var mresult = JSON.parse(matching.Result);
    }

    
    if (matching.Targeted_Access === "" || matching.Targeted_Access === 'Select an option') {
        sess.defaults.matchingIncomplete = true;
        sess.defaults.Targeted_Access = "[Not Specified]";
    } else if (matching.Targeted_Access.toLowerCase() === "yes") {
        if (matching.Target_Group_Desc === "") {
            sess.defaults.matchingIncomplete = true;
            sess.defaults.Targeted_Access = "[Not Specified]";
        }
    } else {
        sess.defaults.Targeted_Access = matching.Targeted_Access.toLowerCase() == "no" ? "None" : matching.Target_Group_Desc;
    }

	sess.defaults.match_vars_relabel = mresult ? (mresult.args.match_vars || "none selected") : "none selected";
}

function setRandom(sess) {
    var random = sess.eval.random;
   // console.log("In set random and path = " + sess.eval.path);
    sess.defaults.wasRandomized = false;
    if (random.Result) {
        sess.defaults.wasRandomized = random.Result === "" ? false : (sess.eval.path == "path-random" ? true : false);
    }
    return;
}

function setGetResults(sess) {

	var eval = sess.eval;

	sess.defaults.hasResults = false;
    sess.defaults.hasSample = false;
	sess.defaults.hasCluster = false;

    if (eval.getresult.Result) {

		sess.defaults.hasResults = eval.getresult.Result === "" ? false : true;
   
        var result = JSON.parse(eval.getresult.Result);

		if (result.args) {
            sess.defaults.control_vars_relabel = result.args.control_vars || "none selected";
		}
		if (typeof result == "object") {
			sess.defaults.Results_By_Grade_Flag = Object.keys(result.results_by_grade).length > 1 ? " by grade" : "";

		} else {
			sess.defaults.Results_By_Grade_Flag = "";
		}

        var balanced = true, clusterGroupWarning = false;
		var successCount = 0, inconclusiveCount = 0, failureCount = 0;
        var clusterGroupWarningComparison = "";

		for (grade in result.results_by_grade) {
            if (result.results_by_grade.hasOwnProperty(grade)) {

                var thisresult = result.results_by_grade[grade];

                sess.defaults.hasSample = thisresult.samples ? true : false;
				sess.defaults.hasCluster = thisresult.samples_cluster ? true : false;

                //For warnings
                // Balance warning
                balanced = isBalanced(thisresult.baseline_var_means);

                // Cluster warning
                if (result.args.cluster_var.indexOf("no cluster") === -1 && sess.defaults.hasCluster) {

                    if (thisresult.samples_cluster.n_full_treat === 1 || (thisresult.samples_cluster.n_full - thisresult.samples_cluster.n_full_treat === 1)) {
                        clusterGroupWarning = true;
                        clusterGroupWarningComparison = (thisresult.samples_cluster.n_full - thisresult.samples_cluster.n_full_treat === 1) ? "not" : "";
                    }
                }

                //For Interpretation
                var probability = textHelpers.stripPercent(thisresult.interpretation.probability[0]);
                var success = (probability > eval.planNext.Pass_Probability);
                var inconclusive = (probability < eval.planNext.Pass_Probability) && (probability > eval.planNext.Fail_Probability);

                if (success) {
                    successCount++;
                } else if (inconclusive) {
                    inconclusiveCount++;
                } else {
                    failureCount++;
                }

            }
        } // For each grade

		// Create result summary string
		var header, start, gradeQualifier, inconclusiveQualifier, nextSteps;
		header = start = gradeQualifier = inconclusiveQualifier = nextSteps = "";

		if (inconclusiveCount === (inconclusiveCount + successCount + failureCount)) {
			header = "The results from the evaluation of " + eval.basics.Basics_Tech_Name + " are inconclusive";
			nextSteps = eval.planNext.Action_Inconclusive;
		}
		else {
			if (successCount === 0) {
				start = textHelpers.capitalize(eval.basics.Basics_Tech_Name) + " did not have the intended effect ";
				nextSteps = eval.planNext.Action_Fail;
			}
			if (successCount > 0 && failureCount > 0) {
				start = textHelpers.capitalize(eval.basics.Basics_Tech_Name) + " had the intended effect ";
				gradeQualifier = ' for some grades, but not for others';
				nextSteps = eval.planNext.Action_Inconclusive;
			}
			if (inconclusiveCount > 0) inconclusiveQualifier = ' For some grades, results were inconclusive.';
			if (successCount > 0 && failureCount === 0 && successCount > inconclusiveCount) {
				nextSteps = eval.planNext.Action_Success;
				start = textHelpers.capitalize(eval.basics.Basics_Tech_Name) + " is moving the needle";
			}
			header = start + ' on ' + eval.basics.Basics_Outcome + gradeQualifier + inconclusiveQualifier + '.';
		}

		// Defaults to use on pages
		sess.defaults.ResultSummary = header;
		sess.defaults.Cluster_Group_Warning = clusterGroupWarning;
		sess.defaults.Cluster_Group_Warning_Add_Not = clusterGroupWarningComparison;
		sess.defaults.isBalanced = balanced;
		sess.defaults.Result_Next_Steps = nextSteps;

	} 

	return;
};

function setShareResults(sess, user) {
    var eval = sess.eval;
	var publishedAt = eval.published_at;
	
    sess.defaults.pilot_type = eval.path === "path-random" ? "randomized" : "matched";

	if (publishedAt) {
		publishedAt = new Date(eval.published_at).toLocaleDateString();
	} else {
		publishedAt = '[not published]';
	}
	sess.defaults.published_at = publishedAt;

    if (user._id.toString() == eval.userid.toString()) {
        sess.defaults.author = sess.eval.author || user.profile.user_name;
        sess.defaults.company = sess.eval.company || user.profile.organization_name;
    } else {
        sess.defaults.author = sess.eval.author || "Anonymous";
        sess.defaults.company = sess.eval.company || "Unknown Organization";
    }
	//console.log("Eval userid = " + eval.userid);
	//console.log("current userid = " + user._id);

}


// General functions
function isBalanced(baselines) {
    var balanced = true;
    for (var blvar in baselines) {
        if (baselines.hasOwnProperty(blvar)) {
            if (Math.abs(baselines[blvar].effect_size) > 0.25) {
                balanced = false;
            }
        }
    }
    return balanced;
}

function populateDefaults(defstocheck, tool, sess, incomplete) {
    for (var check in defstocheck) {
        if (defstocheck.hasOwnProperty(check)) {

			if (tool[check] == null) {
				sess.defaults[check] = "";
			} else if (typeof tool[check] == "number") {
                sess.defaults[check] = tool[check];
            } else if (tool[check] === "" || tool[check] === 'Select an option') {
                incomplete = true;
                sess.defaults[check] = defstocheck[check];
            } else if (tool[check].toLowerCase() === "other") {
                var ocheck = check + "_Other";

                if (tool[ocheck] === "") {
                    incomplete = true;
                    sess.defaults[check] = defstocheck[check];
                }
                else {
                    sess.defaults[check] = tool[ocheck];
                }

            } else {
                sess.defaults[check] = tool[check];
            }
        }
    }

    return incomplete;

}

function populateArrayDefaults(checkArrays, sess, incomplete) {
    for (var array in checkArrays) {
        if (checkArrays.hasOwnProperty(array)) {
            var tempArray = [];
            if (textHelpers.allBlank(checkArrays[array])) {
                incomplete = true;
                sess.defaults[array] = "Not reported";
            } else {

                sess.defaults[array] = checkArrays[array].filter(function (n) { return n != "" }).join(", ");
            }
        }
    }
    return incomplete;
}

function calculateOtherPercent(arrayofOtherPerValues, singlePerValue) {
    var addArrayPer = 0;
    var nonValuePer = 0;
	for (var i = 0; i < arrayofOtherPerValues.length; i++) {
		if (typeof arrayofOtherPerValues[i] === 'number') {
			addArrayPer = arrayofOtherPerValues[i] + addArrayPer;
		}
	}

	if (typeof singlePerValue === 'number' && singlePerValue > 0) {
		nonValuePer = 100 - singlePerValue;
	} else if (addArrayPer > 0) {
		nonValuePer = addArrayPer;
	} else { nonValuePer = null; }
	return nonValuePer ? nonValuePer + "%" : "Not reported";
}