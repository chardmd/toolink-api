import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      FilterExpression:
        "userId = :userId and categoryId = :categoryId and isActive = :isActive",
      ProjectionExpression: "linkId",
      ExpressionAttributeValues: {
        ":userId": event.requestContext.identity.cognitoIdentityId,
        ":categoryId": event.pathParameters.categoryId,
        ":isActive": true
      }
    };
    const result = await dynamoDbLib.call("scan", params);

    for (let item of result.Items) {
      const updateParams = {
        TableName: process.env.TABLE_NAME,
        // 'Key' defines the partition key and sort key of the item to be updated
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'linkId': path parameter
        Key: {
          linkId: item.linkId,
          userId: event.requestContext.identity.cognitoIdentityId
        },

        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET isActive = :isActive",
        ExpressionAttributeValues: {
          ":isActive": false
        },
        ReturnValues: "ALL_NEW"
      };

      await dynamoDbLib.call("update", updateParams);
    }

    callback(null, success({ status: true }));
  } catch (e) {
    console.error(e);
    callback(null, failure({ status: false }));
  }
}
