import stripePackage from "stripe";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  let result = null;
  try {
    // Load our secret key from the  environment variables
    const stripe = stripePackage(process.env.stripeSecretKey);
    const customerId = event.pathParameters.id;
    result = await stripe.customers.retrieve(customerId);
    callback(null, success(result));
  } catch (e) {
    console.error(e);
    callback(null, failure(result));
  }
}
