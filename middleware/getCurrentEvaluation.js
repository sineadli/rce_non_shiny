
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
    sess = req.session;  
    if (!sess.eval) {
        Evaluation.findOne({ _id: req.user.evalid }).exec(function (err, eval) {
            if (err) {
                console.log(err);
                return next();
            } else {

                if (eval) {
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



