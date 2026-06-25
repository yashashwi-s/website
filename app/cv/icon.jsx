import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '4px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
        }}
      >
        <div style={{
          fontSize: 32,
          color: '#ffffff',
          fontWeight: 900,
          fontFamily: 'sans-serif',
          letterSpacing: '-2px',
          marginRight: '8px',
          marginBottom: '8px'
        }}>
          YS
        </div>
        
        {/* Corner cutout for CV */}
        <div style={{
          position: 'absolute',
          bottom: -4,
          right: -4,
          width: 36,
          height: 36,
          background: '#ffffff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 0 4px #050505'
        }}>
          <div style={{
            fontSize: 14,
            color: '#050505',
            fontWeight: 900,
            fontFamily: 'sans-serif',
            letterSpacing: '-0.5px',
            marginTop: '-2px',
            marginLeft: '-2px'
          }}>
            CV
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
