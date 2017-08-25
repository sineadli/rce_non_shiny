
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

// middleware/getAllEvaluations.js
//load the thing we need
var Evaluation = require('../models/evaluation');
var Tool = require('../models/tool.js');
var textHelpers = require('../public/js/textHelpers.js');



var getAllEvalStats = function(req, res, next) {
    sess = req.session;
	var query = require('url').parse(req.url, true).query;

	console.log("parsing url");
	console.log(req.params.fid);
    console.log(query);
    var evalStats = [];
    evalStats.tools = [];

    var groupsFilter = [{}, { status: 100 }, { path: "path-matching" }, { path: "path-random" }];
    var groupsTitle = ["All Evaluatons", "Completed Evaluations", "Matching Evaluations", "Random Assignment Evaluations"];


    var filter = groupsFilter[req.params.fid];
    var statsTitle = groupsTitle[req.params.fid];
    sess.statsTitle = statsTitle;

    Tool.find({ coachStep: { $lt: 7 } }).exec(function(err, tools) {
        if (err) {
            console.log(err);
            return done(err);
        }

        for (var itool in tools) {
            if (tools.hasOwnProperty(itool)) {
                var atool = tools[itool];
                var key = atool.coachStep.toString() + "." + atool.order.toString();
                evalStats.tools.push({
                    Order: key,
                    ToolName: atool.name,
                    Started: 0,
                    Completed: 0,
                    Step: atool.coachStep
                });
            }
        }
      //  evalStats.tools.sort(id);
            console.log("filter = ");
            console.log(filter);

            Evaluation.find(filter).exec(function(err, evals) {
                if (err) {
                    console.log(err);
                    return next();
                } else if (evals) {
                  
                    var maxstep = 0;
                    var maxstatus = 0.0;
				
                    console.log(evals.length);
                    for (var thiseval in evals) {
                        var eval = evals[thiseval];
                        var tempArray = eval.stepsclicked.sort().reverse();


                        maxstep = tempArray[0] + maxstep;
					var status = textHelpers.stripPercent(eval.status);
                  //  if(status == "NaN"){ console.log("status = " + status);}  
					if (typeof status == "number") {
						//console.log("status num = " + status);
						maxstatus = status + maxstatus;
							 
						}
					

                        eval.toolsvisited.forEach(function(vtool) {
                            UpdateStats(vtool, evalStats);
                        });


                    }


                    for (var tool in evalStats.tools) {

                        evalStats.tools[tool].StartedPer = textHelpers.round10((evalStats.tools[tool].Started / evals.length) * 100, 0);
                        evalStats.tools[tool].CompletedPer = textHelpers.round10((evalStats.tools[tool].Completed / evals.length) * 100, 0);

                    }

                    evalStats.evalCount = evals.length;
                    evalStats.averagePerComplete = textHelpers.round10((maxstatus / evals.length), 0);


                    return next();


                }


            });

        
        });
		
		
        sess.evalStats = evalStats;
   
   
}

module.exports = getAllEvalStats;

function UpdateStats(vtool, evalStats) {

	for (var tool in evalStats.tools) {
		if (evalStats.tools[tool].ToolName === vtool.name) {
			evalStats.tools[tool].Started = evalStats.tools[tool].Started + (vtool.status.toLowerCase() === "started" ? 1 : 0); 
			evalStats.tools[tool].Completed = evalStats.tools[tool].Completed + (vtool.status.toLowerCase() === "completed" ? 1 : 0); 
		} 			
	}

    return evalStats;

};