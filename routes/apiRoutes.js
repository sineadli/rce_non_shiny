// routes/aprRoutes.js
// load up things we need
var WizardStep = require('../models/wizardStep'),
    Tool = require('../models/tool.js');

module.exports = function (app) {

   
    //all api routes starting from here
    //wizard and tool don't need authentication
    app.get('/api/wizard', function (req, res) {

        WizardStep.find({}, function (err, wizardStep) {
            if (err) {

                res.status(500).send(err);
            }
            else {

                res.json(wizardStep);
            }
        });

    });

    app.get('/api/wizard/:id', function (req, res) {

        WizardStep.findById(req.params.id, function (err, wizardStep) {
            if (err) {

                res.status(500).send(err);
            }
            else {

                res.json(wizardStep);
            }
        });

    });

    app.post('/api/wizard', function (req, res) {


        var wizard = new WizardStep(req.body);

        wizard.save(function (err) {
            if (err)
                console.log(err);
            else
                res.status(201).send(wizard);


        });
    });
    app.get('/api/tools', function (req, res) {


        Tool.find({}, function (err, tools) {
            if (err) {

                res.status(500).send(err);
            }
            else {

                res.json(tools);
            }
        });

    });
    app.get('/api/tools/:wizardPath', function (req, res) {

        //console.log(req.params.wizardPath);
        Tool.find({ wizardPath: req.params.wizardPath }, function (err, tool) {
            if (err) {

                res.status(500).send(err);
            }
            else {

                res.json(tool);
            }
        });

    });

    app.post('/api/tool', function (req, res) {


        var tool = new Tool(req.body);

        tool.save(function (err) {
            if (err)
                console.log(err);
            else
                res.status(201).send(tool);


        });
    });



};







