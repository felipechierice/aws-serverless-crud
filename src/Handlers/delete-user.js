const db = require('../db');
const { DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

module.exports.handle = async event => {
  const response = { statusCode: 200 };

  try {
    const params = {
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: marshall({ userId: event.pathParameters.userId }),
    };

    await db.send(new DeleteItemCommand(params));

    response.body = JSON.stringify({
      message: 'Successfully deleted user.',
    });
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: 'Failed to delete user.',
      errorMessage: error.message,
    })
  }

  return response;
};