const db = require('../db');
const { ScanCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

module.exports.handle = async event => {
  const response = { statusCode: 200 };

  try {
    const params = { TableName: process.env.DYNAMODB_USERS_TABLE };
    const { Items } = await db.send(new ScanCommand(params));

    response.body = JSON.stringify({
      message: 'Successfully retrieved users.',
      data: Items.map(item => unmarshall(item)),
    });
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: 'Failed to retrieve users.',
      errorMessage: error.message,
    })
  }

  return response;
};