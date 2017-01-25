
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

var getAllEvaluations = function (req, res, next) {
    sess = req.session;
   
        Evaluation.find({ userid: req.user._id }).sort({ updated_at: -1 }).select( "title status created_at").exec(function (err, evals) {
            if (err) {
                console.log(err);
                return next();
            } else {

                if (evals) { sess.evals = evals;  return next(); }
                return next();
            }
        });

   

};

module.exports = getAllEvaluations;



