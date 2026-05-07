import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Situs Sedang Pemeliharaan',
  robots: 'noindex, nofollow',
};

export default async function MaintenancePage() {
  let message = 'Situs sedang dalam pemeliharaan. Silakan kembali lagi nanti.';

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/settings?select=maintenance_message`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        },
      }
    );
    
    if (res.ok) {
      const data = await res.json();
      if (data[0]?.maintenance_message) {
        message = data[0].maintenance_message;
      }
    }
  } catch {
    // Silently fail - use default message
  }

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Pemeliharaan</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px 20px;
            border-radius: 8px;
            max-width: 500px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          h1 {
            font-size: 2.5em;
            color: #333;
            margin-bottom: 20px;
          }
          p {
            font-size: 1.1em;
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .icon {
            font-size: 4em;
            margin-bottom: 20px;
          }
          .retry-info {
            font-size: 0.9em;
            color: #999;
            margin-top: 30px;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="icon">🔧</div>
          <h1>Pemeliharaan Situs</h1>
          <p>{message}</p>
          <div className="retry-info">
            Kami akan segera kembali. Terima kasih atas kesabaran Anda!
          </div>
        </div>
      </body>
    </html>
  );
}
