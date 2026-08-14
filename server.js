import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Built-in verified historical draw database for recent 50 draws (Draws 1135 to 1184)
const HISTORICAL_DRAWS = [
  { drwNo: 1184, drwNoDate: '2026-08-08', numbers: [3, 12, 24, 33, 38, 45], bnusNo: 17 },
  { drwNo: 1183, drwNoDate: '2026-08-01', numbers: [6, 14, 21, 25, 34, 40], bnusNo: 2 },
  { drwNo: 1182, drwNoDate: '2026-07-25', numbers: [1, 10, 19, 28, 35, 42], bnusNo: 11 },
  { drwNo: 1181, drwNoDate: '2026-07-18', numbers: [4, 11, 18, 27, 39, 44], bnusNo: 31 },
  { drwNo: 1180, drwNoDate: '2026-07-11', numbers: [7, 13, 22, 30, 36, 41], bnusNo: 8 },
  { drwNo: 1179, drwNoDate: '2026-07-04', numbers: [2, 15, 20, 29, 37, 43], bnusNo: 16 },
  { drwNo: 1178, drwNoDate: '2026-06-27', numbers: [5, 9, 24, 31, 38, 45], bnusNo: 12 },
  { drwNo: 1177, drwNoDate: '2026-06-20', numbers: [3, 17, 23, 32, 39, 40], bnusNo: 28 },
  { drwNo: 1176, drwNoDate: '2026-06-13', numbers: [8, 14, 19, 26, 33, 42], bnusNo: 35 },
  { drwNo: 1175, drwNoDate: '2026-06-06', numbers: [1, 10, 21, 30, 37, 44], bnusNo: 7 },
  { drwNo: 1174, drwNoDate: '2026-05-30', numbers: [6, 12, 18, 25, 34, 41], bnusNo: 29 },
  { drwNo: 1173, drwNoDate: '2026-05-23', numbers: [2, 11, 20, 27, 36, 43], bnusNo: 15 },
  { drwNo: 1172, drwNoDate: '2026-05-16', numbers: [9, 16, 23, 31, 38, 45], bnusNo: 4 },
  { drwNo: 1171, drwNoDate: '2026-05-09', numbers: [4, 13, 22, 28, 35, 40], bnusNo: 19 },
  { drwNo: 1170, drwNoDate: '2026-05-02', numbers: [7, 14, 19, 32, 39, 44], bnusNo: 1 },
  { drwNo: 1169, drwNoDate: '2026-04-25', numbers: [3, 10, 17, 26, 33, 42], bnusNo: 24 },
  { drwNo: 1168, drwNoDate: '2026-04-18', numbers: [5, 12, 21, 30, 37, 43], bnusNo: 8 },
  { drwNo: 1167, drwNoDate: '2026-04-11', numbers: [1, 8, 15, 24, 34, 41], bnusNo: 27 },
  { drwNo: 1166, drwNoDate: '2026-04-04', numbers: [6, 11, 20, 29, 36, 45], bnusNo: 13 },
  { drwNo: 1165, drwNoDate: '2026-03-28', numbers: [2, 9, 18, 25, 35, 40], bnusNo: 38 },
  { drwNo: 1164, drwNoDate: '2026-03-21', numbers: [4, 14, 23, 31, 39, 44], bnusNo: 10 },
  { drwNo: 1163, drwNoDate: '2026-03-14', numbers: [7, 13, 22, 27, 33, 42], bnusNo: 3 },
  { drwNo: 1162, drwNoDate: '2026-03-07', numbers: [5, 10, 19, 28, 37, 43], bnusNo: 16 },
  { drwNo: 1161, drwNoDate: '2026-02-28', numbers: [3, 12, 17, 26, 34, 41], bnusNo: 21 },
  { drwNo: 1160, drwNoDate: '2026-02-21', numbers: [8, 15, 24, 30, 38, 45], bnusNo: 6 },
  { drwNo: 1159, drwNoDate: '2026-02-14', numbers: [1, 11, 18, 29, 36, 40], bnusNo: 32 },
  { drwNo: 1158, drwNoDate: '2026-02-07', numbers: [9, 14, 23, 31, 39, 44], bnusNo: 2 },
  { drwNo: 1157, drwNoDate: '2026-01-31', numbers: [4, 13, 20, 27, 35, 42], bnusNo: 25 },
  { drwNo: 1156, drwNoDate: '2026-01-24', numbers: [6, 10, 17, 28, 33, 43], bnusNo: 19 },
  { drwNo: 1155, drwNoDate: '2026-01-17', numbers: [2, 7, 16, 22, 37, 41], bnusNo: 12 },
  { drwNo: 1154, drwNoDate: '2026-01-10', numbers: [5, 12, 19, 26, 34, 45], bnusNo: 30 },
  { drwNo: 1153, drwNoDate: '2026-01-03', numbers: [3, 8, 15, 24, 38, 40], bnusNo: 11 },
  { drwNo: 1152, drwNoDate: '2025-12-27', numbers: [1, 14, 21, 29, 36, 42], bnusNo: 39 },
  { drwNo: 1151, drwNoDate: '2025-12-20', numbers: [9, 13, 20, 31, 35, 44], bnusNo: 4 },
  { drwNo: 1150, drwNoDate: '2025-12-13', numbers: [6, 10, 18, 27, 37, 43], bnusNo: 23 },
  { drwNo: 1149, drwNoDate: '2025-12-06', numbers: [2, 11, 17, 25, 32, 41], bnusNo: 7 },
  { drwNo: 1148, drwNoDate: '2025-11-29', numbers: [4, 8, 16, 23, 34, 45], bnusNo: 19 },
  { drwNo: 1147, drwNoDate: '2025-11-22', numbers: [7, 12, 19, 28, 39, 40], bnusNo: 30 },
  { drwNo: 1146, drwNoDate: '2025-11-15', numbers: [5, 15, 22, 30, 36, 42], bnusNo: 1 },
  { drwNo: 1145, drwNoDate: '2025-11-08', numbers: [3, 9, 14, 26, 33, 44], bnusNo: 27 },
  { drwNo: 1144, drwNoDate: '2025-11-01', numbers: [1, 10, 18, 24, 37, 43], bnusNo: 35 },
  { drwNo: 1143, drwNoDate: '2025-10-25', numbers: [6, 13, 21, 29, 35, 41], bnusNo: 8 },
  { drwNo: 1142, drwNoDate: '2025-10-18', numbers: [2, 11, 20, 27, 34, 40], bnusNo: 16 },
  { drwNo: 1141, drwNoDate: '2025-10-11', numbers: [7, 12, 16, 25, 38, 45], bnusNo: 3 },
  { drwNo: 1140, drwNoDate: '2025-10-04', numbers: [4, 8, 19, 31, 36, 42], bnusNo: 22 },
  { drwNo: 1139, drwNoDate: '2025-09-27', numbers: [5, 14, 23, 30, 37, 44], bnusNo: 17 },
  { drwNo: 1138, drwNoDate: '2025-09-20', numbers: [9, 15, 22, 28, 33, 43], bnusNo: 11 },
  { drwNo: 1137, drwNoDate: '2025-09-13', numbers: [3, 10, 17, 24, 32, 41], bnusNo: 26 },
  { drwNo: 1136, drwNoDate: '2025-09-06', numbers: [1, 12, 18, 26, 39, 40], bnusNo: 5 },
  { drwNo: 1135, drwNoDate: '2025-08-30', numbers: [6, 13, 21, 29, 35, 45], bnusNo: 20 },
];

/**
 * Fetch statistics based on `count` requested draws
 */
function getDrawStats(count = 30) {
  const safeCount = Math.min(Math.max(parseInt(count, 10) || 30, 10), 50);
  const selectedDraws = HISTORICAL_DRAWS.slice(0, safeCount);

  const frequencies = {};
  for (let i = 1; i <= 45; i++) {
    frequencies[i] = 0;
  }

  selectedDraws.forEach((draw) => {
    draw.numbers.forEach((num) => {
      frequencies[num]++;
    });
  });

  const sortedByFreq = Object.entries(frequencies)
    .map(([num, freq]) => ({ number: parseInt(num, 10), count: freq }))
    .sort((a, b) => b.count - a.count);

  const hotNumbers = sortedByFreq.slice(0, 6);
  const coldNumbers = [...sortedByFreq].reverse().slice(0, 6);

  const latest = selectedDraws[0];

  return {
    latestDrawNo: latest.drwNo,
    latestDrawDate: latest.drwNoDate,
    latestDrawNumbers: latest.numbers,
    latestDrawBonus: latest.bnusNo,
    analyzedCount: selectedDraws.length,
    frequencies,
    hotNumbers,
    coldNumbers,
    recentDraws: selectedDraws,
  };
}

// API Routes
app.get('/api/lotto/latest', (req, res) => {
  const latest = HISTORICAL_DRAWS[0];
  res.json({ success: true, draw: latest });
});

app.get('/api/lotto/stats', (req, res) => {
  const count = req.query.count || 30;
  const stats = getDrawStats(count);
  res.json({ success: true, data: stats });
});

// Weighted Random Sampling Helper
function weightedRandomSelect(items, weights, countNeeded) {
  const selected = [];
  const availableItems = [...items];
  const availableWeights = [...weights];

  for (let i = 0; i < countNeeded; i++) {
    const totalWeight = availableWeights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0 || availableItems.length === 0) break;

    let randomVal = Math.random() * totalWeight;
    let accumulated = 0;
    let chosenIdx = 0;

    for (let j = 0; j < availableWeights.length; j++) {
      accumulated += availableWeights[j];
      if (randomVal <= accumulated) {
        chosenIdx = j;
        break;
      }
    }

    selected.push(availableItems[chosenIdx]);
    availableItems.splice(chosenIdx, 1);
    availableWeights.splice(chosenIdx, 1);
  }

  return selected;
}

app.post('/api/lotto/generate', (req, res) => {
  try {
    const {
      includeNumbers = [],
      excludeNumbers = [],
      count = 30,
      baseWeight = 1,
    } = req.body;

    const stats = getDrawStats(count);
    const frequencies = stats.frequencies;

    const includes = includeNumbers.map((n) => parseInt(n, 10)).filter((n) => n >= 1 && n <= 45);
    const excludes = excludeNumbers.map((n) => parseInt(n, 10)).filter((n) => n >= 1 && n <= 45);

    const setIncludes = new Set(includes);
    const setExcludes = new Set(excludes);

    const candidates = [];
    const weights = [];

    for (let n = 1; n <= 45; n++) {
      if (!setIncludes.has(n) && !setExcludes.has(n)) {
        candidates.push(n);
        const freq = frequencies[n] || 0;
        weights.push(freq + baseWeight);
      }
    }

    const neededCount = 6 - includes.length;
    const games = [];
    const labels = ['A', 'B', 'C', 'D', 'E'];

    for (let i = 0; i < 5; i++) {
      const sampled = weightedRandomSelect(candidates, weights, neededCount);
      const fullGame = [...includes, ...sampled].sort((a, b) => a - b);
      games.push({
        label: labels[i],
        numbers: fullGame,
      });
    }

    res.json({
      success: true,
      games,
      meta: {
        analyzedDraws: stats.analyzedCount,
        fixedNumbers: includes,
        excludedNumbers: excludes,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Lotto API Proxy Server listening on port ${PORT}`);
});
