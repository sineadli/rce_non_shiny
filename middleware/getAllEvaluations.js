// middleware/getAllEvaluations.js
//load the thing we need
var Evaluation = require('../models/evaluation');
var isLoggedIn = require('../middleware/isLoggedIn.js');


var getAllEvaluations = function (req, res, next) {
    sess = req.session;
    if (!sess.evals) {
        Evaluation.find({ userid: req.user._id }).sort({ created_at: -1 }).select( "title status created_at").exec(function (err, evals) {
            if (err) {
                console.log(err);
                return next();
            } else {

                if (evals) { sess.evals = evals; console.log(evals); return next(); }
                return next();
            }
        });
    }
    else {
        return next();
    }

};

module.exports = getAllEvaluations;



