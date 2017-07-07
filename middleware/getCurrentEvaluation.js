
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
var getEvalDefaults = require('../middleware/getEvalDefaults.js');


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
					getEvalDefaults(sess, req.user);
		
                    return next();
                }
                return next();
            }
        });

   
    
};

module.exports = getCurrentEvaluation;



