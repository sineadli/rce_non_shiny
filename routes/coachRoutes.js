
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
var getAllEvalStats = require('../middleware/getAllEvalStats.js');
var getAllPublications = require('../middleware/getAllPublications.js');
var noCache = require('../middleware/noCache.js');
var getSelectedEvaluations = require('../middleware/getSelectedEvaluations.js');
var Evaluation = require('../models/evaluation');   // the evaluation should go away to middleware
var getEvalDefaults = require('../middleware/getEvalDefaults.js');
var isAdmin = require('../middleware/isAdmin.js');
var getAllUsers = require('../middleware/getAllUsers.js');
var User = require('../models/user');
var CoachStep = require('../models/coachStep.js');
var Tool= require('../models/tool.js');
var coachsteps = require('../middleware/coachsteps.js');
var Instrument = require('../models/instrument.js');
var mongoose = require('mongoose');
var sess;



module.exports = function (app, passport) {
    app.use(noCache);

    //dashboard, require logged in and get current evaluation
    // app.use(getCurrentEvaluation);
    app.get('/dashboard', isLoggedIn, getAllEvaluations, function (req, res) {
        sess = req.session;
        res.render('dashboard.html', { user: req.user, evals: sess.evals });
    });
    app.get('/admin', isLoggedIn, function (req, res) {
        sess = req.session;
        query = require('url').parse(req.url, true).query;
        res.render('adminDashboard.html', { user: req.user, evalLists: sess.evalLists, obj: "" });
    });

    app.post('/admin', isLoggedIn, getSelectedEvaluations, function (req, res) {
        
        sess = req.session;
       // console.log(req.body.search);
        res.render('adminDashboard.html', { user: req.user, evalLists: sess.evalLists, obj: "" });
    });
    app.get('/api/admin/:search', isLoggedIn, getSelectedEvaluations, function (req, res) {
        sess = req.session;
        query = require('url').parse(req.url, true).query;
        res.render('partials/evaluationListsforAdmin.html', { user: req.user, evalLists: sess.evalLists, obj: '' });
    });
    app.get('/userAdmin', isLoggedIn, getAllUsers, function (req, res) {
        sess = req.session;
        query = require('url').parse(req.url, true).query;
        //res.render("test.html");
        res.render('userAdminDashboard.html', { user: req.user, userLists: sess.userLists, obj: query });
    });
	app.get('/statsAdmin/:fid', isLoggedIn, getAllEvalStats, function (req, res) {
        sess = req.session;
        query = require('url').parse(req.url, true).query;
        //res.render("test.html");
        res.render('StatAdminDashboard.html', { user: req.user, evalStats: sess.evalStats, Title: sess.statsTitle, obj: query });
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
        if (!sess.step) { sess.step = 2; }
        if (!sess.last_tool) { sess.last_tool = "none" }
        res.render('coach.html', {
            user: req.user, coachSteps: sess.coachsteps, eval: sess.eval, step: sess.step
        });

    });
    app.get('/coach/:id', isLoggedIn, function(req, res) {
        sess = req.session;
      
        Evaluation.findOne({ _id: req.params.id }, function(err, eval) {
            //var eval = Evaluation.getById(req.params.id);
          //  console.log("In get Coach for specific evaluation");
           
			sess.eval = eval;
			
			
			// Set the default values and other computed values re-used in Coach
			getEvalDefaults(sess, req.user);
    
            sess.step = eval.last_step;
            if (!sess.step) sess.step = 2;
            sess.last_tool = eval.last_tool;
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
        res.render('partials/tool.html', { coachStep: coachStep, tools: tools, eval: sess.eval, user: req.user });
    });

    //this route is update evaluation object, it is called from dashboard.html and coach.html
    //new or change title only
    app.post('/api/eval', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.step = 2;
        if (!req.body.id) {
            var eval = new Evaluation({ userid: req.user._id, title: req.body.title, status: '0', trialflag: req.body.trialflag });
			  eval.updated_at = new Date();
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
                    eval.trialflag = req.body.trialflag;
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

    app.post('/api/delEval', isLoggedIn, function(req, res) {
        Evaluation.remove({ _id: req.body.id }, function(err) {
            if (err)
                console.log(err);
            else {
                console.log("Selected evaluation deleted.");
                res.status(201).send("Selected evaluation deleted.");
            }
        });
	});

    //db.evaluations.update({ _id: eval._id, "toolsvisited.name":"Share Your Results" }, { $set: { "toolsvisited.$.status": "started" } });
    app.post('/api/unshared', isLoggedIn, function(req, res) {
        Evaluation.update({ _id: req.body.id, "toolsvisited.name": "Share Your Results" }, { $set: { status: "73", "toolsvisited.$.status": "started", published_at: "" } }, function(err) {
            if (err)
                console.log(err);
            else {
                console.log(req.body.id + " unshared.");
                res.status(201).send("Selected evaluation unshared.");
            }
        });
    });

    app.post('/api/delUser', isAdmin, function (req, res) {
        Evaluation.remove({ userid: req.body.id }, function (err) {
            if (err)
                console.log(err);
            else {
                console.log("all evaluation for " + req.body.id + " deleted" );

            }
        });
        User.remove({ _id: req.body.id }, function (err) {
            if (err)
                console.log(err);
            else {
                console.log("Selected user deleted.");
                res.status(201).send("Selected user deleted.");
            }
        });
    })

    app.get('/api/setting/:id', isAdmin, function (req, res) {
        User.findOne({ _id: req.params.id }, function (err, user) {
            if (err)
                console.log(err);
            else {
                res.render('profileAndSetting.html', {
                    user: user, admin: req.user
                });
            }
        });
    })


    app.get('/coachstep', isAdmin, coachsteps, function (req, res) {
        CoachStep.find(function (err, coachSteps) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('coachstepAdmin.html', {
                    user: req.user,
                    lists: coachSteps
                });
            }
        });
       

    });

    app.post('/api/delCoachStep', isAdmin, function (req, res) {
        CoachStep.remove({ _id: req.body.id }, function (err) {
            if (err)
                console.log(err);
            else {

                console.log("Selected coach step deleted.");
                res.status(201).send("Selected coach step deleted.");
            }
        }
        );
    });

    app.post('/api/upsertCoachStep', isAdmin, function (req, res) {

        var query = { step: req.body.step };
        CoachStep.findOneAndUpdate(query, req.body, { upsert: true }, function (err) {
            if (err)
                console.log(err);
            else {

                res.status(201).send("Selected coach step updated/added.");
            }
        }
        );
    });

    //tool admin get, delet upsert
    app.get('/tool', isAdmin,  function (req, res) {
        sess = req.session;
        Tool.find(function (err, tools) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('toolAdmin.html', {
                    user: req.user,
                    lists: tools
                });
            }
        });
       

    });

    app.post('/api/delTool', isAdmin, function (req, res) {
        Tool.remove({ _id: req.body.id }, function (err) {
            if (err)
                console.log(err);
            else {

                console.log("Selected tool deleted.");
                res.status(201).send("Selected tool deleted.");
            }
        }
        );
    });

    app.post('/api/upsertTool', isAdmin, function (req, res) {
        var query = { coachStep: req.body.coachStep, order: req.body.order, name:req.body.name };
        if (req.body.id) {
            query = { _id: req.body.id };
        } 
        //  console.log(query);
        Tool.findOneAndUpdate(query, req.body, { upsert: true }, function (err) {
            if (err)
                console.log(err);
            else {

                res.status(201).send("Selected tool updated/added.");
            }
        }
        );
    });

    app.get('/table', isAdmin, function (req, res) {
        User.find().skip(50).limit(100).select("local.email profile.user_name receive_update profile.organization_name profile.role profile.role_other created_at profile.first_name profile.last_name").then(function (table) {

            res.json(table); // table.total, table.data
        })
    });
    app.get('/table1', isLoggedIn, getSelectedEvaluations, function (req, res) {
        sess = req.session;
        res.json(sess.evalLists);
    });

    app.get('/instrument', isAdmin, function (req, res) {
        sess = req.session;
        Instrument.find(function (err, instruments) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('InstrumentAdmin.html', {
                    user: req.user,
                    lists: instruments
                });
            }
        });


    });

    app.post('/api/delInstrument', isAdmin, function (req, res) {
        Instrument.remove({ _id: req.body.id }, function (err) {
            if (err)
                console.log(err);
            else {

                console.log("Selected tool deleted.");
                res.status(201).send("Selected tool deleted.");
            }
        }
        );
    });

    app.post('/api/upsertInstrument', isAdmin, function (req, res) {
        var query = { order: req.body.order, name: req.body.name };
        if (req.body.id) {
            query = { _id: req.body.id };
        }
        console.log(req.body);
        Instrument.findOneAndUpdate(query, req.body, { upsert: true }, function (err) {
            if (err)
                console.log(err);
            else {

                res.status(201).send("Selected instrument updated/added.");
            }
        }
        );
    });

    app.post('/api/copyEval', isLoggedIn, function (req, res) {

        Evaluation.findOne({
            _id: req.body.id
        })
            .then(function (eval) {
                eval._id = undefined;
                eval.title = req.body.title;
                eval.trialflag = req.body.trialflag;
                eval.created_at = new Date();
                eval.published_at = "";
                if (eval.status == "100") {  
                    eval.status = "73";                 
                    var tool = eval.toolsvisited.filter(function (x) { return x.name.toLowerCase() === "share your results" });

                    if (tool.length > 0) {
                      //  var toollist = { "name": "share your results" , "status": "started", "visited_at": new Date() };
                        tool.forEach(i => eval.toolsvisited.splice(eval.toolsvisited.indexOf(i), 1));             
                     //   eval.toolsvisited.push(toollist);
                        
                    }   
                   
                }
                return Evaluation.create(eval.toObject());
            }).then(function (eval) {
                sess.eval = eval;
                req.user.evalid = eval._id;
                req.user.save();
                return res.json({
                    success: true,
                    id: eval._id
                });
            }).catch(function (err) {
                console.log(err);
            });
    });
}







