
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
	//console.log(sess); 
    if (!sess.eval) {
        Evaluation.findOne({ _id: req.user.evalid }).exec(function (err, eval) {
            if (err) {
                console.log(err);
                return next();
            } else {

                if (eval) {
					console.log(eval.toolsvisited);
					if (eval.evalPlan.Milestones.length == 0) {
						// create the 12 default milestones
						for (var i = 0; i < 12; i++) {
							var m = ({
								Order:
								0,
								Milestone_Name:
								'',
								Complete_Date:
								'',
								Assigned_To:
								'',
								Status:
								'',
								Notes:
								'',
								Hide:
								''
							});
							
							eval.evalPlan.Milestones.push(m);
						}
					}
                    sess.eval = eval;
                    req.user.evalid = eval._id;
                    req.user.save();
                    return next();
                }
                return next();
            }
        });
    }
    else {
        return next();}
    
};

module.exports = getCurrentEvaluation;



