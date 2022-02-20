'use strict';
var util = require('util');
const registerClient = require('../managers/RegisterClientManager.js');
const JWT = require('../managers/JWTTokenManager.js');
module.exports = {
  register_client:register_client,
  Generate_Token:generate_token,
  Authorise:authorise
};

function register_client(req, res) {
  var name = req.swagger.params.name.value;
  var hello = util.format('Hello, %s!', name);
  registerClient.register(name).then(function(result){
 
    res.status(200).send(result);
  }, function(err){
    res.status(500).send({message: "err"});
  });
 //res.status(200).send({clientId:"hii", clientSecret: "hi"});
}

function generate_token(req, res) {
  var name = req.swagger.params.userName.value;
  var clientId = req.headers["x-api-key"];
  JWT.create(name,clientId).then(function(token){
    res.status(200).send({token:token});
  },function(err){
    res.status(500).json(err);
  })
}

function authorise(req, res) {
  var token = req.swagger.params.token.value;
  var clientId = req.headers["x-api-key"];

  JWT.verify(token,clientId).then(function(result){
    if(result)
      res.status(200).send("verified");
    else{
      res.status(401).send();
    }
  },function(err){
    res.status(401).send();
  })
}
