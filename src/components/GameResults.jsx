import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Layers } from 'lucide-react';
import LottoBall from './LottoBall';

export default function GameResults({
  games,
  onGenerate,
  isGenerating,
  includes = [],
  excludes = [],
  analyzedDraws = 30,
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const formatGameString = (game) => {
    const formattedNums = game.numbers
      .map((n) => String(n).padStart(2, '0'))
      .join(', ');
    return `게임 ${game.label} : ${formattedNums}`;
  };

  const copyToClipboard = (text, index = null) => {
    navigator.clipboard.writeText(text);
    if (index !== null) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const copyAllGames = () => {
    if (!games || games.length === 0) return;
    const header = `[로또 6/45 AI 가중치 자동추첨 5게임 (최근 ${analyzedDraws}회 통계 반영)]\n`;
    const body = games.map((g) => formatGameString(g)).join('\n');
    copyToClipboard(header + body);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>AI 가중치 추첨 결과 (5게임)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            과거 {analyzedDraws}회차 당첨 빈도수 가중치 적용 & 오름차순 정렬 완료
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* Copy All Button */}
          <button
            type="button"
            onClick={copyAllGames}
            disabled={!games || games.length === 0}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              copiedAll
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-amber-400" />}
            {copiedAll ? '전체 복사 완료!' : '5게임 전체 복사'}
          </button>

          {/* Re-generate Button */}
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex-1 sm:flex-initial relative group overflow-hidden flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span>{isGenerating ? '번호 추출 중...' : '5게임 다시 추출'}</span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </div>

      {/* Generated Games Container */}
      {!games || games.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <Layers className="w-12 h-12 mx-auto mb-3 text-slate-700 animate-pulse" />
          <p className="text-sm font-semibold">버튼을 눌러 5게임 자동 추출을 시작하세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {games.map((game, idx) => (
            <div
              key={game.label || idx}
              className="group flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-950 transition-all shadow-inner"
            >
              {/* Game Label & Info */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-black text-sm text-amber-400 shadow">
                  {game.label}
                </span>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                  게임 {game.label}
                </span>
              </div>

              {/* 6 Lotto Balls */}
              <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 py-1">
                {game.numbers.map((num, ballIdx) => {
                  const isFixed = includes.includes(num);
                  return (
                    <LottoBall
                      key={num}
                      number={num}
                      size="lg"
                      status={isFixed ? 'include' : 'none'}
                      animDelay={ballIdx * 60}
                      className={isGenerating ? 'animate-ball-pop' : ''}
                    />
                  );
                })}
              </div>

              {/* Single Game Copy Button */}
              <button
                type="button"
                onClick={() => copyToClipboard(formatGameString(game), idx)}
                className={`self-end sm:self-auto p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  copiedIndex === idx
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                }`}
                title="이 게임 복사"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">복사</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
