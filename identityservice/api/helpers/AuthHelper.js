const dal = require('../dal/dal');

var authenticate = function (clientId) {
    return new Promise(function (resolve, reject) {
      dal.verifyClientId(clientId).then(
        function (res) {
            if(res.length>0)
              resolve(true);
            else
              resolve(false);
        },
        function (err) {
          let message = JSON.stringify(err.message);
          resolve(false);
        }
      );
    });
  };
  
  module.exports = {
      authenticate:authenticate
  }