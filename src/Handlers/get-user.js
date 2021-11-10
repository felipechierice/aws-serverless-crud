const db = require('../db');
const { GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

module.exports.handle = async event => {
  const response = { statusCode: 200 };

  try {
    const params = {
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: marshall({ userId: event.pathParameters.userId }),
    };
    const { Item } = await db.send(new GetItemCommand(params));

    console.log({ Item });

    response.body = JSON.stringify({
      message: 'Successfully retrieved user.',
      data: Item ? unmarshall(Item) : {},
    });
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: 'Failed to get user.',
      errorMessage: error.message,
    })
  }

  return response;
};