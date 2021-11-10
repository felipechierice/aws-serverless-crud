const db = require('../db');
const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

module.exports.handle = async event => {
  const response = { statusCode: 201 };

  try {
    const body = JSON.parse(event.body);

    const params = {
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Item: marshall(body || {}),
    };
    const createResult = await db.send(new PutItemCommand(params));

    response.body = JSON.stringify({
      message: 'Successfully created user.',
      data: createResult,
    });
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: 'Failed to create user.',
      errorMessage: error.message,
    })
  }

  return response;
};