import { colors } from '../../theme/colors';

interface HeatmapData {
  league: string;
  season: string;
  volatility: number;
}

interface Props {
  data: HeatmapData[];
}

function getColor(value: number, min: number, max: number): string {
  const ratio = (value - min) / (max - min);
  if (ratio < 0.3) return colors.accent.cyan;
  if (ratio < 0.5) return '#2dd4a0';
  if (ratio < 0.7) return colors.accent.amber;
  if (ratio < 0.85) return '#ff6b35';
  return colors.accent.red;
}

export default function VolatilityHeatmap({ data }: Props) {
  const leagues = [...new Set(data.map((d) => d.league))];
  const seasons = [...new Set(data.map((d) => d.season))].sort();
  const values = data.map((d) => d.volatility);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const getValue = (league: string, season: string) => {
    const match = data.find((d) => d.league === league && d.season === season);
    return match?.volatility ?? 0;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left text-[10px] font-mono text-[#555568] px-2 py-1.5 w-36">
              League
            </th>
            {seasons.map((s) => (
              <th
                key={s}
                className="text-center text-[10px] font-mono text-[#555568] px-2 py-1.5"
              >
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leagues.map((league) => (
            <tr key={league}>
              <td className="text-xs font-mono text-[#8888a0] px-2 py-1">
                {league}
              </td>
              {seasons.map((season) => {
                const val = getValue(league, season);
                return (
                  <td key={season} className="px-1 py-1">
                    <div
                      className="rounded text-center text-[11px] font-mono font-bold py-2 px-2"
                      style={{
                        backgroundColor: getColor(val, min, max) + '22',
                        color: getColor(val, min, max),
                        border: `1px solid ${getColor(val, min, max)}33`,
                      }}
                    >
                      {val.toFixed(1)}%
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-4 mt-3 px-2">
        <span className="text-[10px] font-mono text-[#555568]">Low Risk</span>
        <div className="flex gap-0.5">
          {['#4af6c3', '#2dd4a0', '#FFA028', '#ff6b35', '#ff433d'].map((c) => (
            <div
              key={c}
              className="w-8 h-2 rounded-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-[#555568]">High Risk</span>
      </div>
    </div>
  );
}
