import { useData } from '../../hooks/useData';
import { formatEur } from '../../utils/formatters';

interface Transfer {
  player_name: string;
  from_club: string;
  to_club: string;
  fee: number;
}

const MOCK_TRANSFERS: Transfer[] = [
  { player_name: 'K. Mbappe', from_club: 'PSG', to_club: 'Real Madrid', fee: 0 },
  { player_name: 'J. Bellingham', from_club: 'Dortmund', to_club: 'Real Madrid', fee: 103000000 },
  { player_name: 'D. Rice', from_club: 'West Ham', to_club: 'Arsenal', fee: 116600000 },
  { player_name: 'M. Caicedo', from_club: 'Brighton', to_club: 'Chelsea', fee: 115000000 },
  { player_name: 'K. Havertz', from_club: 'Chelsea', to_club: 'Arsenal', fee: 65000000 },
  { player_name: 'M. Mount', from_club: 'Chelsea', to_club: 'Man Utd', fee: 64200000 },
];

export default function Ticker() {
  const { data } = useData<Transfer[]>('top_transfers.json');
  const transfers = data ?? MOCK_TRANSFERS;

  const tickerContent = transfers
    .map((t) => {
      const fee = t.fee > 0 ? formatEur(t.fee) : 'FREE';
      return `${t.player_name}  ${t.from_club} \u2192 ${t.to_club}  ${fee}`;
    })
    .join('     \u2502     ');

  return (
    <div className="h-7 bg-[#111118] border-b border-[#1e1e2e] overflow-hidden relative">
      <div className="ticker-scroll flex items-center h-full whitespace-nowrap">
        <span className="text-[11px] font-mono text-[#8888a0] px-4">
          {tickerContent}
        </span>
        <span className="text-[11px] font-mono text-[#8888a0] px-4">
          {tickerContent}
        </span>
      </div>
    </div>
  );
}
