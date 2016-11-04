function recordURL(req, res, next) {
    User.findOne({ '_id': req.user._id }, function (err, user) {
        var url = req.url;
        if (url.indexOf("tool") > -1) { url = "/wizard"; }
        user.last_url = url;
        user.save(function (err) {
            if (err)
                console.log("error saving last url");
            return next();
        });       
    })
}

module.exports = recordURL;