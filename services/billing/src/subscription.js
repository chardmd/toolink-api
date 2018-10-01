import stripePackage from "stripe";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  let result = null;
  try {
    const data = JSON.parse(event.body);

    // Load our secret key from the  environment variables
    const stripe = stripePackage(process.env.stripeSecretKey);

    const customer = await stripe.customers.create({
      email: data.email,
      source // this is used by stripe for creating credit card details
    });

    result = await stripe.subscriptions.create({
      customer: customer.id,
      plan: data.planId
    });

    callback(null, success(result));
  } catch (e) {
    console.error(e);
    callback(null, failure(result));
  }
}
