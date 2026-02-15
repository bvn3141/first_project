import { formatEur } from '../../utils/formatters';

interface Transfer {
  player_name: string;
  from_club: string;
  to_club: string;
  fee: number;
}

interface Props {
  data: Transfer[];
}

export default function TopTransfersTable({ data }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1e1e2e]">
            <th className="text-left text-[10px] font-mono text-[#555568] uppercase tracking-wider px-3 py-2">
              #
            </th>
            <th className="text-left text-[10px] font-mono text-[#555568] uppercase tracking-wider px-3 py-2">
              Player
            </th>
            <th className="text-left text-[10px] font-mono text-[#555568] uppercase tracking-wider px-3 py-2">
              From
            </th>
            <th className="text-left text-[10px] font-mono text-[#555568] uppercase tracking-wider px-3 py-2">
              To
            </th>
            <th className="text-right text-[10px] font-mono text-[#555568] uppercase tracking-wider px-3 py-2">
              Fee
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((t, i) => (
            <tr
              key={i}
              className="border-b border-[#1e1e2e]/50 hover:bg-[#1a1a24] transition-colors"
            >
              <td className="text-xs font-mono text-[#555568] px-3 py-2.5">
                {i + 1}
              </td>
              <td className="text-xs font-mono text-[#e8e8f0] font-medium px-3 py-2.5">
                {t.player_name}
              </td>
              <td className="text-xs font-mono text-[#8888a0] px-3 py-2.5">
                {t.from_club}
              </td>
              <td className="text-xs font-mono text-[#8888a0] px-3 py-2.5">
                {t.to_club}
              </td>
              <td className="text-xs font-mono text-[#fb8b1e] font-bold text-right px-3 py-2.5">
                {t.fee > 0 ? formatEur(t.fee) : 'FREE'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
