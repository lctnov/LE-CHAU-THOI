export const runtime = 'nodejs';

export async function GET() {
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBg6W8a80AAAAASUVORK5CYII='; // 1x1 transparent PNG
  const bytes = Buffer.from(b64, 'base64');
  return new Response(bytes, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
