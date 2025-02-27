import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);

  let updateExpression = [];
  let expressionAttributeValues = {};
  if (data.isActive !== undefined) {
    updateExpression = updateExpression.concat("SET isActive = :isActive");
    expressionAttributeValues[":isActive"] = data.isActive;
  }

  if (data.isFavorite !== undefined) {
    updateExpression = updateExpression.concat("SET isFavorite = :isFavorite");
    expressionAttributeValues[":isFavorite"] = data.isFavorite;
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'linkId': path parameter
    Key: {
      linkId: event.pathParameters.id,
      userId: event.requestContext.identity.cognitoIdentityId
    },

    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: updateExpression.toString(),
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    callback(null, success({ status: true }));
  } catch (e) {
    console.error(e);
    callback(null, failure({ status: false }));
  }
}
