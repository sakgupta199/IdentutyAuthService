const identityService = require("../service/IdentityHttpService");
var sendMail = function (userName) {
  return new Promise(function (resolve, reject) {
    identityService.getAuthToken(userName, "12").then(
      function (token) {
        const send = require("gmail-send")({
          user: "swymapp7@gmail.com",
          pass: "swymapp@123",
          to: userName + "@gmail.com",
          subject: "test subject",
        });
        console.log(token);
        send(
          {
            text:
              "Click on this link to login  http://localhost:3000/app?auth=" +
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
    identityService.verifyToken(token, "12").then(function(res){
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
