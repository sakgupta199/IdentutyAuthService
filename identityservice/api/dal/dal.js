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

var verifyClientId = function(clientId){
  var sqlSelect = sqlQuery.select();
  var command = sqlSelect
                .from('RegisteredClient')
                .where({ clientId: clientId })
                .build();
  return execute(command);
 }

 var cacheJWT = function(uuid,clientId){
  var sqlInsert = sqlQuery.insert();
 var command = sqlInsert
               .into('JWTCache')
               .set({jwtuuid:uuid,clientid:clientId,status:0})
               .build();
return execute(command);
 }

 var accessJWT = function(uuid,clientId){
  var sqlSelect = sqlQuery.select();
  var command = sqlSelect
                .from('JWTCache')
                .where({ clientId: clientId,jwtuuid:uuid })
                .build();
  return execute(command);
 }

 var updateJWT = function(uuid,clientId,accessedTime,status){
  var sqlUpdate = sqlQuery.update();
 var command = sqlUpdate
               .into('JWTCache')  
               .set({accessedtime:accessedTime,status:status})
               .where({ clientId: clientId,jwtuuid:uuid })
               .build();
  console.log(command);
return execute(command);
 }

var execute = function(command){
  return new Promise(function(resolve,reject){
    const con = mysql.createConnection({
      host: "127.0.0.1",
      multipleStatements: true,
      user: "root",
      database: "IdentityApiData",
      password: "Passw0rd"
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
  getClientId: getClientId,
  verifyClientId:verifyClientId,
  cacheJWT:cacheJWT,
  accessJWT:accessJWT,
  updateJWT:updateJWT
}