// routes/routes.js
// load up the evaluation model
var fs = require('fs');
var isLoggedIn = require("../middleware/isLoggedIn.js")
var sess;
module.exports = function(app, passport) {
    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('landing.html'); // load the ndex.html file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.html', { message: req.flash('loginMessage') }); 
    });

    // process the login form
     app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }), function(req, res){
         console.log('cookie: '+ res.cookie );
     });
    

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.html', { message: req.flash('signupMessage') });
    });

     // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        //console.log('cookie: ' + JSON.stringify(req.headers['cookie']));
        res.render('profile.html', {
            user : req.user // get the user out of session and pass to template
        });
    });
    app.post('/profile', isLoggedIn, function (req, res) {
        console.log(req.body);
        req.user.profile.organiztion_type = req.body.organiztion_type;
        req.user.profile.organiztion_type_other = req.body.organiztion_type_other;
        req.user.profile.role = req.body.role;
        req.user.profile.role_other = req.body.role_other;
        req.user.profile.organization_name = req.body.organization_name;
        
       // req.user.profile.user_pic.data = fs.readFile('../50183_RCE/public/image/me.jpg');
       // req.user.profile.user_pic.contentType = 'image/jpg'
        req.user.save();
        res.redirect('/dashboard');
    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        console.log(req.user);
        if (req.session) {
            if (req.user) {
                req.user.userSession = '';
                req.user.save();
            }
            req.session.destroy(function (err) {
                res.redirect('/');
            });
        }
       
    });
    // =====================================
    // FORGOT PASSWORD =====================
    // =====================================
    // for reset password
//    app.get('/forgot', function (req, res) {
  //    res.render('forgot.html', {
    //        user: req.user
      //  });
    //});
   
    //app.use(getEval);
    //non shiny tool routes, this route should go away!
    app.get('/index', isLoggedIn, function (req, res) {
        res.render('index.html', {
            user: req.user // get the user out of session and pass to template
        });

    });

};

