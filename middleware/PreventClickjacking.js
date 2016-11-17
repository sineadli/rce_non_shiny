/******************************************************************************
* Copyright © Mathematica Policy Research, Inc. 
* This code cannot be copied, distributed or used without the express written permission
* of Mathematica Policy Research, Inc. 
*******************************************************************************/

function preventClickjacking(req, res, next) {
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('X-Content-Type-Options', 'nosniff');
    next();
}

module.exports = preventClickjacking;
