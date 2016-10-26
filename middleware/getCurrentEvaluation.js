// middleware/getCurrentEvaluation.js
//load the thing we need
var Evaluation = require('../models/evaluation');
var isLoggedIn = require('../middleware/isLoggedIn.js');


var getCurrentEvaluation = function (req, res, next) {
    sess = req.session;  
    if (!sess.eval) {
        Evaluation.findOne({ userid: req.user._id }).sort({ created_at: -1 }).exec(function (err, eval) {
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



