# IdentityAuthService

POC of identity service with an Example APP

## Installation
Compatible with Node v10.20.1 and below

### App SpinUp
#### Replace user and password in app - loginManager.js with credentials 
#### Change the client Id in the 
```bash
npm i -g swagger;
cd app;
npm i;
swagger project start;
```
### IdentityService SpinUp
```bash
cd identityservice;
npm i;
swagger project start;
```

###  Setup MySql 
Replace MySql Credentials in identityservice - dal.js
```sql
CREATE TABLE `JWTCache` (
  `JWTUUID` varchar(45) NOT NULL,
  `ACCESSEDTIME` bigint unsigned DEFAULT NULL,
  `ClientId` int NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`JWTUUID`),
  UNIQUE KEY `JWTUUID_UNIQUE` (`JWTUUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `RegisteredClient` (
  `ClientId` int NOT NULL AUTO_INCREMENT,
  `ClientName` varchar(45) NOT NULL,
  `ClientSecret` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ClientId`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### Setup Public Private Key
Replace Path to Public Private key in identityservice -JWTTokenManager with the path of your public / private key.

Use the below to create Public/Private Key 
```bash
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
cat jwtRS256.key
cat jwtRS256.key.pub
```

## Usage
### IdentityService
You can access the IdentityService
```code
http://localhost:10010/api-docs/
```

Register Client App in the Identity Service using 
```bash
curl -X 'GET' \
  'http://localhost:10010/RegisterClient?name=yourClientName' \
  -H 'accept: application/json'
```
Use the response of client id in your app.

Now to Generate a token use, here the client id needs to be provided in the header as X-API-Key otherwise you will get a 401
```bash
curl -X 'GET' \
  'http://localhost:10010/GenerateToken?userName=yourUserName' \
  -H 'accept: application/json' \
  -H 'X-API-Key: 12'
```

To verify the signature use also do mention the clientId like before in the header as X-API-Key
```bash
curl -X 'GET' \
 curl -X 'GET' \
  'http://localhost:10010/AuthenticateToken?token='yourToken' \
  -H 'accept: application/json' \
  -H 'X-API-Key: 12'
```
### AppToSendEmail

You can access the IdentityService
```code
http://localhost:3000/api-docs/
```

```bash
curl -X 'GET' \
  'http://localhost:3000/login?userName=yourGmailUserName' \
  -H 'accept: application/json'
```

This will send an email to your gmail id, once you click on the link you should see a simple "hello world".

As of now the app is set to Expire the token in 2 minutes, we can change this in the JWTtokenManager file, the link will show "not authorised" after expiry of 2 minutes, or with an invalid token.

## Typical Workflow
<img width="450" alt="UML Sequence Diagram" src="https://user-images.githubusercontent.com/100079612/155014213-3722d10c-b04a-46ae-ae76-6d371e21d17b.png">

## Improvements

- Add Client Secret For Authentication
- Export a usage library so any app wanting to consume our service just needs to install this library and all the boiler plate code will be already present
- Enhance JWT with information on the expiry time instead of setting it constant across all apps, this can
be customised too
-The service can also provide opportunity for user details to be pre-filled in the app in a profile section since the JWT token created for the user can contain all that as well
- Increase security by base 64 encoding the JWT so that a JWT decoder does not show the parameters.
- Use Redis instead of MySql for JWT token management
 


## Contributing
sakgupta
Please open Pull Request/ Raise Issue for support.
