import { drawTarot } from '@/lib/traditions';
export const dynamic = 'force-dynamic';
export function GET() { return Response.json(drawTarot(), { headers: { 'Cache-Control': 'no-store' } }); }
