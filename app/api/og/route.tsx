import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasName = searchParams.has('name');
    const name = hasName
      ? searchParams.get('name')?.slice(0, 100)
      : 'dApp';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Background effects */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle at 50% 120%, rgba(117,149,255,0.2) 0%, transparent 50%)',
              zIndex: 0,
            }}
          />
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
              <div style={{ fontSize: 72, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>
                {name}
              </div>
              <div style={{ fontSize: 72, margin: '0 32px' }}>
                🤝
              </div>
              <div style={{ fontSize: 72, fontWeight: 800, color: '#7595FF', letterSpacing: '-0.03em' }}>
                SmoothSend
              </div>
            </div>
            
            <div style={{ display: 'flex', fontSize: 36, color: '#a1a1aa', fontWeight: 500, letterSpacing: '-0.02em' }}>
              Pilot Program Applicant
            </div>

            <div style={{ 
              display: 'flex',
              marginTop: '60px', 
              padding: '16px 32px', 
              borderRadius: '100px', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              alignItems: 'center',
            }}>
              100% Gasless TXs on Aptos
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
