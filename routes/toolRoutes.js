// load up the thing we need
var fs = require('fs');
var ProbAppr = require('../models/probAppr.js'),
    PlanQuestion = require('../models/planQuestion.js'),
    PlanNext = require('../models/planNext.js'),
    PlanContext = require('../models/planContext.js');
var isLoggedIn = require("../middleware/isLoggedIn.js");
var sess;
//please note that req.session.step is for managing the active tab for wizard.html
//the following defines the tool routes available 
module.exports = function (app, passport) {

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
       
        sess = req.session;
        sess.step = 2
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
        PlanQuestion.findOne({ userid: req.user._id },
            function (err, planQuestion) {
                if (err || !planQuestion) res.render('craft_your_research_q.html', { planQuestion: new PlanQuestion() });
                if (planQuestion) {
                    console.log(planQuestion)
                    res.render('craft_your_research_q.html', { planQuestion: planQuestion })
                }
            }
        );
    });

    app.post('/craft_your_research_q', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.step = 3;
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
                if (err || !planNext) res.render('plan_next_steps.html', { planNext: new PlanNext() });
                if (planNext) {
                    console.log(planNext)
                    res.render('plan_next_steps.html', { planNext: planNext })
                }
            }
        );



    });
    app.post('/plan_next_steps', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.step = 3;
        var obj = req.body;
        if (!obj.userid) {
            if (!obj.userid || obj.userid == '') obj.userid = req.user._id;
            var planNext = new PlanNext(req.body);
            planNext.save(function (err) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/wizard');
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
                    res.render('context_and_usage.html', { planContext: planContext })
                }
            }
        );



    });
    app.post('/context_and_usage', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.step = 3;
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
                    res.redirect('/wizard');
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
   
};