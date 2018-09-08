import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      FilterExpression: "userId = :userId and isActive = :isActive",
      ProjectionExpression: "linkId",
      ExpressionAttributeValues: {
        ":userId": event.requestContext.identity.cognitoIdentityId,
        ":isActive": false
      }
    };
    const result = await dynamoDbLib.call("scan", params);

    for (let item of result.Items) {
      const deleteParams = {
        TableName: process.env.TABLE_NAME,
        // 'Key' defines the partition key and sort key of the item to be removed
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'linkId': path parameter
        Key: {
          linkId: item.linkId,
          userId: event.requestContext.identity.cognitoIdentityId
        }
      };

      await dynamoDbLib.call("delete", deleteParams);
    }

    callback(null, success({ status: true }));
  } catch (e) {
    console.error(e);
    callback(null, failure({ status: false }));
  }
}
