// middleware/isLoggedIn.js

//check if user is logged in
var isLoggedIn = function (req, res, next) {
    // if user is authenticated in the session, carry on 
    console.log(req.headers.cookie);
    console.log(req.url);
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    req.flash('loginMessage', 'Oops, something unexpected happened. Please login to continue.')
    res.redirect('/login' );
};

module.exports = isLoggedIn;