
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
//please note that req.session.step is for managing the active tab for coach.html
//the following defines the tool routes available, only four routes available currently
module.exports = function (app, passport) {
   // app.use(isLoggedIn);
    app.use(getCurrentEvaluation);
  
	
	//02.03 The Basics
    app.get('/basics', isLoggedIn, function (req, res) {
		sess = req.session;
		sess.eval.last_step = 2;
		sess.eval.last_tool = "The Basics";
	//	console.log(eval.basics);
        var query = require('url').parse(req.url, true).query;
        res.render('basics.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query   });
	});
    app.post('/basics', isLoggedIn, function (req, res) {
		sess = req.session;
		var obj = req.body, basics;
	//	console.log(obj);
	    var toolName = "The Basics";
		var toollist = { "name": toolName, "status": req.body.status, "visited_at": new Date() };
		var dt = new Date();
		async.waterfall([
			function (done) {
				if (sess.eval) {
					Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
						if (!eval) {
							req.flash('error', 'No evaluation exists.');
							return res.redirect('/coach');
						}
						if (err) {
							console.log(err);
							return res.redirect('/coach');
						}
						return done(err, eval);
					});
				}
				else
					res.redirect('/coach');
			},
			function (eval, done) {
				//eval find so update the toolsVisisted accordingly
				eval.last_step = 2;
				eval.last_tool = toolName;
				var tool = eval.toolsvisited.filter(function (x) { return x.name === toolName });
				if (tool.length == 0) {
					eval.toolsvisited.push(toollist);
				}
				else {
					var index = eval.toolsvisited.indexOf(tool[0]);
					if (index > -1) {
						if (tool[0].status == "completed") toollist = { "name": toolName, "status": "completed", "visited_at": new Date() };
						eval.toolsvisited.splice(index, 1);
						eval.toolsvisited.push(toollist); 
					}
				}
				//add/update the probAppr within eval
				basics = {
					"Basics_Have": obj.Basics_Have,
					"Basics_Tech_Name": obj.Basics_Tech_Name,
					"Basics_Using": obj.Basics_Using,
					"Basics_Users": obj.Basics_Users, 
					"Basics_Users_Other": obj.Basics_Users_Other, 
					"Basics_Outcome": obj.Basics_Outcome,
					"Basics_Outcome_Other": obj.Basics_Outcome_Other
				};
				if (!eval.basics) {
				    eval.basics.created_at = dt;
					
				}
				else {
					eval.basics.created_at = eval.basics.created_at;
				    eval.basics.updated_at = dt;
				};
				
				eval.basics = basics;
				if (eval.stepsclicked.indexOf(2) < 0) eval.stepsclicked.push(2);
				eval.save(function (err) {
					if (err) {
						console.log(err); return done(err);
					}
					sess.eval = eval;
					//  console.log(eval);
					if (req.body.status === "started") {
						req.flash('saveMessage', 'Changes Saved.');
						return res.redirect('/basics');
					}
					else {
						return res.redirect('/coach');
					}
                    
				});
			}
		], function (err) {
			if (err) return next(err);
			res.redirect('/coach');
		});
	});
    
	//02. Who used and how	   
	app.get('/who_and_how', function (req, res) {
		//	console.log("In DYA get method.");
		sess = req.session;
		sess.eval.last_step = 2;
		sess.eval.last_tool = "Who Used Your Technology and How";
		var query = require('url').parse(req.url, true).query;
		res.render('who_and_how.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
	});
    //02.03 determine your approach
    app.get('/determine_your_approach', isLoggedIn, function (req, res) {
	//	console.log("In DYA get method.");
        sess = req.session;
        sess.eval.last_step = 2;
        sess.eval.last_tool = "Determine Your Approach";
        var query = require('url').parse(req.url, true).query;
        res.render('determine_your_approach.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    app.post('/determine_your_approach', isLoggedIn,  function (req, res) {
        sess = req.session;
        var obj = req.body, probAppr;
        var toollist = { "name": "Determine Your Approach", "status": req.body.status, "visited_at": new Date() };
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });                      
                }
                else
                    res.redirect('/coach');                     
            },
            function (eval, done) {
                //eval find so update the toolsVisisted accordingly
				eval.last_step = 2;
                eval.last_tool = "Determine Your Approach";
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Determine Your Approach" });
                if (tool.length === 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status === "completed") toollist = { "name": "Determine Your Approach", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                //add/update the probAppr within eval
                
                var probAppr = {
						"Appr_Current_or_New": obj.Appr_Current_or_New, 
						"Appr_All_Using": obj.Appr_All_Using,
						"Appr_Can_Group": obj.Appr_Can_Group, 
						"Appr_How_Choose": obj.Appr_How_Choose

				};
				if (!eval.probAppr) {
				    eval.probAppr.created_at = dt;
				}
                else {
				    eval.probAppr.updated_at = dt;
				};
                
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
                        return res.redirect('/coach');
                    }
                    
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
	});
	
    app.post('/pdf_view', isLoggedIn,  function (req, res) {
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

    app.get('/craft_your_research_q', isLoggedIn, function (req, res) {	   
		sess = req.session;
	//	console.log(sess.eval);
        sess.eval.last_step = 3;
        sess.eval.last_tool = "Craft Your Research Question";
        var query = require('url').parse(req.url, true).query;
        res.render('craft_your_research_q.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    //03.01 crafting a research question
    app.post('/craft_your_research_q', isLoggedIn,  function (req, res) {
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
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
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
				eval.basics.Basics_Outcome_Other = obj.Basics_Outcome_Other;
				eval.basics.Basics_Outcome = obj.Basics_Outcome;
				
				   
                var planQuestion = {
                        "Outcome_Measure": obj.Outcome_Measure,
						"Outcome_Direction": obj.Outcome_Direction, 
						"Intervention_Group_Desc": obj.Intervention_Group_Desc,
						"Comparison_Group_Desc": obj.Comparison_Group_Desc
				};
				if (!eval.planQuestion) {
				    eval.planQuestion.created_at = dt;

				}
                else {
				    eval.planQuestion.updated_at = dt;
				};

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
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
    });
    //03.02 plan next steps
    app.get('/plan_next_steps', isLoggedIn,  function (req, res) {
        sess = req.session;
        sess.eval.last_step = 3;
        sess.eval.last_tool = "Think About How to Use Your Result";
        var query = require('url').parse(req.url, true).query;
        res.render('plan_next_steps.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query  });
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
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
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
				eval.planQuestion.Outcome_Measure = obj.Outcome_Measure; // measure
				eval.planQuestion.Outcome_Direction = obj.Outcome_Direction; // direction
			
               var planNext = {
						"Tech_Cost_Saves": obj.Tech_Cost_Saves,
						"Tech_Amount": obj.Tech_Amount,
						"Tech_Cost_User": obj.Tech_Cost_User, 
						"Tech_Cost_Desc": obj.Tech_Cost_Desc,
						"Measure_Units" : obj.Measure_Units,
						"Measure_Units_Other" : obj.Measure_Units_Other,
						"Success_Effect_Size": obj.Success_Effect_Size, 
						"Pass_Probability": obj.Pass_Probability,
						"Fail_Probability": obj.Fail_Probability, 
						"Action_Success": obj.Action_Success,
						"Action_Fail": obj.Action_Fail,
						"Action_Inconclusive": obj.Action_Inconclusive

				};
				if (!eval.planNext) {
				    eval.planNext.created_at = dt;
				}
                else {
				    eval.planNext.updated_at = dt;
				};
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
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
	});
	//03.03 Work with providers
	app.get('/working_with_provider', isLoggedIn, function (req, res) {
		console.log("start work with providers");
		sess = req.session;
		sess.eval.last_step = 3;
		sess.eval.last_tool = "Working with Ed Tech Providers";
		var query = require('url').parse(req.url, true).query;
		res.render('working_with_provider.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
	});

    //03.03 context and usage
    app.get('/context_and_usage', isLoggedIn, function (req, res) {
		sess = req.session;
        sess.eval.last_step = 3;
        sess.eval.last_tool = "Summarize Context";
        var query = require('url').parse(req.url, true).query;
        res.render('context_and_usage.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    app.post('/context_and_usage', isLoggedIn,  function (req, res) {
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
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
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
               
					var planContext = {
						Eval_Begin_Date: obj.Eval_Begin_Date,
						Eval_End_Date: obj.Eval_End_Date,
						Type_Curriculum: obj.Type_Curriculum,
						Type_Practice: obj.Type_Practice,
						Type_CSchool_Structure: obj.Type_CSchool_Structure,
						Type_School_Level: obj.Type_School_Level,
						Type_Teacher_Level: obj.Type_Teacher_Level,
						Type_Policy: obj.Type_Policy,
						Tech_Purpose: obj.Tech_Purpose,
						Tech_Components: obj.Tech_Components,
						Delivered_Individually: obj.Delivered_Individually,
						Delivered_Small_Group: obj.Delivered_Small_Group,
						Delivered_Whole_Class: obj.Delivered_Whole_Class,
						Delivered_School_Wide: obj.Delivered_School_Wide,
						Grade_PK: obj.Grade_PK,
						Grade_K: obj.Grade_K,
						Grade_1: obj.Grade_1,
						Grade_2: obj.Grade_2,
						Grade_3: obj.Grade_3,
						Grade_4: obj.Grade_4,
						Grade_5: obj.Grade_5,
						Grade_6: obj.Grade_6,
						Grade_7: obj.Grade_7,
						Grade_8: obj.Grade_8,
						Grade_9: obj.Grade_9,
						Grade_10: obj.Grade_10,
						Grade_11: obj.Grade_11,
						Grade_12: obj.Grade_12,
						Grade_PS: obj.Grade_PS,
						Expected_Dosage: obj.Expected_Dosage,
						Developer_Guidelines:obj.Developer_Guidelines,
						ClassroomType_General: obj.ClassroomType_General,
						ClassroomType_Inclusion: obj.ClassroomType_Inclusion,
						Outcome_Literacy: obj.Outcome_Literacy,
						Outcome_Mathematics: obj.Outcome_Mathematics, 
						Outcome_Science: obj.Outcome_Science,
						Outcome_Behavior: obj.Outcome_Behavior,
						Outcome_Teacher_Excellence: obj.Outcome_Teacher_Excellence, 
						Outcome_Graduation: obj.Outcome_Graduation,
						SchoolType_Charter: obj.SchoolType_Charter,
						SchoolType_Private: obj.SchoolType_Private, 
						SchoolType_Parochial: obj.SchoolType_Parochial, 
						SchoolType_Public: obj.SchoolType_Public,
						Total_Students: obj.Total_Students,
						Urbanicity_Rural: obj.Urbanicity_Rural,
						Urbanicity_Suburban: obj.Urbanicity_Suburban,
					Urbanicity_Urban: obj.Urbanicity_Urban,
						District_State: obj.District_State,
						Race_Asian: obj.Race_Asian,
						Race_Black: obj.Race_Black,
						Race_Native_American: obj.Race_Native_American,
						Race_Pacific_Islander: obj.Race_Pacific_Islander,
						Race_White: obj.Race_White,
						Race_Other: obj.Race_Other,
						Ethnicity_Hispanic: obj.Ethnicity_Hispanic,
						Ethnicity_Not_Hispanic: obj.Ethnicity_Not_Hispanic,
						Gender_Female: obj.Gender_Female,
						Gender_Male: obj.Gender_Male,
						FRPL_Free: obj.FRPL_Free,
						FRPL_Reduced: obj.FRPL_Reduced,
						English_Learners: obj.English_Learners,
						IEP: obj.IEP,
						Other_Notes: obj.Other_Notes, 
						

				};
				if (!eval.planContext) {
				    planContext.created_at = dt;
				}
                else {
					planContext.created_at = eval.planContext.created_at;
				    planContext.updated_at = dt;
				};
                
                eval.planContext = planContext;
                if (eval.stepsclicked.indexOf(3) < 0) eval.stepsclicked.push(3);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {

                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/context_and_usage');
                    }
                    else {
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
	});
	
	//02. Prepare data	   
	app.get('/prepare_data', function (req, res) {
		//	console.log("In DYA get method.");
		sess = req.session;
		sess.eval.last_step = 4;
		sess.eval.last_tool = "Prepare Your Data for Analysis";
		var query = require('url').parse(req.url, true).query;
		res.render('prepare_data.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
	});
	app.post('/prepare_data', function (req, res) {
		var toollist = { "name": "Prepare Your Data for Analysis", "status": req.body.status, "visited_at": new Date() };
		sess = req.session;
		sess.eval.step = 4;
		var obj = req.body;
		console.log(obj);
		var dt = new Date();
		async.waterfall([
			function (done) {
				if (sess.eval) {
					Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
						if (!eval) {
							req.flash('error', 'No evaluation exists.');
							return res.redirect('/coach');
						}
						if (err) {
							console.log(err);
							return res.redirect('/coach');
						}
						return done(err, eval);
					});
				}
				else
					res.redirect('/coach');
			},
			function (eval, done) {
				eval.last_step = 4;
				eval.last_tool = "Prepare Your Data for Analysis";
				//eval find so update the toolsVisisted accordingly
				var tool = eval.toolsvisited.filter(function (x) { return x.name === eval.last_tool });
				if (tool.length == 0) {
					eval.toolsvisited.push(toollist);
				}
				else {
					var index = eval.toolsvisited.indexOf(tool[0]);
					if (index > -1) {
						if (tool[0].status == "completed") toollist = { "name": eval.last_tool, "status": "completed", "visited_at": new Date() };
						eval.toolsvisited.splice(index, 1);
						eval.toolsvisited.push(toollist);
					}
				}
			    if (obj.Basics_Users != null) {
			        eval.basics.Basics_Users = obj.Basics_Users;
			    }


			    var prepare = {
					"Individual_Group": obj.Individual_Group,
					"Cluster_Group": obj.Cluster_Group,
					"Cluster_Group_Other": obj.Cluster_Group_Other,
					"Check_Outcome": obj.Check_Outcome,
					"Check_Sample": obj.Check_Sample,
					"Check_Treatment": obj.Check_Treatment,
					"Check_Pretest": obj.Check_Pretest,
					"Check_Background": obj.Check_Background,
					"Check_Usage": obj.Check_Usage,
					"Check_Check_OneSet": obj.Check_OneSet,
					"Check_Numeric": obj.Check_Numeric,
					"Check_Missing": obj.Check_Missing,
					"Check_Min_Max": obj.Check_Min_Max,
					"Check_Miss_Impact": obj.Check_Miss_Impact

				};
				if (!eval.prepare) {
					eval.prepare.created_at = dt;
				}

				else {
					eval.prepare.updated_at = dt;
				};
				
				eval.prepare = prepare;
				if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
				console.log(eval);
				eval.save(function (err) {
					if (err) {
						console.log(err); return done(err);
					}
					sess.eval = eval;
					
					if (req.body.status == "started") {
						
						req.flash('saveMessage', 'Changes Saved.');
						return res.redirect('/prepare_data');
					}
					else {
						return res.redirect('/coach');
					}
				});
			}
		], function (err) {
			if (err) return next(err);
			res.redirect('/coach');
		});
	});
	
	//02. Prepare data	   
	app.get('/evaluation_plan', function (req, res) {
		sess = req.session;
	    console.log(sess.eval.planNext);
		sess.eval.last_step = 3;
		sess.eval.last_tool = "Evaluation Plan";
		var query = require('url').parse(req.url, true).query;
		res.render('evaluation_plan.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
	});

    app.get('/matching', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 4;
        sess.eval.last_tool = "Matching";
        var query = require('url').parse(req.url, true).query;
        res.render('matching.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query  });
    });
    app.post('/matching', function (req, res) {
        var toollist = { "name": "Matching", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.eval.step = 4;      
		var obj = req.body;
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, done) {
                eval.last_step = 4;
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
				eval.planQuestion.Intervention_Group_Desc = obj.Intervention_Group_Desc;
				eval.planQuestion.Comparison_Group_Desc = obj.Comparison_Group_Desc;
							
                 var matching = {      
                        "Target_Group_Desc": obj.Target_Group_Desc,
                        "treat_var": obj.s_treat_var,
                        "match_vars": obj.s_match_vars,
                        "grade_var": obj.s_grade_var,
                        "n_full": obj.n_full,
                        "n_full_treat": obj.n_full_treat,
                        "n_matched": obj.n_matched,
                        "n_matched_treat": obj.n_matched_treat,
                        "Result":obj.result

				};
				if (!eval.matching) {
				    eval.matching.created_at = dt;
				}

				else {
				    eval.matching.updated_at = dt;
				};

                eval.matching = matching;
                if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
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
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
	});
	app.get('/randomization', isLoggedIn, function (req, res) {
		sess = req.session;
		sess.eval.last_step = 4;
        sess.eval.last_tool = "Randomization";
        var query = require('url').parse(req.url, true).query;
        res.render('randomization.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    app.post('/randomization', function (req, res) {
        var toollist = { "name": "Random Assignment", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.eval.step = 4;
        var obj = req.body;

        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, done) {
                eval.last_step = 4;
                eval.last_tool = "Random Assignment";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Random Assignment" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status == "completed") toollist = { "name": "Random Assignment", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }

                if (!eval.random) {
                    Random = {
                        "Individual_Group": obj.Individual_Group,
                        "Cluster_Group": obj.Cluster_Group,
                        "Cluster_Group_Other": obj.Cluster_Group_Other,
                        "User_Limit_Exist": obj.User_Limit_Exist,
                        "intervention_quantity": obj.intervention_quantity,
                        "intervention_type": obj.intervention_type,
                        "s_unit_id": obj.s_unit_id,
                        "s_pretest": obj.s_pretest,
                        "s_block_id": obj.s_block_id,
                        "s_baseline_vars": obj.s_baseline_vars,
                        "Result": obj.result,
                        "created_at": dt

                    };
                }

                else {
                    Random = {
                        "Individual_Group": obj.Individual_Group,
                        "Cluster_Group": obj.Cluster_Group,
                        "Cluster_Group_Other": obj.Cluster_Group_Other,
                        "User_Limit_Exist": obj.User_Limit_Exist,
                        "intervention_quantity": obj.intervention_quantity,
                        "intervention_type": obj.intervention_type,
                        "s_unit_id": obj.s_unit_id,
                        "s_pretest": obj.s_pretest,
                        "s_block_id": obj.s_block_id,
                        "s_baseline_vars": obj.s_baseline_vars,
                        "Result": obj.result,
                        "created_at": eval.random.created_at, "updated_at": dt
                    };
                }
                eval.random = Random;
                if (eval.stepsclicked.indexOf(4) < 0) eval.stepsclicked.push(4);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;

                    if (req.body.status == "started") {

                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/randomization');
                    }
                    else {
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
    });

	app.post('/randomization', function (req, res) {
		var toollist = { "name": "Randomization", "status": req.body.status, "visited_at": new Date() };
		sess = req.session;
		sess.eval.step = 4;
		var obj = req.body;
		console.log(obj);
		var dt = new Date();
		async.waterfall([
			function (done) {
				if (sess.eval) {
					Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
						if (!eval) {
							req.flash('error', 'No evaluation exists.');
							return res.redirect('/coach');
						}
						if (err) {
							console.log(err);
							return res.redirect('/coach');
						}
						return done(err, eval);
					});
				}
				else
					res.redirect('/coach');
			},
			function (eval, done) {
				eval.last_step = 4;
				eval.last_tool = "Randomization";
				//eval find so update the toolsVisisted accordingly
				var tool = eval.toolsvisited.filter(function (x) { return x.name === eval.last_tool });
				if (tool.length == 0) {
					eval.toolsvisited.push(toollist);
				}
				else {
					var index = eval.toolsvisited.indexOf(tool[0]);
					if (index > -1) {
						if (tool[0].status == "completed") toollist = { "name": eval.last_tool, "status": "completed", "visited_at": new Date() };
						eval.toolsvisited.splice(index, 1);
						eval.toolsvisited.push(toollist);
					}
				}
				eval.planQuestion.Intervention_Group_Desc = obj.Intervention_Group_Desc;
				eval.planQuestion.Comparison_Group_Desc = obj.Comparison_Group_Desc;

			    eval.prepare.Individual_Group = obj.Individual_Group;
			    eval.prepare.Cluster_Group = obj.Cluster_Group;
			    eval.prepare.Cluster_Group_Other = obj.Cluster_Group_Other;
				var random = {
					"User_Limit_Exist": obj.User_Limit_Exist,
					"intervention_quantity": obj.intervention_quantity,
					"intervention_type": obj.intervention_type,
					"s_unit_id": obj.s_unit_id,
					"s_pretest": obj.s_pretest,
					"s_block_id": obj.s_block_id,
					"n_matched": obj.n_matched,
					"s_baseline_vars": obj.s_baseline_vars,
					"Result": obj.result

				};
				if (!eval.random) {
					eval.random.created_at = dt;
				}

				else {
					eval.random.updated_at = dt;
				};
				
				eval.random = random;
				if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
				console.log(eval);
				eval.save(function (err) {
					if (err) {
						console.log(err); return done(err);
					}
					sess.eval = eval;
					
					if (req.body.status == "started") {
						
						req.flash('saveMessage', 'Changes Saved.');
						return res.redirect('/randomization');
					}
					else {
						return res.redirect('/coach');
					}
				});
			}
		], function (err) {
			if (err) return next(err);
			res.redirect('/coach');
		});
	});

    app.get('/getresult', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 5;
        sess.eval.last_tool = "Get Results";
        var query = require('url').parse(req.url, true).query;
        res.render('getresult.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    app.post('/getresult', isLoggedIn, function (req, res) {
        var toollist = { "name": "Get Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 5;
        var obj = req.body;
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
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
				eval.planQuestion.Outcome_Measure = obj.Outcome_Measure;
				eval.planQuestion.Outcome_Direction = obj.Outcome_Direction;
				eval.planNext.Success_Effect_Size= obj.Success_Effect_Size;
				eval.planNext.Pass_Probability= obj.Pass_Probability;
				
					var getresult = {				
                        "Result": obj.result,
                       

				};
				if (!eval.getresult) {
				    eval.getresult.created_at = dt;
				}
                else {
					eval.getresult.updated_at = dt;
                   };

                eval.getresult = getresult;
                if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status === "started") {

                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/getresult');
                    }
                    else {
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
    });
    app.get('/shareresult', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 6;
        sess.eval.last_tool = "Share Your Results";
        var query = require('url').parse(req.url, true).query;
        res.render('shareresult.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    app.post('/shareresult', isLoggedIn,function (req, res) {
        var toollist = { "name": "Share Your Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.eval.last_step = 6;
        var obj = req.body;
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
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
                        if (tool[0].status === "completed") toollist = { "name": "Share Your Results", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                if (eval.stepsclicked.indexOf(6) < 0) eval.stepsclicked.push(6);

                // Turn relabel inputs into an array rather than 
                var relabel_index = 0;
                var relabels = [];

                while (obj['relabel-baseline-var-' + relabel_index]) {
                    relabels.push(obj['relabel-baseline-var-' + relabel_index]);
                    delete obj['relabel-baseline-var-' + relabel_index] 
                    relabel_index++;
                }

                var shareresult = obj;
                shareresult.baseline_var_relabels = relabels;

                if (!eval.shareresult) {
                    shareresult.created_at = dt;
                }
                else {
                    shareresult.updated_at = dt;
                };

                eval.shareresult = shareresult;

                if (eval.stepsclicked.indexOf(6) < 0) eval.stepsclicked.push(6);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/shareresult');
                    }
                    else {
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
    });
};

