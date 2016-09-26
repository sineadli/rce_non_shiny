// app/routes.js
// load up the evaluation model
var fs = require('fs');
var Evaluation = require('../models/evaluation');
var WizardStep = require('../models/wizardStep');

var ProbAppr = require('../models/probAppr.js'),
    PlanQuestion = require('../models/planQuestion.js'),
    PlanNext = require('../models/planNext.js'),
    PlanContext = require('../models/planContext.js');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('landing.html'); // load the index.html file
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
        //console.log('cookie: ' + JSON.stringify(req.headers));
        req.user.userSession = req.headers['cookie'];
        req.user.save();
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
        
        req.user.profile.user_pic.data = fs.readFile('../50183_RCE/public/image/me.jpg');
        req.user.profile.user_pic.contentType = 'image/jpg'
        req.user.save();
        res.redirect('/index');
    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {

        req.user.userSession='';
        req.user.save();
        req.session.destroy(function (err) {
            res.redirect('/'); 
        });
    });

    app.post('/landing', function (req, res) {
       // var param = req.param("foo");
        // render the page and pass in any flash data if it exists
        res.send({ foo: "testing" });
    });
   // app.use(getEval);
    //non shiny tool routes
    app.get('/index', isLoggedIn, function (req, res) {
        req.user.userSession = req.headers['cookie'];
        req.user.save();
        res.render('index.html', {
            user: req.user // get the user out of session and pass to template
        });

    });
    app.get('/determine_your_approach', isLoggedIn, function (req, res) {
        ProbAppr.findOne({ userid: req.user._id },
            function (err, probAppr) {
                if (err || !probAppr) res.render('determine_your_approach.html', { probAppr: new ProbAppr() });
                if (probAppr) {
                    console.log(probAppr)
                    res.render('determine_your_approach.html', { probAppr: probAppr })
                }
            }
            );
       

    });
    app.post('/determine_your_approach', isLoggedIn, function (req, res) {
        //req.body.userid = req.user._id;
        //var body = req.body;
        console.log(req.body);
        
        var obj = req.body;
        if (!obj.userid) {
            if (!obj.userid || obj.userid == '') obj.userid = req.user._id;
            var probAppr = new ProbAppr(req.body);
            probAppr.save(function (err) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/index');
            })
                }
        else {
            ProbAppr.findByIdAndUpdate(obj._id, obj, function (err) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/index');
            })
        }
        

    });
    app.get('/craft_your_research_q', isLoggedIn, function (req, res) {
        PlanQuestion.findOne({ userid: req.user._id},
            function (err, planQuestion) {
                if (err || !planQuestion) res.render('craft_your_research_q.html', { planQuestion: new PlanQuestion()});
                if (planQuestion) {
                    console.log(planQuestion)
                    res.render('craft_your_research_q.html', { planQuestion: planQuestion })
                }
            }
        );

        

    });

    app.post('/craft_your_research_q', isLoggedIn, function (req, res) {

        console.log(req.body);

        var obj = req.body;
        if (!obj.userid) {
            if (!obj.userid || obj.userid == '') obj.userid = req.user._id;
            var planQuestion = new PlanQuestion(req.body);
            planQuestion.save(function (err) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/index');
            })
        }
        else {
            PlanQuestion.findByIdAndUpdate(obj._id, obj, function (err) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/index');
            })
        }


    });
    app.get('/plan_next_steps', isLoggedIn, function (req, res) {
        PlanNext.findOne({ userid: req.user._id },
            function (err, planNext) {
                if (err || !planNext) res.render('plan_next_steps.html', { planNext: new PlanNext()});
                if (planNext) {
                    console.log(planNext)
                    res.render('plan_next_steps.html', { planNext: planNext })
                }
            }
        );

        

    });
    app.post('/plan_next_steps', isLoggedIn, function (req, res) {
        console.log(req.body);
        console.log(req.user._id);

        var obj = req.body;
        if (!obj.userid) {
            if (!obj.userid || obj.userid == '') obj.userid = req.user._id;
            var planNext = new PlanNext(req.body);
            planNext.save(function (err) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/index');
            })
        }
        else {
            PlanNext.findByIdAndUpdate(obj._id, obj, function (err) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/index');
            })
        }


    });
        


    app.get('/context_and_usage', isLoggedIn, function (req, res) {
        PlanContext.findOne({ userid: req.user._id },
            function (err, planContext) {
                if (err || !planContext) res.render('context_and_usage.html', { planContext: new PlanContext() });
                if (planContext) {
                    console.log(planContext)
                    res.render('context_and_usage', { planContext: planContext })
                }
            }
        );
        


    });
    app.post('/context_and_usage', isLoggedIn, function (req, res) {
        //console.log(req.body);
       // console.log(req.user._id);

        var obj = req.body;
        
        console.log(obj);
        if (!obj.userid) {
            if (!obj.userid || obj.userid == '') obj.userid = req.user._id;
            var planContext = new PlanContext(req.body);
            console.log(planContext);
            planContext.save(function (err) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/index');
            })
        }
        else {
            PlanContext.findByIdAndUpdate(obj._id, obj, function (err) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/index');
            })
        }


    });
    app.get('/getting_your_data_ready', isLoggedIn, function (req, res) {

        res.render('getting_your_data_ready.html');

    });

    app.get('/dashboard', isLoggedIn,  function (req, res) {

        res.render('dashboard.html', { user: req.user })

    });

    app.get('/planning', function (req, res) {

        res.render('planning.html')

    });

    app.get('/api/wizard', function (req, res) {

        WizardStep.find({}, function (err, wizardStep) {
            if (err) {

                res.status(500).send(err);
            }
            else {

                res.json(wizardStep);
            }
        });

    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated() )
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};
function getEval(req, res, isLoggedIn, next) {
    Evaluation.findOne({ userid: req.user._id }).sort({ created_at: -1 }).exec(function (error, eval) {
        if (eval) req.eval = eval;
    });
    next;
}
