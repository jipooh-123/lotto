/**
 * Weighted Random Sampling Algorithm for Lotto 6/45
 * Formula: Weight(n) = Count(n) + BaseWeight
 */

export function generateLottoGames({
  frequencies = {},
  includes = [],
  excludes = [],
  baseWeight = 1,
  gameCount = 5,
}) {
  const setIncludes = new Set(includes.map((n) => Number(n)));
  const setExcludes = new Set(excludes.map((n) => Number(n)));

  const candidates = [];
  const weights = [];

  // Build candidate pool (1..45 minus includes minus excludes)
  for (let n = 1; n <= 45; n++) {
    if (!setIncludes.has(n) && !setExcludes.has(n)) {
      candidates.push(n);
      const count = frequencies[n] || 0;
      weights.push(count + baseWeight);
    }
  }

  const neededCount = 6 - setIncludes.size;
  if (neededCount < 0) {
    throw new Error('고정 수는 최대 5개까지만 선택 가능합니다.');
  }

  const labels = ['A', 'B', 'C', 'D', 'E'];
  const games = [];

  for (let i = 0; i < gameCount; i++) {
    const sampled = weightedRandomSelect(candidates, weights, neededCount);
    const fullGame = [...setIncludes, ...sampled].sort((a, b) => a - b);

    games.push({
      id: i + 1,
      label: labels[i] || `Game ${i + 1}`,
      numbers: fullGame,
    });
  }

  return games;
}

/**
 * Helper to select `countNeeded` items from `items` according to `weights` without replacement
 */
function weightedRandomSelect(items, weights, countNeeded) {
  const selected = [];
  const availableItems = [...items];
  const availableWeights = [...weights];

  for (let i = 0; i < countNeeded; i++) {
    const totalWeight = availableWeights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0 || availableItems.length === 0) {
      // Fallback to unweighted if weights sum to 0
      if (availableItems.length > 0) {
        const randIdx = Math.floor(Math.random() * availableItems.length);
        selected.push(availableItems[randIdx]);
        availableItems.splice(randIdx, 1);
        availableWeights.splice(randIdx, 1);
      }
      continue;
    }

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
