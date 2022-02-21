const identityService = require("../service/IdentityHttpService");
const registerdClientId = "1"; // replace 1 with registered client id
var sendMail = function (userName) {
  return new Promise(function (resolve, reject) {
    identityService.getAuthToken(userName,registerdClientId).then( 
      function (token) {
        const send = require("gmail-send")({
          user: "example@gmail.com", // replace with required accounts userid
          pass: "example@123",// replace with required accountspassword
          to: userName + "@gmail.com",
          subject: "test subject",
        });
        console.log(token);
        send(
          {
            text:
              "Click on this link to login  http://localhost:3789/app?auth=" +
              token,
          },
          (error, result, fullResult) => {
            if (error) console.log(error);
            resolve([]);
            console.log(result);
          }
        );
      },
      function (err) {
        console.log(err);
        reject("error");
      }
    );
  });
};

var verify = function (token) {
  return new Promise(function (resolve, reject) {
    identityService.verifyToken(token, registerdClientId).then(function(res){
      console.log(res);
      if(res){
        resolve("authorised");
      }
      else{
        reject("not authorised");
      }
    },function(err){
      reject("not authorised");
    })
  });
};

module.exports = {
  sendMail: sendMail,
  verify: verify,
};
