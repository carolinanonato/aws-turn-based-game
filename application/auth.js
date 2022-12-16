// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

const client = jwksClient({
  strictSsl: true, // Default value
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`
});

const createCognitoUser = async (username, password, email, phoneNumber) => {
  const signUpParams = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email
      },
      {
        Name: "phone_number",
        Value: phoneNumber
      }
    ]
  };
  await cognitoidentityserviceprovider.signUp(signUpParams).promise();
  const confirmParams = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: username
  };
  await cognitoidentityserviceprovider.adminConfirmSignUp(confirmParams).promise();
  return {
    username,
    email,
    phoneNumber
  };
};

const login = async (username, password) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    UserPoolId: process.env.USER_POOL_ID,
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  };
  const {
    AuthenticationResult: { IdToken: idToken }
  } = await cognitoidentityserviceprovider.adminInitiateAuth(params).promise();
  return idToken;
};

const fetchUserByUsername = async username => {
  const params = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: username
  };
  const user = await cognitoidentityserviceprovider.adminGetUser(params).promise();
  const phoneNumber = user.UserAttributes.filter(attribute => attribute.Name === "phone_number")[0].Value;
  return {
    username,
    phoneNumber
  };
};

const verifyToken = async idToken => {
  function getKey(header, callback) {
    client.getSigningKey(header.kid, function(err, key) {
      var signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }

  return new Promise((res, rej) => {
    jwt.verify(idToken, getKey, {}, function(err, decoded) {
      if (err) {
        rej(err);
      }
      res(decoded);
    });
  });
};

module.exports = {
  createCognitoUser,
  login,
  fetchUserByUsername,
  verifyToken
};
