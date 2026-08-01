import { exchangeCodeForTokens } from '@/lib/auth/keycloak'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieStore = cookies()
  const storedState = cookieStore.get('oauth_state')?.value
  const codeVerifier = cookieStore.get('pkce_verifier')?.value

  if (!code || !state || state !== storedState || !codeVerifier) {
    return NextResponse.json({ error: 'Invalid callback parameters' }, { status: 400 })
  }

  try {
    const tokens = await exchangeCodeForTokens(code, codeVerifier)
    const response = NextResponse.redirect(new URL('/tenant', request.url))
    response.cookies.delete('pkce_verifier')
    response.cookies.delete('oauth_state')
    response.cookies.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
    })
    response.cookies.set('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })
    // Also store in localStorage for client-side API client
    response.cookies.set('kcToken', tokens.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
    })
    return response
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
