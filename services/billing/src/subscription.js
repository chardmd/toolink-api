import stripePackage from "stripe";
import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  let result = null;
  try {
    const data = JSON.parse(event.body);

    // Load our secret key from the  environment variables
    const stripe = stripePackage(process.env.stripeSecretKey);

    const customer = await stripe.customers.create({
      email: data.email,
      source: data.source // this is used by stripe for creating credit card details
    });

    result = await stripe.subscriptions.create({
      customer: customer.id,
      plan: data.planId
    });

    //save user details
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        userId: event.requestContext.identity.cognitoIdentityId,
        email: data.email,
        createdAt: Date.now()
      }
    };
    await dynamoDbLib.call("put", params);

    callback(null, success(result));
  } catch (e) {
    console.error(e);
    callback(null, failure(result));
  }
}
