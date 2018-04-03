/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

var isLoggedIn = require('../middleware/isLoggedIn.js');
var getEvalDefaults = require('../middleware/getEvalDefaults.js');
var textHelpers = require('../public/js/textHelpers.js');
var Evaluation = require('../models/evaluation.js');
var configDB = require('../config/database.js');
var Tool = require('../models/tool.js');
var url = require('url');
var async = require('async');

function updateLastTool(sess, toollist) {
		var tool = sess.eval.toolsvisited.filter(function (x) { return x.name === toollist.name });
		if (tool.length == 0) {
			sess.eval.toolsvisited.push(toollist);
		}
		else {
			var index = sess.eval.toolsvisited.indexOf(tool[0]);
			if (index > -1) {
				if (tool[0].status === "completed") toollist = { "name": toollist.name, "status": "completed", "visited_at": new Date() };
				sess.eval.toolsvisited.splice(index, 1);
				sess.eval.toolsvisited.push(toollist);
			}
		}
		if (sess.eval.stepsclicked.indexOf(sess.eval.last_step) < 0) sess.eval.stepsclicked.push(sess.eval.last_step);
}

var renderDownloadVersion = function (req, res, thispath) {
	var query = require('url').parse(req.url, true).query;
    var obj = req.body;
	var downloadRoute = obj.download_route;

	var filenameMap = {
                    shareresult: 'findings-brief',
                    appendix: 'technical-appendix',
					evaluation_plan: 'evaluation_plan'
                };

	res.render(downloadRoute + ".html", {
		user: req.user,
		eval: req.session.eval,
		defs: req.session.defaults,
		query: query,
		display: 'download'
	    },
		function (err, html) {
			if (err) {
			    console.log(err);
			    res.redirect('/error');
			} else {
		
				if (obj.file_format === 'html') {
					res.setHeader('Content-disposition', 'attachment; filename="' + filenameMap[downloadRoute] + '.html"');
					res.setHeader('Content-type', 'text/html');
					res.write(html);
					res.send();

				} else if (obj.file_format === 'pdf') {
					// Try to convert to PDF, and if it fails, revert to HTML;
					try {
						var wkhtmltopdf = require('wkhtmltopdf');

						wkhtmltopdf(html).pipe(res);
						res.setHeader('Content-disposition', 'attachment; filename="' + filenameMap[downloadRoute] + '.pdf"');
						res.setHeader('Content-type', 'application/pdf');

					} catch (e) {

						res.setHeader('Content-disposition', 'attachment; filename="' + downloadRoute +'.html"');
						res.setHeader('Content-type', 'text/html');
						res.write(html);
						res.send();
					}
				}
			}
		});

}

module.exports.getByEvalId = function(req, res, display) {
  
    var thispath = url.parse(req.url, true).pathname;
	// remove id from path
	thispath = thispath.toString().replace("/" + req.params.id.toString(), "");


    Evaluation.findOne({ _id: req.params.id }, function (err, eval) {
		if (err) {
			console.log(err);
			return done(err);
		}
         else if (eval) {
          
            req.session.eval = eval;
            var thisurl = thispath.substring(1) + '.html';
            var query = url.parse(req.url, true).query;

			getEvalDefaults(req.session, req.user);

			console.log("this path = " + thispath);
			if (display === "download") {
				renderDownloadVersion(req, res, thispath);
				return;
			}

            res.render(thisurl, {
                    user: req.user,
                    eval: req.session.eval,
                    defs: req.session.defaults,
                    query: query,
                    message: req.flash('saveMessage'),
                    valerrs: req.session.valerrs,
                    display: display
                },
                function(err, html) {
                    if (err) {
                        console.log(err);
						res.redirect('/error');
                    } else {
                        res.send(html);
                    }
                });
        } 
    });

}

module.exports.getByEval = function (req, res, display) {
	var sess = req.session;

	//Geth this tools info
	var thispath = url.parse(req.url, true).pathname;

		//Save eval to save the last tool setting
	if (sess.eval) {

			Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
				if (err) {
					console.log(err);
					return done(err);
				}
 
                sess.eval = eval;
				getEvalDefaults(sess, req.user);

					var thisurl = thispath.substring(1) + '.html';
					var query = url.parse(req.url, true).query;

			    res.render(thisurl, {
			        user: req.user,
			        eval: sess.eval,
			        defs: sess.defaults,
			        message: req.flash('saveMessage'),
			        query: query,
			        valerrs: req.session.valerrs,
			        shiny_url: configDB.shiny_url,
			        display: "online"
			    });

			});
         
        }

	return;
};

module.exports.getByTool = function (req, res, display) {
		var sess = req.session;

		//Geth this tools info
		var thispath = url.parse(req.url, true).pathname;
    console.log("this path = " + thispath);
	if (display === "download") {
		renderDownloadVersion(req, res, thispath);
	    return;
	}

    Tool.findOne({ path: thispath }).exec(function(err, tool) {
        if (err) {
            console.log(err);
            return done(err);
        }
		tool.setPeekingNote(sess);		
        sess.step = tool.coachStep;


//Save eval to save the last tool setting
        if (sess.eval) {
            Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
				if (err) {
					console.log(err);
					return done(err);
				}
                eval.last_tool = tool.name;
				eval.last_step = tool.coachStep;
                sess.eval = eval;

                eval.save(function(err) {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
					// populate defaults
                    getEvalDefaults(sess, req.user);

                    var thisurl = thispath.substring(1) + '.html';
        
					var query = url.parse(req.url, true).query;
                    var instruments;

                    if (thisurl == "measure_instrument.html") {
                        instruments = sess.instruments;
                    }
					res.render(thisurl, {
						user: req.user,
						eval: sess.eval,
						defs: sess.defaults,
						message: req.flash('saveMessage'),
						query: query,
						valerrs: req.session.valerrs,
						shiny_url: configDB.shiny_url,
                        display: display,
                        lists: instruments
					}//,
						//function (err, html) {
						//	if (err) {
						//		console.log(err);
						//		res.redirect('/error');
						//	} else { res.send(html); }
						//}
					);
                   
                });
            });
        }
    });
	  		
		
	    return;
	};

module.exports.postByTool = function(req, res, display) {
    // Get this tools info
    var sess = req.session;
    sess.valerrs = []; // Clear out old errors.sess.valerrs = []; 
	var thispath = url.parse(req.url, true).pathname;
	
	//console.log("In post by tool and tool = " + thispath);
	// There will be a return path if came to tool from a "where did I update this" link
    var returnpath = req.body.returnpath;
    if (returnpath === '') returnpath = thispath.substring(1);
  //  console.log("In post by tool and return path = " + returnpath);
	// Posted evaluation updates from tool
    var evalup = req.body;
	
    Tool.findOne({ path: thispath }).exec(function(err, tool) {
        if (err) {
            console.log(err);
            return done(err);
        } 
		//console.log("In post by tool and found tool = " + tool);
		tool.setPeekingNote(sess);
        var toolstatus = req.body.status ? req.body.status : "complete";
       // console.log("In post by tool, tool name =  " + tool.name + " status = " + toolstatus);
        var toollist = { "name": tool.name, "status": toolstatus, "visited_at": new Date() };
        updateLastTool(sess, toollist);

        // get current eval, update it with form data and then save update.  
        Evaluation.findById(sess.eval._id, function(err, eval) {
            if (eval) {
			//Replace current evaluation values with updates 
		       // initialize for now, new dowloadpath fields
                eval.matching.DownloadPath = "";
                eval.random.DownloadPath = "";
                for (var key in evalup) {
                        if (typeof eval[key] ==='string') {
                        eval[key] = evalup[key];                     
                    }
					if (evalup.hasOwnProperty(key)) {
						if (typeof evalup[key] == "object" && typeof eval[key] != "undefined")
							for (var nkey in evalup[key]) {
								
								if (typeof evalup[key][nkey] == "object" && !(Array.isArray(evalup[key][nkey]))) { 
									for (var mkey in evalup[key][nkey]) {
										//console.log("Saving and mkey = " + mkey);
										if ( typeof eval[key][nkey][mkey] != "undefined")
										 {
									        eval[key][nkey][mkey] = evalup[key][nkey][mkey];
									    }
									}
								} else {
									if (typeof eval[key][nkey] != "undefined" && typeof evalup[key][nkey] != "undefined") {
									    var hold = evalup[key][nkey];
										if (Array.isArray(hold)) {
											hold = hold.filter(function (s) {
												return s !== 'deleted';
											});
										
										} else if (hold == "deleted") {
											hold = "";
										}
										
										eval[key][nkey] = hold;
										
								    }
								};
							}
					}
					eval.markModified(key);
				}
            };
            eval.last_step = tool.coachStep;
            eval.last_tool = tool.name;
            eval.toolsvisited = req.session.eval.toolsvisited;
            eval.stepsclicked = req.session.eval.stepsclicked;

            eval.save(function(err, savedeval) {
                if (savedeval) {
                    sess.eval = savedeval;
                    if (req.body.status === "started" || req.body.status === "" || display==="online") {
                        req.flash('saveMessage', 'Changes Saved.');
                       // console.log("Just saved changes and now being redirected to tool = " + returnpath);
                        return res.redirect('/' + returnpath);
                    }
					else if (display === "download") {
                        req.flash('saveMessage', 'Changes Saved.');
					    renderDownloadVersion(req,res, thispath);
					}else {
                        return res.redirect('/coach');
                    }
                }
                if (err) {
                    sess.valerrs = err.errors;
                    req.flash('saveMessage', 'There is a problem with some of the information you entered. Please look below for the specific errors. ');
                    return res.redirect('/' + returnpath);
                }
            });

            if (err) {
                sess.valerrs = err.errors;

                req.flash('saveMessage', 'There is a problem with some of the information you entered. Please look below for the specific errors. ');
                return res.redirect('/' + returnpath);
            }

        });
    });
}

  


