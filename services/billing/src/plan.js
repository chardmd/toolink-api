import stripePackage from "stripe";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  let result = null;
  try {
    // Load our secret key from the  environment variables
    const stripe = stripePackage(process.env.stripeSecretKey);
    result = await stripe.plans.list({ limit: 3 });

    callback(null, success(result));
  } catch (e) {
    console.error(e);
    callback(null, failure(result));
  }
}
