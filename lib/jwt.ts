import { createHash, createHmac } from "node:crypto";
import AppError from "../utils/error.ts";
import type { TJwtPayload } from "../types/jwt";
import { JWT_EXPIRY_IN_SECONDS } from "./constants.ts";
import { getCurrentUnixTimestamp } from "../utils/getCurrentUnixTimeStamp.ts";

class Jwt {
  private secret: string;
  constructor(secret: string) {
    this.secret = secret;
  }
  encode(payload: TJwtPayload) {
    // bare implementation of jwt
    const header = {
      typ: "JWT",
      alg: "HS256",
    };
    const now = getCurrentUnixTimestamp();
    const exp = payload.exp ? payload.exp : now + JWT_EXPIRY_IN_SECONDS;
    const headerEncoded = Buffer.from(JSON.stringify(header)).toString(
      "base64url",
    );
    const payloadEncoded = Buffer.from(
      JSON.stringify({ ...payload, exp }),
    ).toString("base64url");
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

    const decoded = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const payload: TJwtPayload = JSON.parse(decoded);
    const isExpired = payload.exp
      ? getCurrentUnixTimestamp() > payload.exp
      : true;
    return {
      isValid: expectedSignature === signature,
      payload,
      isExpired,
    };
  }
}

export default Jwt;
