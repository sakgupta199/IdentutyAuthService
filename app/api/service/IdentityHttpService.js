const request = require("request-promise");
const q = require('q');

var getAuthToken = function(userName,clientId){
    var defer = q.defer();
    var requestOptions = {
        uri: "http://localhost:10010/GenerateToken?userName=" +userName,
        method: "GET",
        headers: {
            "X-API-Key": clientId,
        },
        json: true
      }
      console.log("here");

      request(requestOptions).then(function(result){
        if(result &&  result.token){
          defer.resolve(result.token);
        }
      }, function(err){
        console.log(err);
          var errorMessage = "Failed to GET token";
          defer.reject(errorMessage);
      });
    
        return defer.promise;
    }

var verifyToken = function (token, clientId) {
  var defer = q.defer();
  var requestOptions = {
    uri: "http://localhost:10010/AuthenticateToken?token=" + token,
    method: "GET",
    headers: {
      "X-API-Key": clientId,
    },
    json: true,
  };

  request(requestOptions).then(
    function (result) {
        console.log(result);
      if (result == "verified") {
        defer.resolve(true);
      } else {
        defer.resolve(false);
      }
    },
    function (err) {
      var errorMessage = "Failed to verify token";
      defer.reject(errorMessage);
    }
  );

  return defer.promise;
};

    module.exports = {
        getAuthToken: getAuthToken,
        verifyToken: verifyToken
    }