import uuid from "uuid";
import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      linkId: uuid.v1(),
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(
      null,
      success({
        linkId: params.Item.linkId
      })
    );
  } catch (e) {
    console.error(e);
    callback(null, failure({ status: false }));
  }
}
