import AuspiceApp from '@/components/AuspiceApp';
export const metadata = { title: 'Your sanctuary', robots: { index: false, follow: false } };
export default async function Sanctuary({ searchParams }: { searchParams: Promise<{tool?: string}> }) {
  const { tool } = await searchParams;
  const valid = ['today','tarot','iching','astrology','fengshui','synthesis','journal','account'];
  return <AuspiceApp initialTool={(valid.includes(tool || '') ? tool : 'today') as 'today'|'tarot'|'iching'|'astrology'|'fengshui'|'synthesis'|'journal'|'account'} />;
}
