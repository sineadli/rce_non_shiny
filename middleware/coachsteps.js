
var CoachStep = require('../models/coachStep'),
    Tool = require('../models/tool.js'),
    Instrument =require('../models/instrument.js');
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
    Instrument.find(function (err, instruments) {
        if (err) {
            console.log(err);
        }
        else {
            instruments.sort(dynamicSort("order"));
            sess.instruments = instruments;
        }
    });
    next();
};

module.exports = coachsteps;