
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

//routes/toolRoutes.js
// load up the thing we need
var fs = require('fs');
var async = require('async');
var Evaluation = require('../models/evaluation.js');
var isLoggedIn = require("../middleware/isLoggedIn.js");
var getCurrentEvaluation = require('../middleware/getCurrentEvaluation.js');
var sess;
//please note that req.session.step is for managing the active tab for wizard.html
//the following defines the tool routes available, only four routes available currently
module.exports = function (app, passport) {
    app.use(isLoggedIn);
    app.use(getCurrentEvaluation);
    //02.03 determine your approach
    app.get('/determine_your_approach',   function (req, res) {
        sess = req.session;
        sess.eval.last_step = 2;
        sess.eval.last_tool = "Determine Your Approach";
        res.render('determine_your_approach.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage') });
    });
    app.post('/determine_your_approach',  function (req, res) {
        sess = req.session;
        var obj = req.body, probAppr;
        var toollist = { "name": "Determine Your Approach", "status": req.body.status, "visited_at": new Date() };
        var dt = new Date();
        // console.log(sess.eval)
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/wizard');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/wizard');
                        }
                        return done(err, eval);
                    });                      
                }
                else
                    res.redirect('/wizard');                     
            },
            function (eval, done) {
                //eval find so update the toolsVisisted accordingly
				eval.last_step = 2;
                eval.last_tool = "Determine Your Approach";
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Determine Your Approach" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status == "completed") toollist = { "name": "Determine Your Approach", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                //add/update the probAppr within eval
                if (!eval.probAppr) {
                    probAppr = {
                        "Prob_Appr_Pre1": obj.Prob_Appr_Pre1, "Prob_Appr_Pre2": obj.Prob_Appr_Pre2,
                        "Prob_Appr_A": obj.Prob_Appr_A, "Prob_Appr_B": obj.Prob_Appr_B,
                        "Prob_Appr_B_other": obj.Prob_Appr_B_other, "Prob_Appr_C": obj.Prob_Appr_C,
                        "Prob_Appr_D": obj.Prob_Appr_D, "Prob_Appr_E": obj.Prob_Appr_E, "Prob_Appr_F": obj.Prob_Appr_F,
                        "created_at":dt
                    };
                }
                else {
                    probAppr = {
                        "Prob_Appr_Pre1": obj.Prob_Appr_Pre1, "Prob_Appr_Pre2": obj.Prob_Appr_Pre2,
                        "Prob_Appr_A": obj.Prob_Appr_A, "Prob_Appr_B": obj.Prob_Appr_B,
                        "Prob_Appr_B_other": obj.Prob_Appr_B_other, "Prob_Appr_C": obj.Prob_Appr_C,
                        "Prob_Appr_D": obj.Prob_Appr_D, "Prob_Appr_E": obj.Prob_Appr_E, "Prob_Appr_F": obj.Prob_Appr_F,
                        "created_at": eval.probAppr.created_at, "updated_at": dt
                    };
                }
                eval.probAppr = probAppr;
                if (eval.stepsclicked.indexOf(2) < 0) eval.stepsclicked.push(2);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
					sess.eval = eval;
                  //  console.log(eval);
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/determine_your_approach');
                    }
                    else {
                        return res.redirect('/wizard');
                    }
                    
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });
	});
	
	app.post('/pdf_view',  function (req, res) {
		sess = req.session;
		var obj = req.body;
		var toollist = { "name": obj.tname, "status": "completed", "visited_at": new Date() };
		var dt = new Date();
		//console.log(req.body);
		async.waterfall([
			function (done) {
				if (sess.eval) {
					Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
						if (!eval) {
                            res.status(404).send("Eval not found");
						}
						if (err) {
                            res.status(500).send(err);
						}
						return done(err, eval);
					});
				}
				else
                    res.status(404).send("Eval not found");
			},
			function (eval, done) {
				//console.log(eval);
				//eval find so update the toolsVisisted accordingly
				eval.last_step = obj.step;
				eval.last_tool = obj.tname;
				var tool = eval.toolsvisited.filter(function (x) { return x.name === obj.tname });
				//console.log(tool);
				if (tool.length == 0) {
					eval.toolsvisited.push(toollist);
				}
				else {
					var index = eval.toolsvisited.indexOf(tool[0]);
					if (index > -1) {
						if (tool[0].status == "completed") toollist = { "name": obj.tname, "status": "completed", "visited_at": new Date() };
						eval.toolsvisited.splice(index, 1);
						eval.toolsvisited.push(toollist);
					}
				}
				
				if (eval.stepsclicked.indexOf(obj.step) < 0) eval.stepsclicked.push(obj.step);
				eval.save(function (err) {
					if (err) {
                        res.status(500).send(err);
					}
					else {
                        sess.eval = eval;
                        //console.log(eval);
                        res.send(eval);
					}
                    
				});
			}
		], function (err) {
            res.status(500).send(err);
		});
	});

    app.get('/craft_your_research_q',  function (req, res) {
        sess = req.session;
        sess.eval.last_step = 3;
        sess.eval.last_tool = "Craft Your Research Question";
        res.render('craft_your_research_q.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage') });
    });
    //03.01 crafting a research question
    app.post('/craft_your_research_q',  function (req, res) {
        var toollist = { "name": "Craft Your Research Question", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 3;
        var obj = req.body;
        var dt = new Date();
        if (!obj.evalid) { obj.evalid = sess.eval._id; }
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/wizard');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/wizard');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/wizard');
            },
            function (eval, done) {
				eval.last_step = 3;
                eval.last_tool = "Craft Your Research Question";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Craft Your Research Question" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status == "completed") toollist = { "name": "Craft Your Research Question", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                //add/update the planQuestion within eval
                if (!eval.planQuestion) {
                    planQuestion = {
                        "Plan_Question_A": obj.Plan_Question_A, "Plan_Question_B_1": obj.Plan_Question_B_1,
                        "Plan_Question_B_Other": obj.Plan_Question_B_Other, "Plan_Question_B_2": obj.Plan_Question_B_2,
                        "Plan_Question_B_3": obj.Plan_Question_B_3, "Plan_Question_C": obj.Plan_Question_C,
                        "Plan_Question_D": obj.Plan_Question_D, "created_at": dt
                    };
                }
                else {
                    planQuestion = {
                        "Plan_Question_A": obj.Plan_Question_A, "Plan_Question_B_1": obj.Plan_Question_B_1,
                        "Plan_Question_B_Other": obj.Plan_Question_B_Other, "Plan_Question_B_2": obj.Plan_Question_B_2,
                        "Plan_Question_B_3": obj.Plan_Question_B_3, "Plan_Question_C": obj.Plan_Question_C,
                        "Plan_Question_D": obj.Plan_Question_D,
                        "created_at": eval.planQuestion.created_at, "updated_at": dt
                    };
                }
                eval.planQuestion = planQuestion;
                if (eval.stepsclicked.indexOf(3) < 0) eval.stepsclicked.push(3);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Changes Saved.')
                        return res.redirect('/craft_your_research_q');
                    }
                    else {
                        return res.redirect('/wizard');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });
    });
    //03.02 plan next steps
    app.get('/plan_next_steps',  function (req, res) {
        sess = req.session;
        sess.eval.last_step = 3;
        sess.eval.last_tool = "Think About How to Use Your Result";
        res.render('plan_next_steps.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage')  });
    });
    app.post('/plan_next_steps',  function (req, res) {
        var toollist = { "name": "Think About How to Use Your Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 3;
        var obj = req.body;
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/wizard');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/wizard');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/wizard');
            },
            function (eval, done) {
				eval.last_step = 3;
                eval.last_tool = "Think About How to Use Your Result";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Think About How to Use Your Results" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status == "completed") toollist = { "name": "Think About How to Use Your Results", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                //add/update the planQuestion within eval
                if (!eval.planNext) {
                    planNext = {
                        "Plan_Next_A_1": obj.Plan_Next_A_1, "Plan_Next_A_2": obj.Plan_Next_A_2,
                        "Plan_Next_A_3": obj.Plan_Next_A_3, "Plan_Next_A_4": obj.Plan_Next_A_4,
                        "Plan_Next_B": obj.Plan_Next_B, "Plan_Next_C_1": obj.Plan_Next_C_1,
                        "Plan_Next_C_2": obj.Plan_Next_C_2, "Plan_Next_D_1": obj.Plan_Next_D_1,
			            "Plan_Next_D_2": obj.Plan_Next_D_2, "Plan_Next_D_3": obj.Plan_Next_D_3,
                        "created_at": dt
                    };
                }
                else {
                    planNext = {
                        "Plan_Next_A_1": obj.Plan_Next_A_1, "Plan_Next_A_2": obj.Plan_Next_A_2,
                        "Plan_Next_A_3": obj.Plan_Next_A_3, "Plan_Next_A_4": obj.Plan_Next_A_4,
                        "Plan_Next_B": obj.Plan_Next_B, "Plan_Next_C_1": obj.Plan_Next_C_1,
                        "Plan_Next_C_2": obj.Plan_Next_C_2, "Plan_Next_D_1": obj.Plan_Next_D_1,
			            "Plan_Next_D_2": obj.Plan_Next_D_2, "Plan_Next_D_3": obj.Plan_Next_D_3,
                        "created_at": eval.planNext.created_at, "updated_at": dt
                    };
                }
                eval.planNext = planNext;
                if (eval.stepsclicked.indexOf(3) < 0) eval.stepsclicked.push(3);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Changes Saved.')
                        return res.redirect('/plan_next_steps');
                    }
                    else {
                        return res.redirect('/wizard');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });
    });
    //03.03 context and usage
    app.get('/context_and_usage',  function (req, res) {
        sess = req.session;
        sess.eval.last_step = 3;
        sess.eval.last_tool = "Summarize Context";
        res.render('context_and_usage.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage') });
    });
    app.post('/context_and_usage',  function (req, res) {
        var toollist = { "name": "Summarize Context", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 3;
        var obj = req.body;
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/wizard');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/wizard');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/wizard');
            },
            function (eval, done) {
				eval.last_step = 3;
                eval.last_tool = "Summarize Context";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Summarize Context" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) { 
                        if (tool[0].status == "completed") toollist = { "name": "Summarize Context", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                //add/update the planQuestion within eval
                if (!eval.planContext) {
                    planContext = {
                        "Plan_Context_A_1": obj.Plan_Context_A_1, "Plan_Context_A_2": obj.Plan_Context_A_2,
                        "Plan_Context_A_3": obj.Plan_Context_A_3, "Plan_Context_A_4": obj.Plan_Context_A_4,
                        "Plan_Context_A_5": obj.Plan_Context_A_5, "Plan_Context_A_6": obj.Plan_Context_A_6,
                        "Plan_Context_B": obj.Plan_Context_B, "Plan_Context_C": obj.Plan_Context_C,
                        "Plan_Context_D": obj.Plan_Context_D, "created_at": dt

                    };
                }
                else {
                    planContext = {
                        "Plan_Context_A_1": obj.Plan_Context_A_1, "Plan_Context_A_2": obj.Plan_Context_A_2,
                        "Plan_Context_A_3": obj.Plan_Context_A_3, "Plan_Context_A_4": obj.Plan_Context_A_4,
                        "Plan_Context_A_5": obj.Plan_Context_A_5, "Plan_Context_A_6": obj.Plan_Context_A_6,
                        "Plan_Context_B": obj.Plan_Context_B, "Plan_Context_C": obj.Plan_Context_C,
                        "Plan_Context_D": obj.Plan_Context_D,
                        "created_at": eval.planContext.created_at, "updated_at": dt
                    };
                }
                eval.planContext = planContext;
                if (eval.stepsclicked.indexOf(3) < 0) eval.stepsclicked.push(3);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {

                        req.flash('saveMessage', 'Changes Saved.')
                        return res.redirect('/context_and_usage');
                    }
                    else {
                        return res.redirect('/wizard');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });
    });
    app.get('/matching', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 5;
        sess.eval.last_tool = "Matching";
        res.render('matching.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage')  });
    });
    app.post('/matching', function (req, res) {
        var toollist = { "name": "Matching", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.eval.step = 5;      
        var obj = req.body;
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/wizard');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/wizard');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/wizard');
            },
            function (eval, done) {
                eval.last_step = 5;
                eval.last_tool = "Matching";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Matching" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status == "completed") toollist = { "name": "Matching", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                if (!eval.matching) {
                    matching = {
                        "Q_M_1": obj.Q_M_1,
                        "Q_M_2": obj.Q_M_2,
                        "Q_9": obj.Q_9,
                        "treat_var": obj.treat_var,
                        "match_vars": obj.match_vars,
                        "grade_var": obj.grade_var,
                        "n_full": obj.n_full,
                        "n_full_treat": obj.n_full_treat,
                        "n_matched": obj.n_matched,
                        "n_matched_treat": obj.n_matched_treat,
                        "Result":obj.result,
                        "created_at": dt

                    };
                }
                else {
                    matching = {
                        "Q_M_1": obj.Q_M_1,
                        "Q_M_2": obj.Q_M_2,
                        "Q_9": obj.Q_9,
                        "treat_var": obj.treat_var,
                        "match_vars": obj.match_vars,
                        "grade_var": obj.grade_var,
                        "n_full": obj.n_full,
                        "n_full_treat": obj.n_full_treat,
                        "n_matched": obj.n_matched,
                        "n_matched_treat": obj.n_matched_treat,
                        "Result": obj.result,
                        "created_at": eval.matching.created_at, "updated_at": dt
                    };
                }
                eval.matching = matching;
                if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
                console.log(eval);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
					sess.eval = eval;

                    if (req.body.status == "started") {

                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/matching');
                    }
                    else {
                        return res.redirect('/wizard');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });
    });
    app.get('/getresult', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 5;
        sess.eval.last_tool = "Get Results";
        res.render('getresult.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage') });
    });
    app.post('/getresult', function (req, res) {
        console.log(req);
        var toollist = { "name": "Get Results", "status": req.body.status, "visited_at": new Date() };
        console.log(req);
        sess = req.session;
        sess.step = 5;
        var obj = req.body;
        console.log(obj);
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/wizard');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/wizard');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/wizard');
            },
            function (eval, done) {
                eval.last_step = 5;
                eval.last_tool = "Get Results";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Get Results" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status == "completed") toollist = { "name": "Get Results", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                eval.planQuestion.Plan_Question_B_2 = obj.Plan_Question_B_2;
                eval.planQuestion.Plan_Question_B_3 = obj.Plan_Question_B_3;
                eval.planNext.Plan_Next_B = obj.Plan_Next_B;
                eval.planNext.Plan_Next_C_1 = obj.Plan_Next_C_1;
                if (!eval.getresult) {
                    getresult = {

                        "Result": obj.result,
                        "created_at": dt

                    };
                }
                else {

                    getresult = {

                        "Result": obj.result,
                        "created_at": eval.getresult.created_at, "updated_at": dt
                    };
                }
                eval.getresult = getresult;
                if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {

                        req.flash('saveMessage', 'Changes Saved.')
                        return res.redirect('/getresult');
                    }
                    else {
                        return res.redirect('/wizard');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });
    });
    app.get('/shareresult', function (req, res) {
        sess = req.session;
        sess.eval.last_step = 6;
        sess.eval.last_tool = "Share Your Results";
        res.render('shareresult.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage') });
    });
    app.post('/shareresult',function (req, res) {
        var toollist = { "name": "Share Your Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.eval.last_step = 6;
        //var obj = req.body;
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/wizard');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/wizard');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/wizard');
            },
            function (eval, done) {
                eval.last_step = 6;
                eval.last_tool = "Share Your Results";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Share Your Results" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status == "completed") toollist = { "name": "Share Your Results", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                if (eval.stepsclicked.indexOf(6) < 0) eval.stepsclicked.push(6);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {

                        req.flash('saveMessage', 'Changes Saved.')
                        return res.redirect('/shareresult');
                    }
                    else {
                        return res.redirect('/wizard');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });
    });
};

