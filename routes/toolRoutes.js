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
        res.render('determine_your_approach.html', { probAppr: sess.eval.probAppr, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title });
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
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                //add/update the probAppr within eval
                if (!eval.probAppr) {
                    probAppr = {
                        "Prob_Appr_A": obj.Prob_Appr_A, "Prob_Appr_B": obj.Prob_Appr_B,
                        "Prob_Apprr_B_other": obj.Prob_Apprr_B_other, "Prob_Apprr_C": obj.Prob_Apprr_C,
                        "created_at":dt
                    };
                }
                else {
                    probAppr = {
                        "Prob_Appr_A": obj.Prob_Appr_A, "Prob_Appr_B": obj.Prob_Appr_B,
                        "Prob_Apprr_B_other": obj.Prob_Apprr_B_other, "Prob_Apprr_C": obj.Prob_Apprr_C,
                        "created_at": eval.probAppr.created_at, "updated_at": dt
                    };
                }
                eval.probAppr = probAppr;
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    return res.redirect('/wizard');
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });
    });
    app.get('/craft_your_research_q', isLoggedIn, function (req, res) {
		sess = req.session;
        sess.eval.last_step = 3;
        sess.last_tool = "Craft Your Research Question";
        res.render('craft_your_research_q.html', { planQuestion: sess.eval.planQuestion, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title });
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
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    return res.redirect('/wizard');
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
        sess.last_tool = "How to Use Your Results";
        res.render('plan_next_steps.html', { planNext: sess.eval.planNext, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title, planQuestion: sess.eval.planQuestion  });
    });
    app.post('/plan_next_steps', isLoggedIn, function (req, res) {
        var toollist = { "name": "How to Use Your Results", "status": req.body.status, "visited_at": new Date() };
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
				sess.last_tool = "How to Use Your Result";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "How to Use Your Results" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
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
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    return res.redirect('/wizard');
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
        res.render('context_and_usage.html', { planContext: sess.eval.planContext, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title, planQuestion: sess.eval.planQuestion });
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
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    return res.redirect('/wizard');
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
        res.render('matching.html', { probAppr: sess.eval.probAppr, start_date: sess.eval.created_at, status: sess.eval.status, title: sess.eval.title, planQuestion: sess.eval.planQuestion });
    });
};

