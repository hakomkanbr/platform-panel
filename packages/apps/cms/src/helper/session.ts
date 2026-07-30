import { decodeJwt } from 'jose'

export async function getTokenPayload(token: string) {
  try {
    return decodeJwt(token);
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
}


