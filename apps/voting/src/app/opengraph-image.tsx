import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Photography Lounge — Discussion Prompt Voting';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0c1929 0%, #162a44 50%, #0c1929 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(116, 215, 236, 0.12)', filter: 'blur(80px)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(255, 133, 200, 0.08)', filter: 'blur(80px)', display: 'flex' }} />

        {/* Logo */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #74D7EC, #FF85C8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 800,
            color: '#0a0a0a',
            marginBottom: 32,
          }}
        >
          P
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#e8f4f8',
            letterSpacing: '-0.02em',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          Discussion Prompt Voting
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#8ab4c7',
            marginBottom: 48,
            display: 'flex',
          }}
        >
          Photography Lounge Community
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['Vote on 400+ prompts', 'Submit your own', 'Shape the community'].map((label) => (
            <div
              key={label}
              style={{
                padding: '10px 24px',
                borderRadius: 99,
                border: '1px solid rgba(116, 215, 236, 0.2)',
                background: 'rgba(116, 215, 236, 0.08)',
                color: '#74D7EC',
                fontSize: 16,
                fontWeight: 500,
                display: 'flex',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
