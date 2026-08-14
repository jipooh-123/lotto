import React from 'react';
import { Dices, Sparkles, HelpCircle, RefreshCw, BarChart3 } from 'lucide-react';
import LottoBall from './LottoBall';

export default function Header({
  latestDraw,
  loadingLatest,
  activeTab,
  setActiveTab,
  onOpenGuide,
  onRefresh,
}) {
  const drawNumbers = latestDraw?.latestDrawNumbers || latestDraw?.numbers || [];
  const bonusNo = latestDraw?.latestDrawBonus || latestDraw?.bnusNo;

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
              <Dices className="w-7 h-7 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  로또 6/45 <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">AI 가중치 생성기</span>
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                과거 당첨 통계 기반 Weighted Random Sampling & 고정/제외수 알고리즘
              </p>
            </div>
          </div>

          {/* Latest Draw Summary Banner */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2 text-xs">
            {loadingLatest ? (
              <div className="flex items-center gap-2 text-slate-400">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>최신 당첨 정보 로딩 중...</span>
              </div>
            ) : latestDraw ? (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>제 {latestDraw.latestDrawNo || latestDraw.drwNo}회</span>
                  <span className="text-slate-500 text-[10px]">({latestDraw.latestDrawDate || latestDraw.drwNoDate})</span>
                </div>
                <div className="flex items-center gap-1">
                  {drawNumbers.map((n) => (
                    <LottoBall key={n} number={n} size="sm" />
                  ))}
                  {bonusNo && (
                    <>
                      <span className="text-slate-500 font-bold px-0.5">+</span>
                      <LottoBall number={bonusNo} size="sm" className="ring-2 ring-amber-400/50" />
                    </>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-slate-500">당첨 정보 준비 중</span>
            )}

            <button
              type="button"
              onClick={onRefresh}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="데이터 새로고침"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLatest ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'generator'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Dices className="w-4 h-4" />
              5게임 생성기
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'stats'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              회차별 출현 통계
            </button>
          </nav>

          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-amber-300 hover:bg-slate-800/70 border border-slate-800 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            알고리즘 가이드
          </button>
        </div>
      </div>
    </header>
  );
}
