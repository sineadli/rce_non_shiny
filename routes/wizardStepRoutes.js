var express = require('express');


var routes = function () {
    var wizardStepRouter = express.Router();

    var wizardStepController = require('../Controllers/wizardStepController')()
    wizardStepRouter.route('/')
        .get(wizardStepController.get);
    return wizardStepRouter;
};

module.exports = routes;