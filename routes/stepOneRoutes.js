var express = require('express');


var routes = function (StepOne) {
    var step1Router = express.Router();

    var step1Controller = require('../Controllers/stepOneController')(StepOne)
    step1Router.route('/')
        .post(step1Controller.post)
        .get(step1Controller.get);


    //middleware for finding id for getbyid, put,and patch for a specific id
    step1Router.use('/:evalId', function (req, res, next) {
        StepOne.findById(req.params.evalId, function (err, step1) {
            if (err)
                res.status(500).send(err);
            else if (step1) {
                req.step1 = step1;
                next();
            }
            else {
                res.status(404).send('no step1 found');
            }
        });
    });
    step1Router.route('/:evalId')
        .get(function (req, res) {

            res.json(req.step1);

        })
        .put(function (req, res) {
            req.step1.userid = req.body.user._id;
            req.step1.evalId = req.body.evalId;
            req.step1.unitOfObservation = req.body.unitOfObservation;
            req.step1.techInUsed = req.body.techInUsed;
            req.step1.rasignInUsed = req.body.rasignInUsed;
            req.step1.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.step1);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id)
                delete req.body._id;

            for (var p in req.body) {
                req.step1[p] = req.body[p];
            }

            req.step1.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.step1);
                }
            });
        })
        .delete(function (req, res) {
            req.step1.remove(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });
    return step1Router;
};

module.exports = routes;