import uuid from "uuid";
import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.CATEGORY_TABLE_NAME,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      categoryId: uuid.v1(),
      categoryName: data.categoryName,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(
      null,
      success({
        categoryId: params.Item.categoryId,
        categoryName: params.Item.categoryName
      })
    );
  } catch (e) {
    console.error(e);
    callback(null, failure({ status: false }));
  }
}
