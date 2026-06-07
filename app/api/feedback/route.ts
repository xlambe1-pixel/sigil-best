import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { type, message, name } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'No message' }, { status: 400 })
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sigil Feedback <onboarding@resend.dev>',
        to: 'xlambe1@gmail.com',
        subject: `[${type.toUpperCase()}] Sigil Feedback from ${name || 'anonymous'}`,
        html: `
          <div style="font-family: monospace; padding: 20px;">
            <h2>New Feedback from sigil.best</h2>
            <p><strong>From:</strong> ${name || 'anonymous'}</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Message:</strong></p>
            <p style="background:#f5f5f5;padding:12px;border-radius:6px;">${message}</p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}