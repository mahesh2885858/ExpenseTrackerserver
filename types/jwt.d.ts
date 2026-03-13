export type TJwtPayload = {
  sub: number; //userid
  iss?: string; //issuer who issued this
  aud?: string; //Audience who is this for
  exp?: number; //expiration time (unix seconds)
  iat?: number; //Issued at
  nbf?: number; // not valid before
  jti?: string; // JWT unique id
};
