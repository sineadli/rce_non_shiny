
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
var getAllPublications = require('../middleware/getAllPublications.js');
var noCache = require('../middleware/noCache.js');

var Evaluation = require('../models/evaluation');   // the evaluation should go away to middleware
var sess;



module.exports = function (app, passport) {
    app.use(noCache);
  
    //dashboard, require logged in and get current evaluation
   // app.use(getCurrentEvaluation);
    app.get('/dashboard', isLoggedIn, getAllEvaluations,  function (req, res) {
        sess = req.session;
        res.render('dashboard.html', { user: req.user, evals: sess.evals });
    });

    app.get('/evaluations', isLoggedIn, getAllEvaluations, function (req, res) {
        sess = req.session;
        res.render('evaluations.html', { user: req.user, evals: sess.evals });
    });

    app.get('/publications', isLoggedIn, getAllPublications, function (req, res) {
        sess = req.session;
        query = require('url').parse(req.url, true).query;

        res.render('publications.html', { user: req.user, publishlists: sess.publishlists, obj: query },
            function (err, html) {
                if (err) { res.redirect('/error'); } else { res.send(html); }
            });
    });
    

    app.get('/coach', isLoggedIn, getCurrentEvaluation, function (req, res) {
		sess = req.session;
		if (!sess.step) { sess.step = 2 }
		if (!sess.last_tool) {sess.last_tool = "none"}
        console.log(req.user);
        res.render('coach.html', { user: req.user, coachSteps: sess.coachsteps, eval: sess.eval, step: sess.step 
            });

    });
    app.get('/coach/:id', isLoggedIn, function (req, res) {
        sess = req.session;
		Evaluation.findOne({ _id: req.params.id }, function (err, eval) {
			console.log("in get coach with id: " + eval.title);
            sess.eval = eval;
            sess.step = eval.last_step;
            if (!sess.step) sess.step = 2;
            sess.last_tool = "none";
			req.user.evalid = eval._id;
			eval.updated_at = new Date();
            eval.save();
            req.user.save();
            res.render('coach.html', { user: req.user, coachSteps: sess.coachsteps, eval: sess.eval, step: sess.step });
        });
    });

	// this is for returning the partial view tool.html on the coach.html
    app.get('/tools/:coachStep', isLoggedIn, function (req, res) {

		sess = req.session;
        var coachStep = sess.coachsteps.filter(function (x) { return (x.step === req.params.coachStep) }); 
        var tools = sess.tools.filter(function (x) { return (x.coachStep == req.params.coachStep) });     
        res.render('partials/tool.html', { coachStep: coachStep, tools: tools, eval: sess.eval });
	});

    //this route is update evaluation object, it is called from dashboard.html and coach.html
    //new or change title only
    app.post('/api/eval', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.step = 2;
        if (!req.body.id) {
			var eval = new Evaluation({ userid: req.user._id, title: req.body.title, status: '0' });
			// Pre-populate milestones. Moved from get current eval.
			if (eval.evalPlan.Milestones.length == 0) {
				for (var i = 0; i < 12; i++) {
					var m = ({
						Order:
 i + 1,
						Milestone_Name:
 '',
						Complete_Date:
 '',
						Assigned_To:
 '',
						Status:
 '',
						Notes:
 '',
						Hide:
 ''
					});
					
					eval.evalPlan.Milestones.push(m);
				}
			}

            eval.save(function (err) {
                if (err)
                    console.log(err);
				else {
					console.log("in post api eval");
                    sess.eval = eval;
                    req.user.evalid = eval._id;
					req.user.save();
					eval.updated_at = new Date();
                    eval.save();
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
					console.log("in post eval find by id");
                    eval.title = req.body.title;
					sess.eval = eval;
					eval.updated_at = new Date();
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

    app.post('/api/delEval', isLoggedIn, function (req, res) {
        Evaluation.remove({ _id: req.body.id}, function (err) {
            if (err)
                console.log(err);
            else {
                console.log("Selected evaluation deleted.");
                res.status(201).send("Selected evaluation deleted.");
            }
        });
    })
    
       
};







