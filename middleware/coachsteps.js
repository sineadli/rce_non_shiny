
var CoachStep = require('../models/coachStep'),
    Tool = require('../models/tool.js');
var dynamicSort = require('./dynamicSort');
var coachsteps = function (req, res, next) {
    sess = req.session;
    CoachStep.find(function (err, coachSteps) {
        if (err) {
            console.log(err);
        }
        else {
						coachSteps.sort(dynamicSort("step"));
            sess.coachsteps = coachSteps;
        }   
    });
    Tool.find(function (err, tools) {
        if (err) {
            console.log(err);
        }
        else {
            tools.sort(dynamicSort("order"));
            sess.tools = tools;       
        }
    });
    next();
};

module.exports = coachsteps;