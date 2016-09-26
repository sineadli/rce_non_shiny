// app/models/planContext.js
// load the things we need
var mongoose = require('mongoose');


var planContextSchema = mongoose.Schema({
    userid: { type: mongoose.Schema.ObjectId, require: true},
    evalid: { type: mongoose.Schema.ObjectId, require: true },
    Plan_Context_A_1: { type: String, require: true }, 
    Plan_Context_A_2: { type: String, require: true },
    Plan_Context_A_3: { type: String, require: true },
    Plan_Context_A_4: { type: String, require: true },
    Plan_Context_A_5: { type: String, require: true },

    Plan_Context_B: String,
 
    created_at: { type: Date, default: Date.now },
    updated_at: Date

});

// create the model for users and expose it to our app
module.exports = mongoose.model('PlanContext', planContextSchema);