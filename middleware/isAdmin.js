
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

// middleware/isAdmin.js

//check if user is logged in
var isAdmin= function (req, res, next) {
    // if user is authenticated in the session, carry on 
    console.log(req.headers.cookie);
    console.log(req.url);
    if (req.isAuthenticated() && req.user.isAdmin)
        return next();

    // if they aren't redirect them to the home page
    req.flash('loginMessage', 'You must be an admin to access.')
    res.redirect('/login');
};

module.exports = isAdmin;