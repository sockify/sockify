import { jwtDecode } from "jwt-decode";

/** The decoded public claims from the signed auth, JWT token. */
export interface DecodedAuthToken {
  /** ID of the user that owns this token. */
  userId: number;
  /** Expiration time in seconds since Unix epoch. */
  expiredAt: number;
}

/**
 * Decodes a valid JWT token's public claims.
 * @param token string token representation
 * @returns a `DecodedAuthToken` with all claims OR if the token is invalid, it will return `null`.
 */
export function decodeJwtToken(token: string): DecodedAuthToken | null {
  let decodedToken: DecodedAuthToken | null = null;
  try {
    decodedToken = jwtDecode(token);
  } catch (e: unknown) {
    console.error(`Unable to decode JWT token "${token}" -> ${e}`);
  }

  return decodedToken;
}

/**
 * Determines if a JWT token has expired.
 * @param token string token representation
 * @returns true if token has not expired (or it was unable to be decoded), false otherwise
 */
export function isJwtTokenExpired(token: string): boolean {
  const decodedToken = decodeJwtToken(token);
  if (!decodedToken) {
    return true;
  }

  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
  return decodedToken.expiredAt < currentTimestampInSeconds;
}
