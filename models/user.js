
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

// models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
//org_types = ["school", "district", "research", "Other"];
//roles = ["teacher", "princple", "technology", "other"]
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    profile: {
        organiztion_type: { type: String },
        organiztion_type_other: String, 
        role: { type: String},
        role_other: String,
        organization_name: String,
        user_name: String,
        user_pic: { data: Buffer, contentType: String },
        first_name: String,
        last_name: String
        
    },
    receive_update: Boolean,   
    userSession: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    created_at: {type: Date, default: Date.now},
    updated_at: Date,
    evalid: mongoose.Schema.ObjectId,
    last_url: String

});
//define index if needed
//userSchema.index({'local.email':1})
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
//pre save event
userSchema.pre('save', function(next){
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});
// you can define virtual getter or setter here
//userSchema.virtual('somename').get(function(){
//    return ...
//});
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);