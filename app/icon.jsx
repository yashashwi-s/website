import { ImageResponse } from 'next/og';
 
// Route segment config
export const runtime = 'edge';
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 20,
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 900,
          fontFamily: 'sans-serif',
          letterSpacing: '-2px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        YS
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
