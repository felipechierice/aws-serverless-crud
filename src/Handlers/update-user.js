const db = require('../db');
const { UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

module.exports.handle = async event => {
  const response = { statusCode: 200 };

  try {
    const body = JSON.parse(event.body);
    const objectKeys = Object.keys(body);
    const params = {
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: marshall({ userId: event.pathParameters.userId }),
      UpdateExpression: `SET ${objectKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
      ExpressionAttributeNames: objectKeys.reduce((acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
      }), {}),
      ExpressionAttributeValues: marshall(objectKeys.reduce((acc, key, index) => ({
          ...acc,
          [`:value${index}`]: body[key],
      }), {})),
    };
    const updateResult = await db.send(new UpdateItemCommand(params));

    response.body = JSON.stringify({
      message: 'Successfully updated user.',
      data: updateResult,
    });
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: 'Failed to update user.',
      errorMessage: error.message,
    })
  }

  return response;
};