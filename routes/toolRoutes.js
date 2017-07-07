
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
var extend = require('util')._extend;
var Evaluation = require('../models/evaluation.js');
var evaluationController = require('../controllers/evaluationController.js');
var isLoggedIn = require("../middleware/isLoggedIn.js");
var textHelpers = require('../public/js/textHelpers.js');
var configDB = require('../config/database.js');
var sess;
//please note that req.sess.step is for managing the active tab for coach.html


module.exports = function (app, passport) {
  	
		
	function updateLastTool(eval, toollist) {
		var tool = eval.toolsvisited.filter(function (x) { return x.name === toollist.name });
		if (tool.length == 0) {
			eval.toolsvisited.push(toollist);
		}
		else {
			var index = eval.toolsvisited.indexOf(tool[0]);
			if (index > -1) {
				if (tool[0].status === "completed") toollist = { "name": toollist.name, "status": "completed", "visited_at": new Date() };
				eval.toolsvisited.splice(index, 1);
				eval.toolsvisited.push(toollist);
			}
		}
		if (eval.stepsclicked.indexOf(eval.last_step) < 0) eval.stepsclicked.push(eval.last_step);
	} 
	
	

	//02.03 The Basics
	app.get('/basics', isLoggedIn, function (req, res) {
		return evaluationController.getByTool(req, res, "online");
	});
    app.post('/basics', isLoggedIn, function (req, res) {        
        return evaluationController.postByTool(req, res,"The Basics", 2);	
    });
    
	//02. Who used and how	   
	app.get('/who_and_how', function (req, res) {
		return evaluationController.getByTool(req, res, "online");
	});
	app.post('/who_and_how', isLoggedIn, function (req, res) {
        return evaluationController.postByTool(req, res);
	});

    //02.03 determine your approach   
    app.get('/determine_your_approach', isLoggedIn, function (req, res) {
		return evaluationController.getByTool(req, res, "online");
    });
    app.post('/determine_your_approach', isLoggedIn,  function (req, res) {
		return evaluationController.postByTool(req, res);	       
	});


  //03.01 crafting a research question
    app.get('/craft_your_research_q', isLoggedIn, function (req, res) {	   
		return evaluationController.getByTool(req, res, "online");
    });    
	app.post('/craft_your_research_q', isLoggedIn, function (req, res) {
		return evaluationController.postByTool(req, res);	       
    });
    
    //03.02 plan next steps
    app.get('/plan_next_steps', isLoggedIn,  function (req, res) {
		return evaluationController.getByTool(req, res, "online");
    });
	app.post('/plan_next_steps', isLoggedIn, function (req, res) {
		return evaluationController.postByTool(req, res);
	});

    //03.03 Work with providers
	app.get('/working_with_provider', isLoggedIn, function (req, res) {		
		return evaluationController.getByTool(req, res, "online");
	});	
	app.post('/working_with_provider', isLoggedIn, function (req, res) {
		return evaluationController.postByTool(req, res);	
	});

    //03.03 context and usage
    app.get('/context_and_usage', isLoggedIn, function (req, res) {
		return evaluationController.getByTool(req, res, "online");
	});
	app.post('/context_and_usage', isLoggedIn, function (req, res) {
		return evaluationController.postByTool(req, res);	       
	});
	
	//02. Prepare data	   
	app.get('/prepare_data_random', function (req, res) {
		return evaluationController.getByTool(req, res, "online");
	});
	app.post('/prepare_data_random', function (req, res) {
		return evaluationController.postByTool(req, res);		
	});
	
	//02. Prepare data	   
	app.get('/prepare_data', function (req, res) {
		return evaluationController.getByTool(req, res, "online");
	});
	app.post('/prepare_data', function (req, res) {
		return evaluationController.postByTool(req, res);	
	});

	//02. Evaluation Plan   
	app.get('/evaluation_plan', function (req, res) {		
		return evaluationController.getByTool(req, res, "online");        
    });
	app.post('/evaluation_plan', function (req, res) {
		return evaluationController.postByTool(req, res);	
    });

	app.post('/evaluation_plan_download', function (req, res) {
		return evaluationController.postByTool(req, res, "download");	
	});

    app.get('/matching', isLoggedIn, function (req, res) {
		return evaluationController.getByTool(req, res, "online");
    });    
	app.post('/matching', function (req, res) {
		return evaluationController.postByTool(req, res);	
	});
	
    app.get('/randomization', isLoggedIn, function (req, res) {
       return evaluationController.getByTool(req, res, "online");
    });
	app.post('/randomization', function (req, res) {
		return evaluationController.postByTool(req, res);
	});

    app.get('/getresult', isLoggedIn, function (req, res) {
		return evaluationController.getByTool(req, res, "online");
    });    
	app.post('/getresult', isLoggedIn, function (req, res) {
		console.log("posting get results");
	    console.log(req.body);
		return evaluationController.postByTool(req, res);
    });
	app.get('/appendix_matching', isLoggedIn, function (req, res) {
		return evaluationController.getByEval(req, res, "download");
	});
    app.get('/shareresult', isLoggedIn, function (req, res) {
       return evaluationController.getByTool(req, res, "online");
    });
    
    app.get('/shareresult/:id', isLoggedIn, function (req, res) {
		return evaluationController.getByEvalId(req, res, "online");
    });
	app.post('/shareresult', isLoggedIn, function (req, res) {

        var toollist = { "name": "Share Your Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.eval.last_step = 6;
        sess.step = 6;
		var obj = req.body;
		console.log("in post ShareResult route");
        console.log(obj);
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "shareresult";
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
				updateLastTool(eval, toollist);

                // Turn relabel inputs into an array rather than 
                var relabel_index = 0;
				var relabels = [];
				var crelabel_index = 0;
				var crelabels = [];

                while (obj['relabel-baseline-var-' + relabel_index]) {
                    relabels.push(obj['relabel-baseline-var-' + relabel_index]);
                    delete obj['relabel-baseline-var-' + relabel_index];
                    relabel_index++;
				}
				while (obj['relabel-control-var-' + crelabel_index]) {
					crelabels.push(obj['relabel-control-var-' + crelabel_index]);
					delete obj['relabel-control-var-' + crelabel_index];
					crelabel_index++;
				}
				eval.author = obj.author;
				eval.company = obj.company;
			
				var shareresult = obj;
				shareresult.baseline_var_relabels = relabels;
				shareresult.control_var_relabels = crelabels;

                if (!eval.shareresult) {
                    shareresult.created_at = dt;
                }
                else {
                    shareresult.updated_at = dt;
                };

                eval.shareresult = shareresult;
			
               
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/' + returnpath);
                    }
                    else {
                        return res.redirect('/publications');
                    }
                });
            }
        ], function (err) {
            if (err) if (err) req.flash('saveMessage', 'There is an error, please re-try. ' + err);
            return res.redirect('/' + returnpath); 
        });
    });

    app.post('/download/:id', isLoggedIn, function (req, res) {
        var obj = req.body;
        var query = require('url').parse(req.url, true).query;
        var download_route = obj.download_route;

        async.waterfall([
            function (callback) {
                if (req.params.id ) {
                    Evaluation.findOne({ _id: req.params.id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        callback(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },

            function (eval, callback) {
                // Need to generate document file here
                var filename_map = {
                    shareresult: 'findings-brief',
                    appendix_randomized: 'technical-appendix',
                    appendix_matched: 'technical-appendix'
                };

                var filename = filename_map[download_route];
                res.render(download_route + '.html', { user: req.user, eval: eval, message: req.flash('saveMessage'), query: query, display: 'download' },
                    function (err, html) {
                        console.log(err);

                        if (obj.file_format === 'html') {

                            res.setHeader('Content-disposition', 'attachment; filename="' + filename + '.html"');
                            res.setHeader('Content-type', 'text/html');
                            res.write(html);
                            res.send();

                        } else if (obj.file_format === 'pdf') {

                            // Try to convert to PDF, and if it fails, revert to HTML;
                            try {
                                var wkhtmltopdf = require('wkhtmltopdf');

                                wkhtmltopdf(html).pipe(res);
                                res.setHeader('Content-disposition', 'attachment; filename="' + filename + '.pdf"');
                                res.setHeader('Content-type', 'application/pdf');

                            } catch (e) {

                                res.setHeader('Content-disposition', 'attachment; filename="' + filename + '.html"');
                                res.setHeader('Content-type', 'text/html');
                                res.write(html);
                                res.send();
                            }
                        }
                    });
            }
        ], function (err) {
            if (err) if (err) req.flash('saveMessage', 'There is an error, please re-try. ' + err);
            return res.redirect('/' + returnpath);
        });
    });

};

