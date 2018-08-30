const urlParser = require("url");
const got = require("got");
import uuid from "uuid";
import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

const metascraper = require("metascraper")([
  require("metascraper-author")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-logo")(),
  require("metascraper-clearbit-logo")(),
  require("metascraper-publisher")(),
  require("metascraper-title")(),
  require("metascraper-url")(),
  require("metascraper-logo-favicon")(),
  require("metascraper-amazon")(),
  require("metascraper-youtube")(),
  require("metascraper-soundcloud")(),
  require("metascraper-video-provider")()
]);

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const validUrl = urlParser.parse(data.url, true);
  if (!validUrl) {
    return callback(
      null,
      failure({
        message:
          "Please supply an URL to be scraped in the url query parameter."
      })
    );
  }
  try {
    const { body: html, url } = await got(data.url);
    const metadata = await metascraper({ html, url });

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        userId: event.requestContext.identity.cognitoIdentityId,
        categoryId: data.categoryId,
        linkId: uuid.v1(),
        author: metadata.author,
        description: metadata.description,
        image: metadata.image,
        logo: metadata.logo,
        publisher: metadata.publisher,
        title: metadata.title,
        urlText: metadata.url,
        lang: metadata.lang,
        video: metadata.video,
        createdAt: Date.now()
      }
    };

    await dynamoDbLib.call("put", params);

    // Return the retrieved item
    callback(null, success(metadata));
  } catch (e) {
    console.error(e);
    callback(
      null,
      failure({
        message: `Scraping the open graph data from ${url} failed.
          \nsuggestion: 'Make sure your URL is correct and the webpage has open graph data, meta tags or twitter card data.`
      })
    );
  }
}
