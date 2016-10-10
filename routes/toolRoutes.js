// load up the thing we need
var fs = require('fs');
var async = require('async');
var ProbAppr = require('../models/probAppr.js'),
    PlanQuestion = require('../models/planQuestion.js'),
    PlanNext = require('../models/planNext.js'),
    PlanContext = require('../models/planContext.js'),
    Evaluation = require('../models/evaluation.js');
var isLoggedIn = require("../middleware/isLoggedIn.js");
var sess;
//please note that req.session.step is for managing the active tab for wizard.html
//the following defines the tool routes available, only four routes available currently
module.exports = function (app, passport) {
    //02.03 determine your approach
    app.get('/determine_your_approach', isLoggedIn, function (req, res) {
        sess = req.session;
        ProbAppr.findOne({ userid: req.user._id, evalid:sess.eval._id },
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
        
        var toollist = { "name": "Determine Your Approach", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
		sess.step = 2;
        var obj = req.body;
       // console.log(sess.eval)
        async.waterfall([
           // (() => {  }),
            function (done) {

                if (!obj.evalid) { obj.evalid = sess.eval._id; }

                if (!obj.userid) {
                    if (!obj.userid || obj.userid == '') obj.userid = req.user._id;
                    var probAppr = new ProbAppr(obj);
                    probAppr.save(function (err) {
                        if (err)
                            console.log(err);
                        //else

                         return   done(err);
                    })
                }
                else {

                    ProbAppr.findById(obj._id, function (err, probAppr) {
                        if (err) {
                            console.log(err);
                            return done(err);
                        }
                        else if (probAppr) {
                            probAppr.Prob_Appr_A = obj.Prob_Appr_A;
                            probAppr.Prob_Appr_B = obj.Prob_Appr_B;
                            probAppr.Prob_Apprr_B_other = obj.Prob_Apprr_B_other;
                            probAppr.Prob_Apprr_C = obj.Prob_Apprr_C;
                            probAppr.save(function (err) { if (err) console.log(err); return done(err); });
                           
                        }
                    });
                }
            },
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
                    } else {
                        if (eval) {
								eval.last_step = 2;
								sess.last_tool = "Determine Your Approach";
                            var tool = eval.toolsvisited.filter(function (x) { return x.name === "Determine Your Approach" });

                            if (tool.length == 0) {
									eval.toolsvisited.push(toollist);

                                eval.save(function (err) {
                                    if (err) console.log(err);

                                    sess.eval = eval;
                                    //console.log(sess.eval);
                                    //done(err, eval);
                                    return res.redirect('/wizard');
                                });
                            }
                            else {
                                var index = eval.toolsvisited.indexOf(tool[0]);
                                if (index > -1) {
                                    eval.toolsvisited.splice(index, 1);
                                    eval.toolsvisited.push(toollist);
                                    eval.save(function (err) {
                                        if (err) console.log(err);
                                        sess.eval = eval;
                                        // done(err, eval);
                                        return res.redirect('/wizard');
                                    });
                                }

                            }

                        }
                    }
                });
            };
        }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });
    });
    app.get('/craft_your_research_q', isLoggedIn, function (req, res) {
        sess = req.session;
        PlanQuestion.findOne({ userid: req.user._id,  evalid:sess.eval._id },
            function (err, planQuestion) {
                if (err || !planQuestion) res.render('craft_your_research_q.html', { planQuestion: new PlanQuestion() });
                if (planQuestion) {
                    console.log(planQuestion)
                    res.render('craft_your_research_q.html', { planQuestion: planQuestion })
                }
            }
        );
    });
    //03.01 crafting a research question
    app.post('/craft_your_research_q', isLoggedIn, function (req, res) {
        var toollist = { "name": "Crafting a Research Question", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 3;
        var obj = req.body;
        if (!obj.evalid) { obj.evalid = sess.eval._id; }
        async.waterfall([           
            function (done) {
                if (!obj.userid) {
                    if (!obj.userid || obj.userid == '') obj.userid = req.user._id;
                    var planQuestion = new PlanQuestion(obj);
                    planQuestion.save(function(err) {
                        if (err)
                            console.log(err);
                        else
                            done(err);
                    });
                }
                else {
                    PlanQuestion.findById(obj._id, function (err, planQuestion) {
                        if (err) {
                            console.log(err);
                            return done(err);
                        }
                        else if (planQuestion) {
                            planQuestion.Plan_Question_A = obj.Plan_Question_A;
                            planQuestion.Plan_Question_B_1 = obj.Plan_Question_B_1;
                            planQuestion.Plan_Question_B_Other = obj.Plan_Question_B_Other;
                            planQuestion.Plan_Question_B_2 = obj.Plan_Question_B_2;
                            planQuestion.Plan_Question_B_3 = obj.Plan_Question_B_3;
                            planQuestion.Plan_Question_C = obj.Plan_Question_C;
                            planQuestion.Plan_Question_D = obj.Plan_Question_D;
                            planQuestion.save(function (err) { if (err) console.log(err); return done(err);});
                           
                        }
                    });
                }
            },
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
                        } else {
                            if (eval) {
								eval.last_step = 3;
								sess.last_tool = "Crafting a Research Question";
                                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Crafting a Research Question" });

                                if (tool.length == 0) {
									eval.toolsvisited.push(toollist);
                                    eval.save(function (err) {
                                        if (err) console.log(err);

                                        sess.eval = eval;
                                        //console.log(sess.eval);
                                        //done(err, eval);
                                        return res.redirect('/wizard');
                                    });
                                }
                                else {
                                    var index = eval.toolsvisited.indexOf(tool[0]);
                                    if (index > -1) {
                                        eval.toolsvisited.splice(index, 1);
                                        eval.toolsvisited.push(toollist);
                                        eval.save(function (err) {
                                            if (err) console.log(err);
                                            sess.eval = eval;
                                            // done(err, eval);
                                            return res.redirect('/wizard');
                                        });
                                    }

                                }

                            }
                        }
                    });
                };
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });
    });
    //03.02 plan next steps
    app.get('/plan_next_steps', isLoggedIn, function (req, res) {
        sess = req.session;
        PlanNext.findOne({ userid: req.user._id, evalid: sess.eval._id },
            function (err, planNext) {
                if (err || !planNext) res.render('plan_next_steps.html', { planNext: new PlanNext() });
                if (planNext) {
                    console.log(planNext)
                    res.render('plan_next_steps.html', { planNext: planNext })
                }
            }
        );



    });
    app.post('/plan_next_steps', isLoggedIn, function (req, res) {
        var toollist = { "name": "Plan Next Steps", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 3;
        var obj = req.body;
        async.waterfall([
            function (done) {
                if (!obj.evalid) { obj.evalid = sess.eval._id; };

                if (!obj.userid) {
                    if (!obj.userid || obj.userid == '') obj.userid = req.user._id;
                    var planNext = new PlanNext(obj);
                    planNext.save(function (err) {
                        if (err)
                            console.log(err);
                        //else
                           done(err);
                    })
                }
                else {

                    PlanNext.findById(obj._id, function (err, planNext) {
                        if (err) {
                            console.log(err);
                            return done(err);
                        }
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
                            planNext.save(function (err) { if (err) console.log(err); done(err); });
                            
                        }
                    });

                }
            },
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
                        } else {
                            if (eval) {
								eval.last_step = 3;
								sess.last_tool = "Plan Next Steps";
                                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Plan Next Steps" });

                                if (tool.length == 0) {
									eval.toolsvisited.push(toollist);

                                    eval.save(function (err) {
                                        if (err) console.log(err);

                                        sess.eval = eval;
                                        //console.log(sess.eval);
                                        //done(err, eval);
                                        return res.redirect('/wizard');
                                    });
                                }
                                else {
                                    var index = eval.toolsvisited.indexOf(tool[0]);
                                    if (index > -1) {
                                        eval.toolsvisited.splice(index, 1);
                                        eval.toolsvisited.push(toollist);
                                        eval.save(function (err) {
                                            if (err) console.log(err);
                                            sess.eval = eval;
                                            // done(err, eval);
                                            return res.redirect('/wizard');
                                        });
                                    }

                                }

                            }
                        }
                    });
                };
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');});
   });
            //03.03 context and usage
    app.get('/context_and_usage', isLoggedIn, function (req, res) {
        sess = req.session;
        PlanContext.findOne({ userid: req.user._id, evalid: sess.eval._id },
            function (err, planContext) {
                if (err || !planContext) res.render('context_and_usage.html', { planContext: new PlanContext() });

                if (planContext) {
                    res.render('context_and_usage.html', { planContext: planContext })
                }
            }

        );
 });
    app.post('/context_and_usage', isLoggedIn, function (req, res) {
        var toollist = { "name": "Context and Usage", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 3;
        var obj = req.body;
        async.waterfall([
            function (done) {
                if (!obj.evalid) { obj.evalid = sess.eval._id; }
                if (!obj.userid) {
                    if (!obj.userid || obj.userid == '') obj.userid = req.user._id;
                    var planContext = new PlanContext(obj);
                    planContext.save(function (err) {
                        if (err)
                            console.log(err);
                       // else
                        return done(err);
                    })
                }
                else {

                    PlanContext.findById(obj._id, function (err, planContext) {
                        if (err) {
                            console.log(err);
                            return done(err);
                        }
                        else if (planContext) {
                            planContext.Plan_Context_A_1 = obj.Plan_Context_A_1;
                            planContext.Plan_Context_A_2 = obj.Plan_Context_A_2;
                            planContext.Plan_Context_A_3 = obj.Plan_Context_A_3;
                            planContext.Plan_Context_A_4 = obj.Plan_Context_A_4;
                            planContext.Plan_Context_A_5 = obj.Plan_Context_A_5;
                            planContext.Plan_Context_A_6 = obj.Plan_Context_A_6
                            planContext.Plan_Context_B = obj.Plan_Context_B;
                            planContext.Plan_Context_C = obj.Plan_Context_C;
                            planContext.Plan_Context_D = obj.Plan_Context_D;

                            planContext.save(function (err) { if (err) console.log(err); return done(err);});
                            
                        }
                    });

                }
            },
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/wizard');
                        }
                        if (err) {
                            console.log(err);
                            res.redirect('/wizard');
                        }
                        else
                        {
                            if (eval) {
								eval.last_step = 3;
								sess.last_tool = "Context and Usage";
                                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Context and Usage" });
                                console.log("hi");
                               
                                if (tool.length == 0) {
									eval.toolsvisited.push(toollist);

                                    eval.save(function (err) {
                                        if (err) console.log(err);

                                        sess.eval = eval;
                                        //console.log(sess.eval);
                                        //done(err, eval);
                                        return res.redirect('/wizard');
                                    });
                                }
                                else {
                                    var index = eval.toolsvisited.indexOf(tool[0]);
                                    if (index > -1) {
                                        eval.toolsvisited.splice(index, 1);
                                        eval.toolsvisited.push(toollist);
                                        eval.save(function (err) {
                                            if (err) console.log(err);
                                            sess.eval = eval;
                                            // done(err, eval);
                                            return res.redirect('/wizard');
                                        });
                                    }

                                }

                            }
                        }
                    });
                };
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/wizard');
        });    
   });    
};

