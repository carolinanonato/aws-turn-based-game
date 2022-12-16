// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()

const params = {
  TableName: 'turn-based-game',
  Item: {
    gameId: '5b5ee7d8',
    user1: 'myfirstuser',
    user2: 'theseconduser',
    heap1: 5,
    heap2: 4,
    heap3: 5,
    lastMoveBy: 'myfirstuser'
  }
}

documentClient.put(params).promise()
  .then(() => console.log('Game added successfully!'))
  .catch((error) => console.log('Error adding game', error))
