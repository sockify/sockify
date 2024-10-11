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
 * @returns a `DecodedAuthToken` with all claims.
 */
export function decodeJwtToken(token: string): DecodedAuthToken {
  const decodedToken: DecodedAuthToken = jwtDecode(token);
  return decodedToken;
}

/**
 * Determines if a JWT token has expired.
 * @param token string token representation
 * @returns true if token has not expired, false otherwise
 */
export function isJwtTokenExpired(token: string): boolean {
  const decodedToken = decodeJwtToken(token);
  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
  return decodedToken.expiredAt < currentTimestampInSeconds;
}
