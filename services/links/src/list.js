import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  const params = {
    TableName: process.env.TABLE_NAME,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    FilterExpression:
      "userId = :userId AND categoryId = :categoryId AND isActive = :isActive",
    ProjectionExpression:
      "linkId, author, description, image, logo, publisher, title, urlText, isFavorite",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
      ":categoryId": event.pathParameters.categoryId,
      ":isActive": true
    }
  };

  try {
    const result = await dynamoDbLib.call("scan", params);
    // Return the matching list of items in response body
    callback(null, success(result.Items));
  } catch (e) {
    console.error(e);
    callback(null, failure({ status: false }));
  }
}
