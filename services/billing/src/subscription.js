import stripePackage from "stripe";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  let result = null;
  try {
    const data = JSON.parse(event.body);

    // Load our secret key from the  environment variables
    const stripe = stripePackage(process.env.stripeSecretKey);

    result = await stripe.subscriptions.create({
      customer: data.customer,
      plan: data.planId
    });

    callback(null, success(result));
  } catch (e) {
    console.error(e);
    callback(null, failure(result));
  }
}
