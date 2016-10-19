// routes/routes.js
// load up the evaluation model
var fs = require('fs');
var isLoggedIn = require("../middleware/isLoggedIn.js");
var sess;
var nodemailer = require('nodemailer');

var async = require('async');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    //app.get('/', function(req, res) {
    //    res.render('landing.html'); // load the ndex.html file
    //});
    app.get('/', function(req, res) {
        if (req.session) {
            if (req.user) {
                req.user.userSession = '';
                req.user.save();
            }
            req.session.destroy(function(err) {
                res.render('index.html');;
            });
        }
        res.render('index.html'); // load the ndex.html file
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
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }), function(req, res) {
        console.log('cookie: ' + res.cookie);
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
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        //console.log('cookie: ' + JSON.stringify(req.headers['cookie']));
        res.render('profile.html', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.post('/profile', isLoggedIn, function(req, res) {
        console.log(req.body);
        req.user.profile.organiztion_type = req.body.organiztion_type;
        req.user.profile.organiztion_type_other = req.body.organiztion_type_other;
        req.user.profile.role = req.body.role;
        req.user.profile.role_other = req.body.role_other;
        req.user.profile.organization_name = req.body.organization_name;
        req.user.profile.user_name = req.body.user_name;

        // req.user.profile.user_pic.data = fs.readFile('../50183_RCE/public/image/me.jpg');
        // req.user.profile.user_pic.contentType = 'image/jpg'
        req.user.save();
        res.redirect('/dashboard');
    });

    //==========================================================
    //Profile and Setting
    //===========================================================
    app.get('/setting', isLoggedIn, function(req, res) {
        //console.log('cookie: ' + JSON.stringify(req.headers['cookie']));
        res.render('profileAndSetting.html', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.post('/setting', isLoggedIn, function(req, res) {


        if (req.body.email) req.user.local.email = req.body.email
        if (req.body.password) req.user.local.password = req.user.generateHash(req.body.password);
        if (req.body.role) req.user.profile.role = req.body.role;
        if (req.body.role_other) req.user.profile.role_other = req.body.role_other;
        if (req.body.organization_name) req.user.profile.organization_name = req.body.organization_name;
        if (req.body.first_name) {
            req.user.profile.first_name = req.body.first_name;
            req.user.profile.user_name = req.body.first_name;
        }
        if (req.body.last_name) {
            req.user.profile.last_name = req.body.last_name;
            req.user.profile.user_name = req.body.last_name;
        }
        if (req.body.first_name && req.body.last_name) req.user.profile.user_name = req.body.first_name + " " + req.body.last_name;

        // req.user.profile.user_pic.data = fs.readFile('../50183_RCE/public/image/me.jpg');
        // req.user.profile.user_pic.contentType = 'image/jpg'

        req.user.save(function(err) {
            if (err) console.log(err);
            res.redirect('/setting');
        });

    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        res.redirect('/');
    });

    // =====================================
    // FEEDBACK  =====================
    // =====================================
    app.post('/feedback', function(req, res, next) {
        console.log(req.body);
        async.waterfall([
            function(done) {
                var transport = nodemailer.createTransport({
                    // service: '???',
                    port: 25, //confirm with company or 465?
                    // host: 'edtechrce.org' //for qa server
                    host: 'intrelay.mathematica-mpr.com' //for local
                    // host: 'smtp.mathematica-mpr.com',
                    //auth: {
                    //    user: '???',    //get this from ITS?
                    //    pass: '???'
                    //}
                });
                var mailOptions = {
                    to: "bgelhard@mathematica-mpr.com",
                    from: 'intrelay.mathematica-mpr.com',
                    subject: 'RCE Feedback',
                    text: 'Feedback from ' + req.body.user_name + ' viewing ' + req.body.page + '\n\n' + req.body.message

                };
                console.log("feedback");
                try {
                    transport.sendMail(mailOptions, function(err) {
                        req.flash('info', 'Sent email with feedback from ' + req.body.user_email);
                        done(err, 'done');
                    });
                } catch (err) {
                    console.log(err);
                }

            }
        ], function (err) {
            console.log(err);
            res.redirect('/' + req.body.page);
        });
    });


//app.use(getEval);
    //non shiny tool routes, this route should go away!
    app.get('/index', isLoggedIn, function(req, res) {
        res.render('index.html', {
            user: req.user // get the user out of session and pass to template
        });

    });


    app.get('/header', function(req, res) {
        //console.log(req.params.wizardPath);
        res.render('partials/header.html', { user: req.user });
    });


}

