var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

var toolkitRouter = express.Router();

// configuration ===============================================================
mongoose.connect(configDB.url, configDB.config); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application, setup a whole bunch of middleware
// the order in which you use middleware in Express matters: middleware declared earlier will get called first, and if it can handle a request, any middleware declared later will not get called

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(bodyParser.json()); //get information from json--api use


//for api
// load up the user model
//var StepOne = require('./models/stepOne.js'),
//    StepTwo = require('./models/stepTwo.js'),
//    StepThree = require('./models/stepThree.js'),
//    StepFour = require('./models/stepFour.js');

//stepOneRouter = require('./Routes/stepOneRoutes')(StepOne);

//app.use('/api/step1', stepOneRouter); 

//var wizarStepRouter = require('./Routes/wizardStepRoutes');
//app.use('/api/wizard', wizarStepRouter);

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'ejs'); // set up ejs for templating
//app.use('/static', express.static('public'));
app.use('/static', express.static(__dirname + '/public'));// safer
//app.use('/bower_components', express.static(__dirname + '/public/bower_components'));
// required for passport
app.use(session({ secret: 'mathematicadashmpristhegreatest' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
console.log(" passport loaded ");


//app.get('/gateway/', function(req, res){
//console.log("in app.get");
//  res.send('hello, express');
//});
// routes ======================================================================
//require('./routes/routes.js')(app, passport, StepOne, StepTwo, StepThree, StepFour); // load our routes and pass in our app and fully configured passport
require('./routes/routes.js')(app, passport); 
// launch ======================================================================
app.listen(port);
console.log('Listening on port ' + port);
