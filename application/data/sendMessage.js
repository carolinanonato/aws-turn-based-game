// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require("aws-sdk");
const sns = new AWS.SNS();

const sendMessage = async ({ phoneNumber, message }) => {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber
  };

  return sns.publish(params).promise();
};

module.exports = sendMessage;
