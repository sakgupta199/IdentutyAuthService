'use strict';
var util = require('util');
const  loginManager = require('../managers/loginManager.js');
module.exports = {
  createLoginLink:createLoginLink,
  redirect: redirect
};


function createLoginLink(req, res) {
  var name = req.swagger.params.userName.value;
  loginManager.sendMail(name).then(function(result){
    res.status(200).send();
  },function(err){
    res.status(500).send();
  })
  
}

function redirect(req, res) {
  var token = req.swagger.params.auth.value;
  loginManager.verify(token).then(function(result){
    res.status(200).send("hello world");
  }, function(err){
    res.status(500).json(err);
  })
    
}
