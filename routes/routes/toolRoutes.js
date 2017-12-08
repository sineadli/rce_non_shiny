
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
var querystring = require('querystring');
var https = require('https');
var sess;
//please note that req.sess.step is for managing the active tab for coach.html


module.exports = function (app, passport) {


	//02.03 The Basics
	app.get('/basics', isLoggedIn, function (req, res) {
		return evaluationController.getByTool(req, res, "online");
	});
    app.post('/basics', isLoggedIn, function (req, res) {        
        return evaluationController.postByTool(req, res,"The Basics", 2);	
    });
    //02.03 The Outcome & Measure
    app.get('/outcome_measure', isLoggedIn, function (req, res) {
		return evaluationController.getByTool(req, res, "online");
    });
    app.post('/outcome_measure', isLoggedIn, function (req, res) {
        return evaluationController.postByTool(req, res);
    });
    app.get('/measure_instrument', isLoggedIn, function (req, res) {
        console.log("Getting measure instrument");
     //   console.log(req);

        return evaluationController.getByTool(req, res, "online");
    });
    app.post('/measure_instrument', isLoggedIn, function (req, res) {
        return evaluationController.postByTool(req, res);
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
	 //   console.log("post randomizaton route");
		return evaluationController.postByTool(req, res);
	});

    app.get('/getresult', isLoggedIn, function (req, res) {
		return evaluationController.getByTool(req, res, "online");
    });    
	app.post('/getresult', isLoggedIn, function (req, res) {
		return evaluationController.postByTool(req, res);
    });
	app.get('/appendix', isLoggedIn, function (req, res) {
		return evaluationController.getByEval(req, res, "online");
	});
    app.get('/shareresult', isLoggedIn, function (req, res) {
       return evaluationController.getByTool(req, res, "online");
    });
    
    app.get('/shareresult/:id', isLoggedIn, function (req, res) {
		return evaluationController.getByEvalId(req, res, "online");
	});
	app.get('/appendix/:id', isLoggedIn, function (req, res) {
		return evaluationController.getByEvalId(req, res, "online");
	});
	app.post('/shareresult', isLoggedIn, function (req, res) {
		return evaluationController.postByTool(req, res, "online");
	});
  
    app.post('/download/:id', isLoggedIn, function (req, res) {
		return evaluationController.getByEvalId(req, res, "download");
	});
 


};

