import { createHash, createHmac } from "node:crypto";
import AppError from "../utils/error.ts";

class Jwt {
  secret: string;
  constructor(secret: string) {
    this.secret = secret;
  }
  encode(payload: Record<string, any>) {
    // bare implementation of jwt
    const header = {
      typ: "JWT",
      alg: "HS256",
    };
    const headerEncoded = Buffer.from(JSON.stringify(header)).toString(
      "base64url",
    );
    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString(
      "base64url",
    );
    let hash = createHmac("sha256", this.secret);
    hash = hash.update(headerEncoded + "." + payloadEncoded);
    const signature = hash.digest("base64url");
    const token = headerEncoded + "." + payloadEncoded + "." + signature;
    return token;
  }
  decode(token: string) {
    // split the token
    const tokenArray = token.split(".");
    if (tokenArray.length !== 3) {
      throw new AppError("Invalid token", "INVALID_TOKEN", 500);
    }
    const encodedHeader = tokenArray[0];
    const encodedPayload = tokenArray[1];
    const signature = tokenArray[2];
    const data = encodedHeader + "." + encodedPayload;
    const expectedSignature = createHmac("sha256", this.secret)
      .update(data)
      .digest("base64url");
    console.log({
      expectedSignature,
      signature,
      r: expectedSignature === signature,
    });
    return expectedSignature === signature;
  }
}

export default Jwt;
