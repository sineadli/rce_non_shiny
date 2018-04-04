
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

module.exports = {
  //  'url': 'mongodb://localhost:27017/GateWayToRCTE',  //for dev and local
    'url': 'mongodb://db1.edtechrce.org,db2.edtechrce.org/GateWayToRCTE?replicaSet=edtechrce',  //for prod
    'config': { autoIndex: false },

  //  'shiny_url': 'http://52.222.20.48'  //for dev and local
    'shiny_url': 'https://edtechrce.org'  //for prod

    'emailHost': 'localhost'   //for prod
    //'emailHost': 'smtp.mathematica-mpr.com', //for local
    //no email server setup for dev

};

