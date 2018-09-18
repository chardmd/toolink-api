import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  const params = {
    TableName: process.env.TABLE_NAME,
    FilterExpression:
      "userId = :userId and isActive = :isActive and isFavorite = :isFavorite",
    ProjectionExpression:
      "linkId, author, description, image, logo, publisher, title, urlText, isFavorite",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
      ":isFavorite": true,
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
