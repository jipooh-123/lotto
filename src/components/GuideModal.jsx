import React from 'react';
import { X, Cpu, CheckCircle2, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';

export default function GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-hidden relative space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">알고리즘 및 가중치 추첨 작동 방식</h2>
            <p className="text-xs text-slate-400">Weighted Random Sampling Algorithm Guide</p>
          </div>
        </div>

        {/* Formula Section */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>가중치 계산 공식 (Weight Formula)</span>
          </div>
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center font-mono text-sm text-slate-200">
            Weight(n) = Count(n) + Base Weight
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            최근 회차(20~50회)에서 자주 나온 번호일수록 <code className="text-amber-300 font-semibold">Count(n)</code>이 높아져 무작위 추첨 시 선택될 확률이 커집니다. 단, 한번도 안 나온 번호도 최소한의 출현 기회(<code className="text-slate-300">Base Weight=1</code>)를 부여받습니다.
          </p>
        </div>

        {/* Selection Steps */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            추첨 3단계 프로세스
          </h3>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
              <div>
                <span className="font-bold text-white">고정수(Inclusion) 우선 배치:</span>
                <p className="text-slate-400 mt-0.5">지정한 고정수(최대 5개)를 모든 게임 세트의 기본 구성 번호로 100% 확정 포함합니다.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
              <div>
                <span className="font-bold text-white">제외수(Exclusion) 리스트 완화:</span>
                <p className="text-slate-400 mt-0.5">지정한 제외수(최대 10개)는 1~45번 가중치 데이터베이스에서 완전히 삭제하여 절대 선택되지 않도록 합니다.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
              <div>
                <span className="font-bold text-white">중복 없는 비복원 가중 무작위 추출:</span>
                <p className="text-slate-400 mt-0.5">남은 슬롯(6 - 고정수 개수)이 모두 채워질 때까지 가중치 비율 기반 무작위 비복원 추출을 진행한 후 오름차순으로 자동 정렬합니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Confirm Button */}
        <div className="pt-3 border-t border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
}
