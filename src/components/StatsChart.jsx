import React from 'react';
import { BarChart3, Flame, Snowflake, Info } from 'lucide-react';
import LottoBall from './LottoBall';
import { getBallColorInfo } from '../utils/lottoColors';

export default function StatsChart({
  stats,
  loading,
  drawWindow,
  onChangeDrawWindow,
  onSelectNumberToInclude,
  onSelectNumberToExclude,
}) {
  if (loading || !stats) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 shadow-xl">
        <BarChart3 className="w-8 h-8 mx-auto mb-2 animate-bounce text-amber-400" />
        <p className="text-sm font-semibold">동행복권 당첨 통계 불러오는 중...</p>
      </div>
    );
  }

  const { frequencies = {}, hotNumbers = [], coldNumbers = [], analyzedCount = 30 } = stats;

  // Find max frequency for chart scaling
  const maxCount = Math.max(...Object.values(frequencies), 1);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>회차별 번호 출현 빈도수 (Hot / Cold)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            최근 {analyzedCount}회차 당첨 데이터 분석 (1~45번 공 색상별 집계)
          </p>
        </div>

        {/* Window Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[20, 30, 40, 50].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => onChangeDrawWindow(count)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                drawWindow === count
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {count}회
            </button>
          ))}
        </div>
      </div>

      {/* Hot & Cold Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hot Numbers Box */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              🔥 가장 많이 나온 번호 (HOT TOP 6)
            </h3>
            <span className="text-[11px] text-amber-500/80 font-medium">클릭 시 고정수 지정</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {hotNumbers.map((item) => (
              <div key={item.number} className="flex flex-col items-center gap-1">
                <LottoBall
                  number={item.number}
                  size="md"
                  status="hot"
                  onClick={() => onSelectNumberToInclude && onSelectNumberToInclude(item.number)}
                />
                <span className="text-[10px] font-bold text-amber-300">
                  {item.count}회
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cold Numbers Box */}
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-cyan-500" />
              ❄️ 가장 적게 나온 번호 (COLD TOP 6)
            </h3>
            <span className="text-[11px] text-cyan-500/80 font-medium">클릭 시 제외수 지정</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {coldNumbers.map((item) => (
              <div key={item.number} className="flex flex-col items-center gap-1">
                <LottoBall
                  number={item.number}
                  size="md"
                  status="cold"
                  onClick={() => onSelectNumberToExclude && onSelectNumberToExclude(item.number)}
                />
                <span className="text-[10px] font-bold text-cyan-300">
                  {item.count}회
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequency Bar Heatmap Chart Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
          <span>번호별 출현 횟수 차트</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5" />
            막대가 길수록 가중치(확률) 증가
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800 max-h-[420px] overflow-y-auto">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
            const count = frequencies[num] || 0;
            const percentage = Math.round((count / maxCount) * 100);
            const ballColor = getBallColorInfo(num);

            return (
              <div
                key={num}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <LottoBall number={num} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="text-slate-300">{num}번</span>
                    <span className="text-amber-400">{count}회</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: ballColor.bg,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
