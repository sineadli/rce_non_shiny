//routes/toolRoutes.js
// load up the thing we need
var fs = require('fs');
var async = require('async');
var Evaluation = require('../models/evaluation.js');
var isLoggedIn = require("../middleware/isLoggedIn.js");
var sess;
//please note that req.session.step is for managing the active tab for wizard.html
//the following defines the tool routes available, only four routes available currently
module.exports = function (app, passport) {
    //02.03 determine your approach
    app.get('/determine_your_approach', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 2;
        sess.last_tool = "Determine Your Approach";
        res.render('determine_your_approach.html', { user: req.user.local.email, probAppr: sess.eval.probAppr, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title, message: req.flash('saveMessage') });
    });
    app.post('/determine_your_approach', isLoggedIn, function (req, res) {
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
                sess.last_tool = "Determine Your Approach";
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
                        "Prob_Appr_A": obj.Prob_Appr_A, "Prob_Appr_B": obj.Prob_Appr_B,
                        "Prob_Appr_B_other": obj.Prob_Appr_B_other, "Prob_Appr_C": obj.Prob_Apprr_C,
                        "created_at":dt
                    };
                }
                else {
                    probAppr = {
                        "Prob_Appr_A": obj.Prob_Appr_A, "Prob_Appr_B": obj.Prob_Appr_B,
                        "Prob_Appr_B_other": obj.Prob_Appr_B_other, "Prob_Appr_C": obj.Prob_Appr_C,
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
                    console.log(eval);
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Save Success!')
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
	
	app.post('/pdf_view', isLoggedIn, function (req, res) {
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
				//console.log(eval);
				//eval find so update the toolsVisisted accordingly
				eval.last_step = obj.step;
				sess.last_tool = obj.tname;
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
						console.log(err); return done(err);
					}
					else {
						console.log("redirect to wizard now.");
					    sess.eval = eval;
						return res.redirect('/wizard');
					}
                    
				});
			}
		], function (err) {
			console.log(err);
			if (err) return next(err);
			res.redirect('/wizard');
		});
	});

    app.get('/craft_your_research_q', isLoggedIn, function (req, res) {
		sess = req.session;
        sess.eval.last_step = 3;
		sess.last_tool = "Craft Your Research Question";
        console.log("sess.eval.planQuestion");
        res.render('craft_your_research_q.html', { user: req.user.local.email, planQuestion: sess.eval.planQuestion, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title, message: req.flash('saveMessage') });
    });
    //03.01 crafting a research question
    app.post('/craft_your_research_q', isLoggedIn, function (req, res) {
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
                sess.last_tool = "Craft Your Research Question";
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
                        req.flash('saveMessage', 'Save Success!')
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
    app.get('/plan_next_steps', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 3;
        sess.last_tool = "Think About How to Use Your Results";
        res.render('plan_next_steps.html', {user: req.user.local.email, planNext: sess.eval.planNext, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title, planQuestion: sess.eval.planQuestion, message: req.flash('saveMessage')  });
    });
    app.post('/plan_next_steps', isLoggedIn, function (req, res) {
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
                sess.last_tool = "Think About How to Use Your Result";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Think About How to Use Your Results" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status == "completed") toollist = { "name": "How to Use Your Results", "status": "completed", "visited_at": new Date() };
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
                        req.flash('saveMessage', 'Save Success!')
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
    app.get('/context_and_usage', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 3;
        sess.last_tool = "Summarize Context";
        res.render('context_and_usage.html', { user: req.user.local.email, planContext: sess.eval.planContext, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title, planQuestion: sess.eval.planQuestion, message: req.flash('saveMessage') });
    });
    app.post('/context_and_usage', isLoggedIn, function (req, res) {
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
                sess.last_tool = "Summarize Context";
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

                        req.flash('saveMessage', 'Save Success!')
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
        sess.last_tool = "Matching";
        res.render('matching.html', { user: req.user.local.email, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title, planQuestion: sess.eval.planQuestion, message: req.flash('saveMessage')  });
    });
    app.post('/matching', isLoggedIn, function (req, res) {
        var toollist = { "name": "Matching", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 5;
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
                eval.last_step = 5;
                sess.last_tool = "Matching";
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
                if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
					sess.eval = eval;

                    if (req.body.status == "started") {

                        req.flash('saveMessage', 'Save Success!');
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
        sess.last_tool = "Get Results";
        res.render('getresult.html', { user: req.user.local.email, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title, planQuestion: sess.eval.planQuestion, message: req.flash('saveMessage') });
    });
    app.post('/getresult', isLoggedIn, function (req, res) {
        var toollist = { "name": "Get Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 5;
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
                eval.last_step = 5;
                sess.last_tool = "Get Results";
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
                if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {

                        req.flash('saveMessage', 'Save Success!')
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
    app.get('/shareresult', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 6;
        sess.last_tool = "Share Your Results";
        res.render('shareresult.html', { user: req.user.local.email, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title, planQuestion: sess.eval.planQuestion, message: req.flash('saveMessage') });
    });
    app.post('/shareresult', isLoggedIn, function (req, res) {
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
                sess.last_tool = "Share Your Results";
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

                        req.flash('saveMessage', 'Save Success!')
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

