import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  const params = {
    TableName: process.env.TABLE_NAME,
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'linkId': path parameter
    Key: {
      linkId: event.pathParameters.id,
      userId: event.requestContext.identity.cognitoIdentityId
    },
    FilterExpression: "isActive = :isActive",
    ExpressionAttributeValues: {
      ":isActive": false
    }
  };

  try {
    await dynamoDbLib.call("delete", params);
    callback(null, success({ status: true }));
  } catch (e) {
    console.error(e);
    callback(null, failure({ status: false }));
  }
}
