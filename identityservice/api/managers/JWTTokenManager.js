const e = require("express");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const dal = require("../dal/dal");
const fs = require("fs");

var create = function (userName, clientId) {
  //private key
  var uuid = uuidv4();
  var privateKey = fs.readFileSync(
    "/Users/sakgupta/Desktop/interview/project/identityservice/api/helpers/jwtRS256.key"
  );
  var token = jwt.sign({ username: userName, uuid: uuid }, privateKey, {
    algorithm: "RS256",
  });
  //send clientID+UUID pair in db
  return new Promise(function (resolve, reject) {
    dal.cacheJWT(uuid, clientId).then(
      function (res) {
        resolve(token);
      },
      function (err) {
        let message = JSON.stringify(err.message);
        reject(message);
      }
    );
  });
};
var verify = function (token, clientId) {
  return new Promise(function (resolve, reject) {
    try {
      ///public key
      var cert = fs.readFileSync(
        "/Users/sakgupta/Desktop/interview/project/identityservice/api/helpers/jwtRS256.key.pub"
      ); // get public key
      jwt.verify(token, cert, function (err, decoded) {
        if (err) {
          reject(err || "err");
        }
        console.log(decoded);
        dal.accessJWT(decoded.uuid, clientId).then(
          function (res) {
            if (res && res.length > 0 && res[0].status == 0) {
              //update
              dal.updateJWT(decoded.uuid, clientId, Date.now(), 1).then(
                function () {
                  resolve(true);
                },
                function (err) {
                  reject(err);
                }
              );
            } else if (res && res.length > 0 && res[0].status == 1) {
              console.log(BigInt(Date.now()) - BigInt(res[0].ACCESSEDTIME));
              if (BigInt(Date.now()) - BigInt(res[0].ACCESSEDTIME) > 120000n) {
                resolve(false);
                //write a delete funtion in the cache
              } else {
                resolve(true);
              }
            } else {
              resolve(false);
            }
          },
          function (err) {
            console.log(err);
            let message = JSON.stringify(err.message);
            reject(message);
          }
        );
      });
    } catch (ex) {
      reject(ex.message);
    }
  });
};

module.exports = {
  create: create,
  verify: verify,
};
