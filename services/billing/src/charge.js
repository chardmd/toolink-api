import stripePackage from "stripe";
import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  try {
    const { source } = JSON.parse(event.body);

    // Load our secret key from the  environment variables
    const stripe = stripePackage(process.env.stripeSecretKey);

    await stripe.charges.create({
      source,
      amount: 1600,
      description: "billing",
      currency: "usd"
    });

    callback(null, success({ status: true }));
  } catch (e) {
    console.error(e);
    callback(null, failure({ status: false }));
  }
}
