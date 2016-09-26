/*~~~~~~~~~~~~~~~~~~ ALL ~~~~~~~~~~~~~~~~~~*/
$(document).ready( function() {

  

    /* This information should be pulled from database */
var w0 = new WizardStep('Welcome to RCE for Ed Tech', 0, 5, 'This step helps you understand the basics of using the RCE for Ed Tech toolkit. You will get a brief overview of the goals of the toolkit, the steps, and how to complete them. This step is shown on your first time through the toolkit and is available from the all tool dashboards for review at a later date.' )
var w1 = new WizardStep('Understanding your problem', 1, 4,'This step helps you to describe the problem you are trying to solve by using education technology, to use existing data to start understanding how education technology might help you address that problem, and to determine what approach you should take to evaluate the education technology you’ve chosen to use.');
var w2 = new WizardStep('Planning your research', 2, 4, 'This step prepares you to begin your evaluation by helping you write a research question, plan what your next steps will be based on the evaluation findings, and describe your education technology and the context in which you will be implementing it.');
var w3 = new WizardStep('Preparing your data', 3, 2, 'This step will teach you how to organize your data so that you can upload it to our wizard for a successful analysis.');
var w4 = new WizardStep('Analyzing your data', 4, 2, 'This step helps you process the data on your education technology and determine what works.');
var w5 = new WizardStep('Summarizing your findings', 5, 1, 'This step prepares a summary document that will present your findings. You will be able to share this document with members of your team and stakeholders.');


 /*~~~~~~~~~~~~~~~~~~  Wizard ~~~~~~~~~~~~~~~~~~*/
function WizardStep(name, step, numTools,intro, isCurrent) {
    this.WizardStepName = name;
    this.WizardStep = tep;
    this.NumberTools = numTools;
    this.IntroText = intro;
    this.isCurrent = isCurrent
 

    WizardSteps.push(this);
}
WizardStep.objects = [];
WizardStep.prototype.constructor = WizardStep;

WizardStep.prototype.GetTools = function(WizardStep) {
        questitem = '<div>';
}


    /* see http://projects.mathematica.net/da/RCTE_50183/Shared%20Documents/Forms/AllItems.aspx?RootFolder=%2Fda%2FRCTE_50183%2FShared%20Documents%2FWebsite%20Development%2FContent%20and%20Requirement%20Documents%2FWizard%20Pages&FolderCTID=0x01200096FC73BBD0D8E745A4E6067D967D8A69&View={02362B3C-1038-4C2A-8561-E5339F505173}
     for descriptions of each tool and look of each tool landing page */
function Tool(id, name, desc, step, type, prereq) {
    this.ToolID = id;
    this.ToolName = name;
    this.ToolDesc = desc;
    this.ToolWizardStep = step;
    this.ToolType = type;
    this.PreReq = prereq;


    Tools.push(this);
}
Tool.objects = [];


function Users(id) {
    this.UserID = id;
}
Users.objects = [];
Users.prototype.constructor = Users;

Users.prototype.GetCurrentWizardStep = function () {

}
Users.prototype.GetEvalList = function (UserID) {

}

Users.prototype.GetCurrentEval = function () {

}

function Evaluations(userid, evalid, name) {
    this.UserID = id;
    this.EvaluationID = evalid;
    this.Name = name;

}
Evaluations.objects = [];
Evaluations.prototype.constructor = Evaluations;

Evaluations.prototype.GetCurrentWizardStep = function (UserID, EvaluationID) {

}
Evaluations.prototype.GetEvalStatus = function () {

}

function EvaluationTools(userid, evalid, toolid, lastvisit, lastsubmit) {
    this.UserID = userid;
    this.EvaluationID = evalid;
    this.ToolID = toolid;
    this.LastVisit = lastvisit;
    this.LastSubmit = lastsubmit;

}
EvaluationTools.objects = [];
EvaluationTools.prototype.constructor = EvaluationTools;

EvaluationTools.prototype.GetSavedData = function (UserID, EvaluationID, ToolID) {

}
EvaluationTools.prototype.GetEvalToolStatus = function () {

}
Evaluations.prototype.GetWizardStepPercentComp = function (UserID, EvaluationID) {

}

}); //<-end document.ready
