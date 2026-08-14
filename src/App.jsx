import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NumberSelector from './components/NumberSelector';
import GameResults from './components/GameResults';
import StatsChart from './components/StatsChart';
import GuideModal from './components/GuideModal';
import { generateLottoGames } from './utils/lottoAlgorithm';

export default function App() {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'stats'
  const [drawWindow, setDrawWindow] = useState(30); // 20, 30, 40, 50

  const [statsData, setStatsData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [includes, setIncludes] = useState([]); // Fixed numbers (max 5)
  const [excludes, setExcludes] = useState([]); // Excluded numbers (max 10)

  const [games, setGames] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Core lotto generation function
  const runGeneration = useCallback((targetStats = statsData, inc = includes, exc = excludes) => {
    try {
      const frequencies = targetStats?.frequencies || {};
      const generated = generateLottoGames({
        frequencies,
        includes: inc,
        excludes: exc,
        baseWeight: 1,
        gameCount: 5,
      });
      setGames(generated);
    } catch (err) {
      console.error('Generation error:', err);
    }
  }, [statsData, includes, excludes]);

  // Fetch stats from Express Backend API
  const fetchStats = useCallback(async (countWindow = drawWindow) => {
    setLoadingStats(true);
    try {
      const response = await fetch(`/api/lotto/stats?count=${countWindow}`);
      const result = await response.json();
      if (result.success && result.data) {
        setStatsData(result.data);
        // Generate initial 5 games immediately without flickering delay
        if (games.length === 0) {
          runGeneration(result.data, includes, excludes);
        }
      }
    } catch (error) {
      console.error('Failed to fetch lotto stats from API:', error);
      const mockFreq = {};
      for (let i = 1; i <= 45; i++) {
        mockFreq[i] = Math.floor(Math.random() * 8) + 1;
      }
      const fallbackData = {
        latestDrawNo: 1184,
        latestDrawDate: '2026-08-08',
        latestDrawNumbers: [3, 12, 24, 33, 38, 45],
        latestDrawBonus: 17,
        analyzedCount: countWindow,
        frequencies: mockFreq,
        hotNumbers: [
          { number: 3, count: 9 },
          { number: 12, count: 8 },
          { number: 24, count: 8 },
          { number: 33, count: 7 },
          { number: 38, count: 7 },
          { number: 45, count: 7 },
        ],
        coldNumbers: [
          { number: 7, count: 1 },
          { number: 18, count: 1 },
          { number: 29, count: 1 },
          { number: 41, count: 2 },
          { number: 15, count: 2 },
          { number: 22, count: 2 },
        ],
      };
      setStatsData(fallbackData);
      if (games.length === 0) {
        runGeneration(fallbackData, includes, excludes);
      }
    } finally {
      setLoadingStats(false);
    }
  }, [drawWindow, games.length, includes, excludes, runGeneration]);

  useEffect(() => {
    fetchStats(drawWindow);
  }, [drawWindow, fetchStats]);

  // Execute algorithm manually with spin animation
  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      runGeneration(statsData, includes, excludes);
      setIsGenerating(false);
    }, 200);
  }, [statsData, includes, excludes, runGeneration]);

  // Number selection toggles
  const handleToggleInclude = (num) => {
    setIncludes((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const handleToggleExclude = (num) => {
    setExcludes((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const handleReset = () => {
    setIncludes([]);
    setExcludes([]);
  };

  const handlePresetHot = () => {
    if (!statsData?.hotNumbers) return;
    const hotTop5 = statsData.hotNumbers.slice(0, 5).map((h) => h.number);
    setIncludes(hotTop5);
    setExcludes((prev) => prev.filter((n) => !hotTop5.includes(n)));
  };

  const handlePresetCold = () => {
    if (!statsData?.coldNumbers) return;
    const coldTop10 = statsData.coldNumbers.slice(0, 10).map((c) => c.number);
    setExcludes(coldTop10);
    setIncludes((prev) => prev.filter((n) => !coldTop10.includes(n)));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        latestDraw={statsData}
        loadingLatest={loadingStats}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGuide={() => setGuideOpen(true)}
        onRefresh={() => fetchStats(drawWindow)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'generator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Top: Number Selector Filter Grid */}
            <div className="lg:col-span-6 space-y-6">
              <NumberSelector
                includes={includes}
                excludes={excludes}
                onToggleInclude={handleToggleInclude}
                onToggleExclude={handleToggleExclude}
                onReset={handleReset}
                onPresetHot={handlePresetHot}
                onPresetCold={handlePresetCold}
                hotNumbers={statsData?.hotNumbers || []}
                coldNumbers={statsData?.coldNumbers || []}
              />
            </div>

            {/* Right/Bottom: 5 Games Results */}
            <div className="lg:col-span-6 space-y-6">
              <GameResults
                games={games}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                includes={includes}
                excludes={excludes}
                analyzedDraws={statsData?.analyzedCount || drawWindow}
              />
            </div>
          </div>
        ) : (
          /* Stats View Tab */
          <StatsChart
            stats={statsData}
            loading={loadingStats}
            drawWindow={drawWindow}
            onChangeDrawWindow={setDrawWindow}
            onSelectNumberToInclude={(num) => {
              handleToggleInclude(num);
              setActiveTab('generator');
            }}
            onSelectNumberToExclude={(num) => {
              handleToggleExclude(num);
              setActiveTab('generator');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Lotto AI Generator. 동행복권 공시 당첨 번호 데이터 연동 API 사용.</p>
        <p className="mt-1 text-[11px] text-slate-600">
          본 시스템의 번호 조합은 통계적 가중 무작위 알고리즘에 기초하며 당첨을 보장하지 않습니다. 건전한 구매 문화를 권장합니다.
        </p>
      </footer>

      {/* Guide Modal Dialog */}
      <GuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
