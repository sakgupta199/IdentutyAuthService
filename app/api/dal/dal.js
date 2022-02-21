var sql = require('sql-query');
sqlQuery = sql.Query('mysql');
var mysql = require('mysql');
const selectId = ";SELECT LAST_INSERT_ID() AS ClientId;";


var getClientId = function(name){
 var sqlInsert = sqlQuery.insert();
 var command = sqlInsert
               .into('RegisteredClient')
               .set({clientName:name})
               .build();
 command = command + selectId;
return execute(command);
}

var execute = function(command){
  return new Promise(function(resolve,reject){
    const con = mysql.createConnection({
      host: "127.0.0.1",
      multipleStatements: true,
      user: "root", // replace with your mysql user
      database: "IdentityApiData", // replace with your mysql databasename
      password: "Passw0rd" // replace with your mysql password
    });
    con.connect(function(err) {
      if (err) {
        reject(err);
      }
      con.query(command, function (err, result, fields) {
        if (err) {
          reject(err);
        }
        resolve(result);
      con.end();
      });
    });
  })
}
module.exports ={
  getClientId: getClientId
}