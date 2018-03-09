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
var http = require('http'),
	url = require('url');

var getEvalDefaults = function (sess, user) {

    if (!sess.defaults) {
        sess.defaults = {};
    } 
	if (sess.eval) {
		
		setBasics(sess);
		setOutcome(sess);
		setApproach(sess);
		setResearchQ(sess);
		setGetResults(sess);		
		setPlanNext(sess);
		setEvalPlan(sess);
		setPlanContext(sess);
		setPrepareRandom(sess);
		setMatching(sess);
		setRandom(sess);		
		setShareResults(sess, user);
	}
    sess.defaults.shiny_url = configDB.shiny_url;
    return;
}



module.exports = getEvalDefaults;


// set defaults for tools
function setBasics(sess) {
    sess.defaults.BasicsIncomplete = false;
    var defstocheck = {
        Basics_Users: "the technology users",
		Basics_Tech_Name: "the educational technology"
	}

    sess.defaults.BasicsIncomplete = populateDefaults(defstocheck, sess.eval.basics, sess, false);
	if (sess.defaults.Basics_Users)
		sess.defaults.Singular_User = sess.defaults.Basics_Users.substring(0, sess.defaults.Basics_Users.length - 1);
	
	sess.defaults.Cap_Basics_Users = textHelpers.capitalize(sess.defaults.Basics_Users);
	sess.defaults.Cap_Basics_Tech_Name = textHelpers.capitalize(sess.defaults.Basics_Tech_Name);
    return;
};
// set defaults for tools
function setOutcome(sess) {
    sess.defaults.BasicsIncomplete = false;
    var defstocheckb = {
     
		Basics_Outcome: "Outcome"
	}
	var defstocheckq = {

        Outcome_Measure: "outcome measure"
	}

    var outcomeIncompleteb = populateDefaults(defstocheckb, sess.eval.basics, sess, false);
	var outcomeIncompleteq = populateDefaults(defstocheckq, sess.eval.planQuestion, sess, false);
    sess.defaults.OutcomeIncomplete = (outcomeIncompleteb || outcomeIncompleteq);
    //console.log(sess.defaults);
	sess.defaults.Cap_Basics_Outcome = textHelpers.capitalize(sess.defaults.Basics_Outcome);
	
    return;
};

function setApproach(sess) {

    var currentNew = sess.eval.probAppr.Appr_Current_or_New;
    var verb = currentNew === "Current" ? "did" : "will";
	var verb2 = currentNew === "Current" ? "was" : "is";
	var verb3 = currentNew === "Current" ? "were" : "are";
	var verb4 = currentNew === "Current" ? "received" : "are receiving";
	

    sess.defaults.VerbDidWill = verb;
	sess.defaults.VerbIsWas = verb2;
	sess.defaults.VerbAreWere = verb3;
	sess.defaults.VerbAreReceivingReceived = verb4;

    return;
}

function setResearchQ(sess) {
    sess.defaults.planQuestionIncomplete = false;
	var defstocheck = {
        Outcome_Direction: "improve",
        Intervention_Group_Desc: "group using technology",
        Comparison_Group_Desc: "non-users"
    }

	sess.defaults.planQuestionIncomplete = populateDefaults(defstocheck, sess.eval.planQuestion, sess, false);

    return;
};

function setPlanNext(sess) {
    sess.defaults.planNextIncomplete = false;
    sess.defaults.Cost_Other = "";
	var defstocheck = {
		Measure_Units: "units",
		Success_Effect_Size: '0',
		Pass_Probability: '75',
		Fail_Probability: '50',
       
		Action_Success: '[next step if treatment group do better than comparison group]',
		Action_Fail: '[next step if treatment group do worse than comparison group]',
		Action_NoChange: '[next step if treatment and comparison group results are similar]',
		Action_Inconclusive: '[next step if results inconclusive]'
	}

	
    sess.defaults.planNextIncomplete = populateDefaults(defstocheck, sess.eval.planNext, sess, false);

    if (sess.eval.planNext.Tech_Cost_Desc === "") {
        var odefstocheck = {
            Tech_Cost_Saves: '[Saves/Costs]',
            Tech_Amount: '[amount]',
            Tech_Cost_User: '[user]'
        }
        sess.defaults.planNextIncomplete = populateDefaults(odefstocheck, sess.eval.planNext, sess, false);
		sess.defaults.Tech_Cost_Saves = textHelpers.capitalize(sess.defaults.Tech_Cost_Saves);
    } else {
        sess.defaults.Cost_Other = textHelpers.capitalize(sess.eval.planNext.Tech_Cost_Desc);
        sess.defaults.Tech_Cost_Saves = "Cost";
    }
    if (sess.defaults.Success_Effect_Size == 1) sess.defaults.Measure_Units = sess.defaults.Measure_Units.slice(0, -1);
    sess.defaults.AnyAmount = sess.defaults.Success_Effect_Size == '0' ? 'Yes' : "No";
   // console.log("defaults:");
   // console.log(sess.defaults);

	if (!sess.defaults.hasResults) {
		sess.defaults.resultCutoff = sess.defaults.Success_Effect_Size;
		sess.defaults.resultProbability = sess.defaults.Pass_Probability;
	}
    return;
};

function setPrepareRandom(sess) {
    var prepareRandom = sess.eval.prepareRandom;
    sess.defaults.prepareRandomIncomplete = false;


    var defstocheck = {
        Individual_Group: "individuals or groups",
        Cluster_Group: "group (e.g. classroom or school)"
    }
    sess.defaults.prepareRandomIncomplete = populateDefaults(defstocheck, prepareRandom, sess, false);


        sess.defaults.Random_Level = sess.defaults.Basics_Users.charAt(0).toUpperCase() + sess.defaults.Basics_Users.slice(1);
    if (sess.defaults.Cluster_Group.toLowerCase == "classes") {
        sess.defaults.Cluster_Group = "classroom";
    } else if (sess.defaults.Cluster_Group.toLowerCase == "schools") {
        sess.defaults.Cluster_Group = "school";
    }
    sess.defaults.Cluster_Groups = sess.defaults.Cluster_Group == "group (e.g. classroom or school)" ? "groups" : sess.defaults.Cluster_Group + "s";

    sess.defaults.Random_Level = sess.defaults.Basics_Users;
	if (sess.defaults.Individual_Group == "groups") {
		sess.defaults.Random_Level = sess.defaults.Cluster_Groups;
	}

return;
};

function setPlanContext(sess) {
	var planContext = sess.eval.planContext;
    sess.defaults.planContextIncomplete = false;
    var eval = sess.eval;
	var defstocheck = {
        Tech_Purpose: '&rsquo;s description was not provided.',
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

    if (sess.defaults.Expected_Dosage == "No information was provided regarding the usage of the technology by the treatment group.") {
		// This would only be true if no value was saved for expected dosage.
        eval.planContext.Expected_Dosage = ((eval.probAppr.Appr_Treatment_Group != null) ? eval.probAppr.Appr_Treatment_Group + " " : "") + ((eval.probAppr.Appr_Comparison_Group != null) ? eval.probAppr.Appr_Comparison_Group : "");
            
    }


	
		
	sess.defaults.Components = textHelpers.capitalize(sess.defaults.Tech_Components);
	sess.defaults.Tech_Purpose = (sess.defaults.Tech_Purpose !== "&rsquo;s description was not provided.") ? " is " + sess.defaults.Tech_Purpose : sess.defaults.Tech_Purpose;
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
	sess.defaults.matchingIncomplete = false;
    sess.defaults.wasMatched = false;
	sess.defaults.mhideFirst = false;
    sess.defaults.minFirst = "in";
    sess.defaults.miconFirst = "down";
    var mresult = "";

	if (matching.Result) {
		 mresult = safelyParseJSON(matching.Result);
		sess.defaults.wasMatched = mresult === "" ? false : (sess.eval.path == "path-matching" ? true : false);
	}

	if (sess.defaults.wasMatched) {
		sess.defaults.mSuccess = wasSuccessful(mresult);
		sess.defaults.mhideFirst = true;
		sess.defaults.minFirst = "";
		sess.defaults.miconFirst = "right";
		if (mresult.args) {
			sess.defaults.baselinetest_vars = mresult.args.match_vars;
		} else { sess.defaults.baselinetest_vars = "none selected"; }

	}
	if (sess.eval.path === "path-matching" && !sess.defaults.wasMatched) {
		sess.defaults.matchingIncomplete = true;
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
	
	var dlpath = (matching.DownloadPath ? matching.DownloadPath : "");
	sess.defaults.mDownloadPath = dlpath;
return;
}

function setRandom(sess) {
    var random = sess.eval.random;
   // console.log("In set random and path = " + sess.eval.path);
	sess.defaults.randomIncomplete = false;
	sess.defaults.rhideFirst = false;
    sess.defaults.rinFirst = "in";
    sess.defaults.riconFirst = "down";
    var rresult = "";

	
    sess.defaults.wasRandomized = false;
    if (random.Result) {
		 rresult = safelyParseJSON(random.Result);
        sess.defaults.wasRandomized = rresult === "" ? false : (sess.eval.path === "path-random" ? true : false);		
    }

	if (sess.defaults.wasRandomized) {
		sess.defaults.rhideFirst = true;
		sess.defaults.rinFirst = "";
		sess.defaults.riconFirst = "right";
		if (rresult.args) {
			sess.defaults.baselinetest_vars = rresult.args.baseline_vars;
		} else { sess.defaults.baselinetest_vars = "none selected"; }

	}
	if (sess.eval.path === "path-random" && !sess.defaults.wasRandomized) {
		sess.defaults.randomIncomplete = true;
    }
		sess.defaults.rDownloadPath = (random.DownloadPath ? random.DownloadPath : "");;

    return;
}

function setGetResults(sess) {

	var eval = sess.eval;

	sess.defaults.hasResults = false;
    sess.defaults.UsesROPE = false;
    sess.defaults.hasSample = false;
	sess.defaults.hasCluster = false;
    sess.defaults.Outcome_Min = "not available";
	sess.defaults.Outcome_Max = "not available";
    sess.defaults.hideFirst = false;
    sess.defaults.inFirst = "in";
    sess.defaults.iconFirst = "down";
   

    if (eval.getresult.Result) {

		var result = safelyParseJSON(eval.getresult.Result);
        sess.defaults.hasResults = (result === "")  ? false : true;
     

		if (sess.defaults.hasResults) {
		    sess.defaults.hideFirst = true;
		    sess.defaults.inFirst = "";
			sess.defaults.iconFirst = "right";

			sess.defaults.resultCutoff = result.args.cutoff[0];
			sess.defaults.resultProbability = result.args.probability[0];

		    if (result.outcome_range) {
		        sess.defaults.Outcome_Min = result.outcome_range.min;
		        sess.defaults.Outcome_Max = result.outcome_range.max;
		    }

		    if (result.args) {
		        sess.defaults.control_vars_relabel = result.args.control_vars || "none selected";
		    }
		    if (typeof result == "object") {
				sess.defaults.Results_By_Grade_Flag = Object.keys(result.results_by_grade).length > 1 ? " by grade" : "";
		        for (grade in result.results_by_grade) {
		            if (result.results_by_grade.hasOwnProperty(grade)) {


						var thisgrade = result.results_by_grade[grade];
						//console.log("in get defaults and checking for ROPE");
		              //  console.log(thisgrade.rope_output);

		                if (thisgrade.rope_output != undefined) {
		                    sess.defaults.UsesROPE = true;
						}
						console.log("Uses ROPE" +sess.defaults.UsesROPE);
		            }
		        }

		    } else {
		        sess.defaults.Results_By_Grade_Flag = "";
		    }

		    var balanced = true, clusterGroupWarning = false;
		    var successCount = 0, inconclusiveCount = 0, failureCount = 0;
		    noimpactCount = 0;
		    var clusterGroupWarningComparison = "";

		    for (grade in result.results_by_grade) {
		        if (result.results_by_grade.hasOwnProperty(grade)) {
		            console.log("Uses ROPE by grade" + sess.defaults.UsesROPE);

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
		            if (!sess.defaults.UsesROPE) {
		                console.log("doesn't use ROPE" + sess.defaults.UsesROPE);
		                var probability = textHelpers.stripPercent(thisresult.interpretation.probability[0]);
		                var pass_probability = textHelpers.stripPercent(eval.planNext.Pass_Probability);
		                var fail_probability = textHelpers.stripPercent(eval.planNext.Fail_Probability);

		                var success = (probability > pass_probability);
		                var inconclusive = (probability < pass_probability) && (probability > fail_probability);

		            } else {
		                console.log("used ROPE" + sess.defaults.UsesROPE);

		                //"rope_output\":{\"probabilities\":{\"less_than\":[0],\"equal\":[1],\"greater_than\":[0]}
						var prop_increased = textHelpers.round10(thisgrade.rope_output.probabilities.greater_than * 100, 0);
						var prop_decreased = textHelpers.round10(thisgrade.rope_output.probabilities.less_than * 100, 0);
						var prop_same = textHelpers.round10(thisgrade.rope_output.probabilities.equal * 100, 0);

		                console.log("prop decreased = " + prop_decreased);
		                console.log("prob the same = " + prop_same);
		                console.log("prop increased = " + prop_increased);
		                console.log("CT = " + sess.defaults.resultProbability);

						var meetGoal = (prop_decreased >= textHelpers.round10(sess.defaults.resultProbability) && sess.defaults.Outcome_Direction.toLowerCase() == "decrease") ? true : ((prop_increased >= textHelpers.round10(sess.defaults.resultProbability) && sess.defaults.Outcome_Direction.toLowerCase() == "increase") ? true : false);

						var negImpact = (prop_decreased >= textHelpers.round10(sess.defaults.resultProbability) && sess.defaults.Outcome_Direction.toLowerCase() == "increase") ? true : ((prop_increased >= textHelpers.round10(sess.defaults.resultProbability) && sess.defaults.Outcome_Direction.toLowerCase() == "decrease") ? true : false);
						var noImpact = (prop_same >= textHelpers.round10(sess.defaults.resultProbability) ? true : false);

		                inconclusive = ((negImpact === false && meetGoal === false && noImpact == false) ? true : false);
		            }

		            if (success || meetGoal) {
		                successCount++;
		            } else if (inconclusive) {
		                inconclusiveCount++;
		            } else if (noImpact) {
		                noimpactCount++;
		            } else if (negImpact) {
		                failureCount++;
		            }
		        }

		    } // For each grade

			console.log("fails= " + failureCount);
			console.log("no impacts = " + noimpactCount);
			console.log("successes = " + successCount);
			console.log("inconclusive = " + inconclusiveCount);


		    // Create result summary string
		    var header, start, gradeQualifier, inconclusiveQualifier, nextSteps;
			header = start = gradeQualifier = inconclusiveQualifier = nextSteps = "";
			var beginwith =  "Based on the data used in this analysis, " ;

		   
			if (sess.defaults.UsesROPE === false) {
			    if (inconclusiveCount === (inconclusiveCount + successCount + failureCount)) {
			        header = "The results from the evaluation of " + eval.basics.Basics_Tech_Name + " are inconclusive.";
			        nextSteps = eval.planNext.Action_Inconclusive;
			    }
			    if (successCount === 0) {
					start = eval.basics.Basics_Tech_Name + "  did not have the intended effect ";
		            nextSteps = eval.planNext.Action_Fail;
		        }
		        if (successCount > 0 && (successCount !== (inconclusiveCount + successCount + failureCount))) {
					start = eval.basics.Basics_Tech_Name + " had the intended effect ";
		            gradeQualifier = ' for some grades, but not for others.';
		            nextSteps = eval.planNext.Action_Inconclusive;
		        }
		        if (inconclusiveCount > 0) inconclusiveQualifier = ' For some grades, results were inconclusive.';
		        if (successCount > 0 && failureCount === 0 && successCount > inconclusiveCount) {
		            nextSteps = eval.planNext.Action_Success;
		            start = eval.basics.Basics_Tech_Name + " is moving the needle ";
				}
				header = beginwith + start + ' on ' + sess.defaults.Basics_Outcome.toLowerCase() + gradeQualifier + ((gradeQualifier === "") ? "." : "") + inconclusiveQualifier;
			} else {
				if (inconclusiveCount > 0 && inconclusiveCount === (inconclusiveCount + noimpactCount + successCount + failureCount)) {
				    header = "None of the possible outcomes meet our certainty threshold. Therefore, it is not possible to come to a conclusion about " + eval.basics.Basics_Tech_Name + ".";
					nextSteps = eval.planNext.Action_Inconclusive;
				} else if (successCount === 0 && failureCount > 0 && noimpactCount === 0 && inconclusiveCount === 0) {
						start = eval.basics.Basics_Tech_Name + "  is worse than its alternative.";
						nextSteps = eval.planNext.Action_Fail;
					}
				else if (successCount > 0 && failureCount === 0 && noimpactCount === 0 && inconclusiveCount === 0) {
						start = eval.basics.Basics_Tech_Name + "  is better than its alternative.";
						nextSteps = eval.planNext.Action_Success;
					}
				else if (noimpactCount > 0 && successCount === 0 && failureCount === 0 && inconclusiveCount === 0) {
		            start = eval.basics.Basics_Tech_Name + " is equivalent to its alternative.";
		            gradeQualifier = ' for some grades, but not for others.';
					nextSteps = eval.planNext.Action_NoChange;
				}
				else {
						 start = " different results were found for different grades.";
					}

					header = sess.defaults.hasResults ? beginwith + start : "Analysis is incomplete.";
			
				
		    }

		    // Defaults to use on pages
		    sess.defaults.ResultSummary = header;
		    sess.defaults.Cluster_Group_Warning = clusterGroupWarning;
		    sess.defaults.Cluster_Group_Warning_Add_Not = clusterGroupWarningComparison;
		    sess.defaults.isBalanced = balanced;
		    sess.defaults.Result_Next_Steps = nextSteps;

		} 
    } else {
		sess.defaults.ResultSummary = "Results were not analyzed.";
	}

    return;
};

function setShareResults(sess, user) {
    var eval = sess.eval;
	var publishedAt = eval.published_at;

	var matchsumtable = 0;
	var bkgrndtable = 1;
	var baselinetable = 2;
	var freqtable = 3;

    if (eval.path == "path-matching" && sess.defaults.wasMatched) {
        matchsumtable = 1;
        bkgrndtable = 2;
        baselinetable = 3;
        freqtable = 4;
    }
    sess.defaults.Match_Summary_Tab_Num = matchsumtable;
	sess.defaults.BackGround_Tab_Num = bkgrndtable;
	sess.defaults.Baseline_Tab_Num = baselinetable;
	sess.defaults.Frequentist_Tab_Num = freqtable;
   
    sess.defaults.baselinetest_vars = sess.defaults.baselinetest_vars == null ? "None Selected" : sess.defaults.baselinetest_vars;
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

function safelyParseJSON(json) {
	try {
	    return parsed = JSON.parse(json);
	} catch (e) {
		console.log("parse error = " + e);
	    return "";
	}

}

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


function wasSuccessful(mresult) {
    var balanceResult = "";
    var countGrades = 0;
    var countBalanced = 0;

	if (mresult === "") {
	    return balanceResult;
	}
    for (var grade in mresult.results_by_grade) {
        if (mresult.results_by_grade.hasOwnProperty(grade)) {
            countGrades++;
            countBalanced = (mresult.results_by_grade[grade].good_balance ? 1 : 0) + countBalanced;
        }
    }
    return balanceResult = (countBalanced == countGrades) ? "Matching was successful." : (countBalanced === 0 ? "The Coach was unable to create treatment and comparison groups that are balanced on the characteristics of the <%= defs.Basics_Users %> selected." : ((countBalanced !== 0 && countBalanced !== countGrades) ? "The Coach was able to create treatment and comparison groups that are balanced on the characteristics of the <%= defs.Basics_Users %> selected for some grades but not for all." : ""));
}

function populateDefaults(defstocheck, tool, sess, incomplete) {
    for (var check in defstocheck) {
       // console.log("In populate defaults and check = " + check);
        if (defstocheck.hasOwnProperty(check)) {

			if (tool[check] == null) {
			//	console.log(check + " is null  = " + tool[check]);
				sess.defaults[check] = defstocheck[check];
			} else if (typeof tool[check] == "number") {
				//console.log(check + " is a number = " + tool[check]);
                sess.defaults[check] = tool[check];
            } else if (tool[check] === "" || tool[check] === 'Select an option') {
                incomplete = true;
			//	console.log(check + " is blank or select an option and  = " + tool[check]);
                sess.defaults[check] = defstocheck[check];
            } else if (tool[check].toLowerCase() === "other") {
                var ocheck = check + "_Other";

                if (tool[ocheck] === "") {
                   // console.log("In populate defs and checking for missing " + tool[ocheck]);
                    incomplete = true;
                    sess.defaults[check] = defstocheck[check];
                }
                else {
				//	console.log(check + " should = somehthing = " + tool[check]);
                    sess.defaults[check] = tool[ocheck];
					
                }

            } else {
                sess.defaults[check] = tool[check];
				
            }
		//	console.log("In populate defs and checking for missing " + tool[check]);
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