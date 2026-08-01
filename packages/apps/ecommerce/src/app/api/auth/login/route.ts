import { generatePKCE, getAuthorizationUrl } from '@/lib/auth/keycloak'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const { codeVerifier, codeChallenge } = generatePKCE()
  const state = crypto.randomBytes(16).toString('hex')

  const response = NextResponse.redirect(getAuthorizationUrl(codeChallenge, state))

  response.cookies.set('pkce_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
  })

  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
  })

  return response
}
