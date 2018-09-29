import stripePackage from "stripe";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context, callback) {
  try {
    const data = JSON.parse(event.body);

    // Load our secret key from the  environment variables
    const stripe = stripePackage(process.env.stripeSecretKey);

    await stripe.customers.create({
      email: data.email
    });

    callback(null, success({ status: true }));
  } catch (e) {
    console.error(e);
    callback(null, failure({ status: false }));
  }
}
