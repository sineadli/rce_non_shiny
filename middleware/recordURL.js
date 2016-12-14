
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

function recordURL(req, res, next) {
    User.findOne({ '_id': req.user._id }, function (err, user) {
        var url = req.url;
        if (url.indexOf("tool") > -1) { url = "/coach"; }
        user.last_url = url;
        user.save(function (err) {
            if (err)
                console.log("error saving last url");
            return next();
        });       
    })
}

module.exports = recordURL;