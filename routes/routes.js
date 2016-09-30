// app/routes.js
// load up the evaluation model
var fs = require('fs');
var Evaluation = require('../models/evaluation');
var WizardStep = require('../models/wizardStep'),
    Tool = require('../models/tool.js');

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
        res.redirect('/dashboard');
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
    //app.use(getEval);
    //non shiny tool routes
    app.get('/index', isLoggedIn, function (req, res) {
        req.user.userSession = req.headers['cookie'];
        req.user.save();
        res.render('index.html', {
            user: req.user // get the user out of session and pass to template
        });

    });
    app.get('/determine_your_approach', isLoggedIn, function (req, res) {
        console.log(req.eval);
        ProbAppr.findOne({ userid: req.user._id},
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
                    res.redirect('/wizard');
            })
                }
        else {

            ProbAppr.findById(obj._id, function (err, probAppr) {
                if (err)
                    console.log(err);
                else if (probAppr) {
                    probAppr.Prob_Appr_A = obj.Prob_Appr_A;
                    probAppr.Prob_Appr_B = obj.Prob_Appr_B;
                    probAppr.Prob_Apprr_B_other = obj.Prob_Apprr_B_other;
                    probAppr.Prob_Apprr_C = obj.Prob_Apprr_C;
                    probAppr.save(function (err) { if (err) console.log(err); });
                    res.redirect('/wizard');
                }
            });
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
                    res.redirect('/wizard');
            })
        }
        else {
            PlanQuestion.findById(obj._id, function (err, planQuestion) {
                if (err)
                    console.log(err);
                else if (planQuestion) {
                    planQuestion.Plan_Question_A = obj.Plan_Question_A;
                    planQuestion.Plan_Question_B_1 = obj.Plan_Question_B_1;
                    planQuestion.Plan_Question_B_Other = obj.Plan_Question_B_Other;
                    planQuestion.Plan_Question_B_2 = obj.Plan_Question_B_2;
                    planQuestion.Plan_Question_B_3 = obj.Plan_Question_B_3;
                    planQuestion.Plan_Question_C = obj.Plan_Question_C;
                    planQuestion.Plan_Question_D = obj.Plan_Question_D;
                    planQuestion.save(function (err) { if (err) console.log(err); });
                    res.redirect('/wizard');
                }
            });
            
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

            PlanNext.findById(obj._id, function (err, planNext) {
                if (err)
                    console.log(err);
                else if (planNext) {
                    planNext.Plan_Next_A_1 = obj.Plan_Next_A_1;
                    planNext.Plan_Next_A_2 = obj.Plan_Next_A_2;
                    planNext.Plan_Next_A_3 = obj.Plan_Next_A_3;
                    planNext.Plan_Next_A_4 = obj.Plan_Next_A_4;
                    planNext.Plan_Next_B = obj.Plan_Next_B;
                    planNext.Plan_Next_C_1 = obj.Plan_Next_C_1;
                    planNext.Plan_Next_C_2 = obj.Plan_Next_C_2;
                    planNext.Plan_Next_D_1 = obj.Plan_Next_D_1;
                    planNext.Plan_Next_D_2 = obj.Plan_Next_D_2;
                    planNext.Plan_Next_D_3 = obj.Plan_Next_D_3;
                    planNext.save(function (err) { if (err) console.log(err); });
                    res.redirect('/wizard');
                }
            });
            
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

            PlanContext.findById(obj._id, function (err, planContext) {
                if (err)
                    console.log(err);
                else if (planContext) {
                    planContext.Plan_Context_A_1 = obj.Plan_Context_A_1;
                    planContext.Plan_Context_A_2 = obj.Plan_Context_A_2;
                    planContext.Plan_Context_A_3 = obj.Plan_Context_A_3;
                    planContext.Plan_Context_A_4 = obj.Plan_Context_A_4;
                    planContext.Plan_Context_A_5 = obj.Plan_Context_A_5;
                    planContext.Plan_Context_B = obj.Plan_Context_B;
                    
                    planContext.save(function (err) { if (err) console.log(err); });
                    res.redirect('/wizard');
                }
            });
            
        }


    });
    app.get('/getting_your_data_ready', isLoggedIn, function (req, res) {

        res.render('getting_your_data_ready.html');

    });

    app.get('/dashboard', isLoggedIn,  function (req, res) {

        res.render('dashboard.html', { user: req.user })

    });

    // this is for returning the partial view
    app.get('/tools/:wizardPath', function (req, res) {

        //console.log(req.params.wizardPath);
        var wizardStep;
        WizardStep.findOne({ step: req.params.wizardPath}, function (err, wizard) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                console.log(wizardStep);
                wizardStep = wizard;
            }
        });
        Tool.find({ wizardPath: req.params.wizardPath }, function (err, tools) {
            if (err) {

                res.status(500).send(err);
            }
            else {
                //console.log(tools);
                res.render('partials/tool.html', {wizardStep: wizardStep, tools: tools });
            }
        });


    });

    app.get('/wizard', isLoggedIn, function (req, res) {

      
   
        if (!req.eval) {
            Evaluation.findOne({ userid: req.user._id }).sort({ created_at: -1 }).exec(function (err, eval) {
                if (err) {
                    console.log(err);
                } else {
                   
                    if (eval) { req.eval = eval; }
                    else {
                        req.eval = new Evaluation({ userid: req.user._id, title: "Your New Eval " });
                        req.eval.save(function (err) { if (err) console.log(err);});
                    }
                   
                }

            });
        }

        WizardStep.find(function (err, wizardSteps) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                console.log(req.eval);
                res.render('wizard.html', { wizardSteps: wizardSteps, eval: req.eval });
            }


        });

        

    });


    //all api routes starting from here, will move to a controller, still having trouble set it up in the controller!
    //wizard and tool don't need authentication
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

    app.get('/api/wizard/:id',  function (req, res) {


        WizardStep.findById(req.params.id, function (err, wizardStep) {
            if (err) {

                res.status(500).send(err);
            }
            else {

                res.json(wizardStep);
            }
        });

    });

    app.post('/api/wizard', function (req, res) {

    
        var wizard = new WizardStep(req.body);

        wizard.save(function (err) {
            if (err)
                console.log(err);
            else
                res.status(201).send(wizard);


        });
    });
    app.get('/api/tools', function (req, res) {


        Tool.find({}, function (err, tools) {
            if (err) {

                res.status(500).send(err);
            }
            else {

                res.json(tools);
            }
        });

    });
    app.get('/api/tools/:wizardPath', function (req, res) {

        console.log(req.params.wizardPath);
        Tool.find({ wizardPath: req.params.wizardPath}, function (err, tool) {
            if (err) {

                res.status(500).send(err);
            }
            else {

                res.json(tool);
            }
        });

    });
    
    app.post('/api/tool', function (req, res) {

     
        var tool = new Tool(req.body);

        tool.save(function (err) {
            if (err)
                console.log(err);
            else
                res.status(201).send(tool);


        });
    });


    app.post('/api/eval', isLoggedIn, function (req, res) {

        console.log(req.body.id);
        Evaluation.findById(req.body.id, function (err, eval) {
            if (err) {
                console.log(err);
            }
            else {
                eval.title = req.body.title;
                eval.save(function (err) {
                     if (err)
                        console.log(err);
                else
                    req.eval = eval;
                    res.status(201).send(eval);});
            }

        });
     

  
        //eval.save(function (err) {
        //    if (err)
        //        console.log(err);
        //    else
        //        req.eval = eval;
        //        res.status(201).send(eval);


        //});
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
    if (!req.eval) {
        Evaluation.findOne({ userid: req.user._id }).sort({ created_at: -1 }).exec(function (eror, eval) {
            if (err) {
                console.log(err);
            } else {
                if (eval) { req.eval = eval; }
                else {
                    req.eval = new Evaluation({ userid: req.user._id, title: "Your New Eval " });
                }
                //console.log(req.eval);
            }
           
        });}
   
    next;
}
