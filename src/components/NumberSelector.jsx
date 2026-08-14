import React, { useState } from 'react';
import { Pin, Slash, RotateCcw, Flame, Snowflake, AlertCircle } from 'lucide-react';
import LottoBall from './LottoBall';

export default function NumberSelector({
  includes,
  excludes,
  onToggleInclude,
  onToggleExclude,
  onReset,
  onPresetHot,
  onPresetCold,
  hotNumbers = [],
  coldNumbers = [],
}) {
  const [mode, setMode] = useState('include'); // 'include' or 'exclude'
  const [warningMessage, setWarningMessage] = useState('');

  const showWarning = (msg) => {
    setWarningMessage(msg);
    setTimeout(() => setWarningMessage(''), 3000);
  };

  const handleBallClick = (num) => {
    if (mode === 'include') {
      if (excludes.includes(num)) {
        showWarning(`번호 ${num}번은 이미 제외수로 지정되어 있습니다. 제외를 먼저 해제하세요.`);
        return;
      }
      if (!includes.includes(num) && includes.length >= 5) {
        showWarning('고정수는 최대 5개까지만 지정할 수 있습니다.');
        return;
      }
      onToggleInclude(num);
    } else {
      if (includes.includes(num)) {
        showWarning(`번호 ${num}번은 이미 고정수로 지정되어 있습니다. 고정을 먼저 해제하세요.`);
        return;
      }
      if (!excludes.includes(num) && excludes.length >= 10) {
        showWarning('제외수는 최대 10개까지만 지정할 수 있습니다.');
        return;
      }
      onToggleExclude(num);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>번호 맞춤 필터</span>
            <span className="text-xs font-normal text-slate-400">
              (고정수 최대 5개 / 제외수 최대 10개)
            </span>
          </h2>
        </div>

        {/* Mode Selector Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('include')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'include'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
            고정수 선택 ({includes.length}/5)
          </button>
          <button
            type="button"
            onClick={() => setMode('exclude')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'exclude'
                ? 'bg-rose-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Slash className="w-3.5 h-3.5" />
            제외수 선택 ({excludes.length}/10)
          </button>
        </div>
      </div>

      {/* Warning Alert Banner */}
      {warningMessage && (
        <div className="mb-4 px-3 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-bounce">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Presets & Quick Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPresetHot}
            disabled={hotNumbers.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            🔥 최다 출현수 고정
          </button>
          <button
            type="button"
            onClick={onPresetCold}
            disabled={coldNumbers.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all disabled:opacity-50"
          >
            <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            ❄️ 최소 출현수 제외
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          초기화
        </button>
      </div>

      {/* Currently Selected Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
        {/* Fixed list */}
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 min-h-[42px]">
          <span className="font-semibold text-emerald-400 shrink-0 flex items-center gap-1">
            📌 고정수:
          </span>
          {includes.length === 0 ? (
            <span className="text-slate-500 italic">선택 없음</span>
          ) : (
            <div className="flex flex-wrap items-center gap-1">
              {includes.map((num) => (
                <LottoBall
                  key={num}
                  number={num}
                  size="sm"
                  status="include"
                  onClick={() => onToggleInclude(num)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Excluded list */}
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 min-h-[42px]">
          <span className="font-semibold text-rose-400 shrink-0 flex items-center gap-1">
            🚫 제외수:
          </span>
          {excludes.length === 0 ? (
            <span className="text-slate-500 italic">선택 없음</span>
          ) : (
            <div className="flex flex-wrap items-center gap-1">
              {excludes.map((num) => (
                <LottoBall
                  key={num}
                  number={num}
                  size="sm"
                  status="exclude"
                  onClick={() => onToggleExclude(num)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 1..45 Lotto Ball Selection Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-9 lg:grid-cols-9 gap-2 justify-items-center bg-slate-950/80 p-4 rounded-xl border border-slate-800">
        {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
          let status = 'none';
          if (includes.includes(num)) status = 'include';
          if (excludes.includes(num)) status = 'exclude';

          return (
            <LottoBall
              key={num}
              number={num}
              size="md"
              status={status}
              onClick={() => handleBallClick(num)}
            />
          );
        })}
      </div>
    </div>
  );
}
