import React from 'react';
import { getBallColorInfo } from '../utils/lottoColors';

export default function LottoBall({
  number,
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  isSelected = false,
  status = 'none', // 'include', 'exclude', 'hot', 'cold', 'none'
  onClick,
  className = '',
  animDelay = 0,
}) {
  const color = getBallColorInfo(number);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-9 h-9 text-sm font-bold',
    lg: 'w-11 h-11 text-base font-extrabold',
    xl: 'w-14 h-14 text-xl font-extrabold',
  };

  const statusBorder = {
    include: 'ring-4 ring-emerald-400 border-2 border-emerald-500 scale-105',
    exclude: 'opacity-40 grayscale filter cross-through border-2 border-rose-500',
    hot: 'ring-2 ring-amber-400',
    cold: 'ring-2 ring-cyan-400',
    none: '',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      style={{
        background: color.gradient,
        color: color.text,
        boxShadow: isSelected
          ? `0 0 15px ${color.glow}, inset -2px -2px 5px rgba(0,0,0,0.5)`
          : `inset -2px -2px 4px rgba(0,0,0,0.35), inset 2px 2px 4px rgba(255,255,255,0.6), 0 3px 6px rgba(0,0,0,0.3)`,
        animationDelay: `${animDelay}ms`,
      }}
      className={`relative inline-flex items-center justify-center rounded-full select-none lotto-ball-sphere transition-all duration-200 ${
        sizeClasses[size] || sizeClasses.md
      } ${statusBorder[status] || ''} ${className}`}
    >
      <span className="drop-shadow-sm font-bold tracking-tighter">
        {String(number).padStart(2, '0')}
      </span>

      {/* Overlay Status Badge */}
      {status === 'include' && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[10px] flex items-center justify-center border border-slate-900 shadow">
          📌
        </span>
      )}
      {status === 'exclude' && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center border border-slate-900 shadow">
          ✕
        </span>
      )}
    </button>
  );
}
