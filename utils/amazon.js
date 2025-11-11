import crypto from "crypto";

const host = "webservices.amazon.com";
const region = "us-east-1";
const service = "ProductAdvertisingAPI";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function sign(payload, accessKey, secretKey, endpoint, target) {
  const amzDate = new Date().toISOString().replace(/[-:]|\..*/g, "") + "Z";
  const dateStamp = amzDate.slice(0, 8);
  const canonicalHeaders =
    "content-encoding:amz-1.0\n" +
    "content-type:application/json; charset=UTF-8\n" +
    `host:${host}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:${target}\n`;
  const signedHeaders =
    "content-encoding;content-type;host;x-amz-date;x-amz-target";
  const payloadHash = crypto
    .createHash("sha256")
    .update(payload, "utf8")
    .digest("hex");
  const canonicalRequest = [
    "POST",
    endpoint,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    crypto
      .createHash("sha256")
      .update(canonicalRequest, "utf8")
      .digest("hex"),
  ].join("\n");
  const kDate = crypto
    .createHmac("sha256", "AWS4" + secretKey)
    .update(dateStamp)
    .digest();
  const kRegion = crypto.createHmac("sha256", kDate).update(region).digest();
  const kService = crypto.createHmac("sha256", kRegion).update(service).digest();
  const kSigning = crypto
    .createHmac("sha256", kService)
    .update("aws4_request")
    .digest();
  const signature = crypto
    .createHmac("sha256", kSigning)
    .update(stringToSign)
    .digest("hex");
  const authorizationHeader =
    `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return { amzDate, authorizationHeader };
}

function readAmazonEnvValue(names) {
  for (const name of names) {
    const value = process.env[name];
    if (isNonEmptyString(value)) {
      return value.trim();
    }
  }
  return undefined;
}

function getAccessKey() {
  return readAmazonEnvValue([
    "AMAZON_ACCESS_KEY",
    "AMAZON_ACCESS_KEY_ID",
    "AMAZON_PAAPI_ACCESS_KEY",
    "AWS_ACCESS_KEY_ID",
  ]);
}

function getSecretKey() {
  return readAmazonEnvValue([
    "AMAZON_SECRET_KEY",
    "AMAZON_SECRET_ACCESS_KEY",
    "AMAZON_PAAPI_SECRET_KEY",
    "AWS_SECRET_ACCESS_KEY",
  ]);
}

function getAssociateTag() {
  return readAmazonEnvValue([
    "AMAZON_ASSOCIATE_TAG",
    "AMAZON_PARTNER_TAG",
    "ASSOCIATE_TAG",
  ]);
}

export function hasAmazonCredentials() {
  return (
    isNonEmptyString(getAccessKey()) &&
    isNonEmptyString(getSecretKey()) &&
    isNonEmptyString(getAssociateTag())
  );
}

function getCredentials() {
  const accessKey = getAccessKey();
  const secretKey = getSecretKey();
  const associateTag = getAssociateTag();
  if (!hasAmazonCredentials()) {
    throw new Error("Missing Amazon API credentials");
  }
  return { accessKey, secretKey, associateTag };
}

async function callAmazon(endpoint, target, payload) {
  const { accessKey, secretKey } = getCredentials();
  const { amzDate, authorizationHeader } = sign(
    payload,
    accessKey,
    secretKey,
    endpoint,
    target
  );
  const response = await fetch(`https://${host}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Encoding": "amz-1.0",
      "Content-Type": "application/json; charset=UTF-8",
      Host: host,
      "X-Amz-Date": amzDate,
      "X-Amz-Target": target,
      Authorization: authorizationHeader,
    },
    body: payload,
  });
  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorText = await response.text();
      if (errorText) {
        errorMessage = `${errorMessage ? `${errorMessage} - ` : ""}${errorText}`;
      }
    } catch (readError) {
      // If reading the error body fails, fall back to the status text.
      errorMessage = errorMessage || "Unable to read error body";
    }
    throw new Error(`Amazon API error: ${response.status}${
      errorMessage ? ` ${errorMessage}` : ""
    }`);
  }
  return response.json();
}

export async function searchItems(keywords) {
  const { associateTag } = getCredentials();
  const payload = JSON.stringify({
    Keywords: keywords,
    Marketplace: "www.amazon.com",
    PartnerTag: associateTag,
    PartnerType: "Associates",
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "ItemInfo.Features",
      "ItemInfo.ProductInfo",
      "Offers.Listings.Price",
      "Offers.Summaries.LowestPrice",
    ],
  });
  return callAmazon(
    "/paapi5/searchitems",
    "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
    payload
  );
}

export async function getItems(asins) {
  if (!Array.isArray(asins) || asins.length === 0) {
    throw new Error("ASIN list is required for GetItems");
  }
  const { associateTag } = getCredentials();
  const payload = JSON.stringify({
    ItemIds: asins,
    Marketplace: "www.amazon.com",
    PartnerTag: associateTag,
    PartnerType: "Associates",
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "ItemInfo.Features",
      "Offers.Listings.Price",
      "Offers.Summaries.LowestPrice",
    ],
  });
  return callAmazon(
    "/paapi5/getitems",
    "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
    payload
  );
}
