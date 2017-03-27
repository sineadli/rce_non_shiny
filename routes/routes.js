
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

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
                req.user.last_url = '';
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

	app.get('/TermsOfUse', function (req, res) {
        var user;
        if (req.user) user = req.user
        // render the page and pass in any flash data if it exists
        res.render('TermsOfUse.html', { user: user });
    });
	app.get('/PrivacyPolicy', function (req, res) {
        var user;
        if (req.user) user = req.user
        // render the page and pass in any flash data if it exists
        res.render('PrivacyPolicy.html', { user: user });
    });
	app.get('/About', function (req, res) {
        var user;
        if (req.user) user=req.user
        // render the page and pass in any flash data if it exists
        res.render('About.html', { user: user });
    });
	app.get('/PreviewTools', function (req, res) {
        var user;
        if (req.user) user = req.user
        // render the page and pass in any flash data if it exists
        res.render('PreviewTools.html', { user: user });
    });
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }), function (req, res) {
        //console.log(req.path);
        //console.log(req.user.isInterrupted);
       // res.redirect(req.flash('redirectTo')); 
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
       // console.log(req.body);
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

        if (req.body.receive_update) req.user.receive_update = req.body.receive_update;
        if (req.body.organiztion_type) req.user.profile.organiztion_type = req.body.organiztion_type;
        if (req.body.organiztion_type_other) req.user.profile.organiztion_type_other = req.body.organiztion_type_other;
        // req.user.profile.user_pic.data = fs.readFile('../50183_RCE/public/image/me.jpg');
        // req.user.profile.user_pic.contentType = 'image/jpg'=
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
        async.waterfall([
            function(done) {
                var transport = nodemailer.createTransport({
                    // service: '???',
                    port: 25, //confirm with company or 465?
                     host: 'localhost' //for qa server
                    //host: 'intrelay.mathematica-mpr.com' //for local
                    // host: 'smtp.mathematica-mpr.com',
                    //auth: {
                    //    user: '???',    //get this from ITS?
                    //    pass: '???'
                    //}
                });
                var mailOptions = {
                    to: "EdTechRCE@mathematica-mpr.com",
                    from: 'intrelay.mathematica-mpr.com',
                    subject: 'RCE Feedback',
                    text: 'Feedback from ' + req.body.user_email + ' viewing ' + req.body.page + '\n\n' + req.body.message

                };

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
        //console.log(req.params.coachStep);
        res.render('partials/header.html', { user: req.user });
    });

    app.get('/error', function (req, res) {
        var user;
        if (req.user) user = req.user;
        // render the page and pass in any flash data if it exists
        res.render('errors.html', { user: user });
    });
	
}

