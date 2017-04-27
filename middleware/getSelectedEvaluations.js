
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

var getSelectedEvaluations = function (req, res, next) {
    sess = req.session;
    var sort = 1;
    var search = "";
    var query = require('url').parse(req.url, true).query;
    if (query.search) search = query.search;
    if (query.sort) sort = query.sort;

    if (search) {
        Evaluation.find({
            $or: [{ "basics.Basics_Tech_Name": { $regex: new RegExp(search, "i") } }, { "author": { $regex: new RegExp(search, "i") } }, { "company": { $regex: new RegExp(search, "i") } },
                { "planContext.Grades": { $regex: new RegExp(search, "i") } }, { "planContext.Outcomes": { $regex: new RegExp(search, "i") } }
                , { "planContext.District_State": { $regex: new RegExp(search, "i") } }
                , { "title": { $regex: new RegExp(search, "i") } }]
        }).sort({ "basics.Basics_Tech_Name": sort }).select("userid title status created_at basics.Basics_Tech_Name planContext").exec(function (err, evals) {
            if (err) {
                console.log(err);
                return next();
            } else {

                if (evals) { sess.evalLists = evals; return next(); }
                return next();
            }
        });
    }
    else {
        Evaluation.find().sort({ "basics.Basics_Tech_Name": sort }).select("userid title status created_at basics.Basics_Tech_Name planContext published_at author company").exec(function (err, evals) {
            if (err) {
                console.log(err);
                return next();
            } else {

                if (evals) { sess.evalLists = evals; return next(); }
                return next();
            }
        });
    }


};

module.exports = getSelectedEvaluations;



