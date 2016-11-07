//routes/toolAnonymousRoutes.js
// load up the thing we need

//please note that req.session.step is for managing the active tab for wizard.html
//the following defines the tool routes available, only four routes available currently
module.exports = function (app) {
    //02.03 determine your approach
    app.get('/unknown/determine_your_approach', function (req, res) {
        res.render('determine_your_approach.html', { user: "NOAUTHENTICATED" });
    });
  
    //03.01 crafting a research question
    app.get('/unknown/craft_your_research_q', function (req, res) {      
        res.render('craft_your_research_q.html', { user: "NOAUTHENTICATED" });
    });
    
   
    //03.02 plan next steps
    app.get('/unknown/plan_next_steps', function (req, res) {
      
        res.render('plan_next_steps.html', { user: "NOAUTHENTICATED" });
    });
   
    //03.03 context and usage
    app.get('/unknown/context_and_usage', function (req, res) {
       
        res.render('context_and_usage.html', { user: "NOAUTHENTICATED" });
    });

    app.get('/unknown/matching',  function (req, res) {
        
        res.render('matching.html', { user: "NOAUTHENTICATED" });
    });
    
    app.get('/unknown/getresult', function (req, res) {
       
        res.render('getresult.html', { user: "NOAUTHENTICATED" });
    });
    
    app.get('/unknown/shareresult', function (req, res) {
        
        res.render('shareresult.html', { user: "NOAUTHENTICATED" });
    });
    
};

