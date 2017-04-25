
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

var User = require('../models/user');

var getAllUsers = function (req, res, next) {
    sess = req.session;
    var sort = 1;
    var search = "";
    var query = require('url').parse(req.url, true).query;
    if (query.search) search = query.search;
    if (query.sort) sort = query.sort;
    if (search)
    {
        User.find({
            $or: [{ "profile.user_name": { $regex: new RegExp(search, "i") } }, { "local.email": { $regex: new RegExp(search, "i") } }
                , { "profile.organization_name": { $regex: new RegExp(search, "i") } }
            ]
        }).sort({ "profile.user_name": 1 })
            .select("local.email profile.user_name profile.organization_name created_at profile.first_name profile.last_name")
            .exec(function (err, users) {
            if (err) {
                console.log(err);
                return next();
            } else {

                if (users) { sess.userLists = users; return next(); }
                return next();
            }
        });
    }
    else
    {
        User.find().sort({ "profile.user_name": 1 })
            .select("local.email profile.user_name profile.organization_name created_at profile.first_name profile.last_name")
            .exec(function (err, users) {
            if (err) {
                console.log(err);
                return next();
            } else {

                if (users) { sess.userLists = users; return next(); }
                return next();
            }
        });
    }
   
};

module.exports = getAllUsers;