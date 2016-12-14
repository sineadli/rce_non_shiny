
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

// routes/coachRoutes.js
// load up things we need
var isLoggedIn = require('../middleware/isLoggedIn.js');
var getCurrentEvaluation = require('../middleware/getCurrentEvaluation.js');
var getAllEvaluations = require('../middleware/getAllEvaluations.js');
var noCache = require('../middleware/noCache.js');
var recordURL = require('../middleware/recordURL.js');

var CoachStep = require('../models/coachStep'),
    Tool = require('../models/tool.js');
var Evaluation = require('../models/evaluation');   // the evaluation should go away to middleware
var sess;

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function(a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

module.exports = function (app, passport) {
    app.use(noCache);
    app.use(isLoggedIn);
    app.use(recordURL);

    //dashboard, require logged in and get current evaluation
   // app.use(getCurrentEvaluation);
    app.get('/dashboard',  getCurrentEvaluation,  function (req, res) {
        sess = req.session;
        res.render('dashboard.html', { user: req.user, eval: sess.eval });
    });

    app.get('/evaluations', getAllEvaluations, function (req, res) {
        sess = req.session;
       // console.log(sess.evals)
        res.render('evaluations.html', { user: req.user, evals: sess.evals });
    });


    app.get('/coach',  getCurrentEvaluation, function (req, res) {
		sess = req.session;
		//console.log(sess.eval);
		//console.log(sess);
		if (!sess.step) { sess.step = 1 }
		if (!sess.last_tool) {sess.last_tool = "none"}
      
        CoachStep.find(function (err, coachSteps) {
			if (err) {
                res.status(500).send(err);
            }
			else {
				//console.log(CoachSteps);
				
                res.render('coach.html', { user: req.user.local.email, coachSteps: coachSteps, eval: sess.eval });
            }
        });

    });
    app.get('/coach/:id', function (req, res) {
        sess = req.session;
        Evaluation.findOne({ _id: req.params.id }, function (err, eval) {
            sess.eval = eval;
            sess.step = 1;
            sess.last_tool = "none";
            req.user.evalid = eval._id;
            req.user.save();
            CoachStep.find(function (err, CoachSteps) {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    //console.log(CoachSteps);
                    res.render('coach.html', { user: req.user.local.email, CoachSteps: CoachSteps, eval: sess.eval});
                }
            });
        });
    });

    // this is for returning the partial view tool.html on the coach.html
    app.get('/tools/:coachStep',  function (req, res) {
        //console.log(req.params.coachStep);
        sess = req.session;
        var coachStep;
      
        CoachStep.findOne({ step: req.params.coachStep }, function (err, coach) {
			if (err) {
                res.status(500).send(err);
            }
            else {
              // console.log(CoachStep);
                coachStep = coach;
                Tool.find({ coachStep: req.params.coachStep }, function (err, tools) {
                    if (err) {

                        res.status(500).send(err);
                    }
                    else {
                       // if (coachStep.step === 5 && eval.evalPath !=="") { tools = tools.filter(function (x) { return x.evalPath === sess.eval.evalPath; }); console.log(tools);}
                        
						tools.sort(dynamicSort("order"));
                        res.render('partials/tool.html', { coachStep: coachStep, tools: tools, eval:sess.eval });
                    }
                });
            }
        });
    });

    //this route is update evaluation object, it is called from dashboard.html and coach.html
    //new or change title only
    app.post('/api/eval',  function (req, res) {
        sess = req.session;
        // console.log(req.body.id);
        if (!req.body.id) {
            var eval = new Evaluation({ userid: req.user._id, title: req.body.title, status: '0' });
            console.log(eval);
            eval.save(function (err) {
                if (err)
                    console.log(err);
                else {
                    sess.eval = eval;
                    req.user.evalid = eval._id;
                    req.user.save();
                    res.status(201).send(eval);
                }
            });
        }
        else {
            Evaluation.findById(req.body.id, function (err, eval) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (!eval) {
                        eval = new Evaluation({ _id: req.body.id, userid: req.user._id });
                    }
                    eval.title = req.body.title;
                    sess.eval = eval;
                    eval.save(function (err) {
                        if (err)
                            console.log(err);
                        else {
                            sess.eval = eval;
                            res.status(201).send(eval);
                        }
                    });
                }

            });
        }

    });
    


	
   

   
};







