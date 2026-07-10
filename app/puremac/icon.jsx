import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// A squircle with a circular bite taken out of one corner: "one pure app, cut clean
// from the rest." Same squircle language as Fadeo's own icon, so the family reads as
// related, but reduced to a mark simple enough to survive a 32px tab.
export default function Icon() {
  const bg = '#0a0a0a';
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 22,
            height: 22,
            display: 'flex',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              background: '#67e4d2',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              width: 13,
              height: 13,
              borderRadius: '50%',
              background: bg,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
