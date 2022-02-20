const dal = require('../dal/dal');

var register = function (name) {
  return new Promise(function (resolve, reject) {
    dal.getClientId(name).then(
      function (res) {
        var client = {};
        client.clientId = res[1][0].ClientId.toString();
        client.clientSecret = "";
        resolve(client);
      },
      function (err) {
        let message = JSON.stringify(err.message);
        reject(message);
      }
    );
  });
};

module.exports = {
    register:register
}