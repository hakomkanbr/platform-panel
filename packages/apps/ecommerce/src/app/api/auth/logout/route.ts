import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:5000'

export async function POST() {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value

  if (refreshToken) {
    try {
      await fetch(`${GATEWAY_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const response = NextResponse.redirect(new URL('/login', new URL(GATEWAY_URL).origin))
  response.cookies.delete('access_token')
  response.cookies.delete('refresh_token')
  return response
}
