// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require('aws-sdk')
const sns = new AWS.SNS();

const sendMessage = async ({ phoneNumber, message }) => {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber
  }

  return sns.publish(params).promise()
}

sendMessage({ phoneNumber: process.env.PHONE_NUMBER, message: 'Sending a message from SNS!'})
  .then(() => console.log('Sent message successfully'))
  .catch((error) => console.log('Error sending SNS: ', error.message))