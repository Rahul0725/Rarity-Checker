import { AnalysisResult, RarityLevel, PlatformAvailability, Suggestion } from '../types';
import { GAMING_TERMS, DESI_SLANG, POETIC_WORDS, TECH_NUMBERS, UNITS, STATUS_SUFFIXES } from '../constants';

// --- Helper Functions ---

const isNumber = (str: string) => /^\d+$/.test(str);
const isUnitStyle = (str: string) => {
  const match = str.match(/^(\d+)([a-zA-Z]+)$/);
  if (!match) return false;
  const unit = match[2].toLowerCase();
  return UNITS.includes(unit);
};

// --- Analysis Logic ---

export const analyzeUsername = (username: string): AnalysisResult => {
  const lower = username.toLowerCase();
  let score = 0;
  const tags: string[] = [];
  const reasons: string[] = [];
  let category: AnalysisResult['category'] = 'GENERAL';

  // 1. Length Score (The shorter, the rarer)
  const len = lower.length;
  if (len === 1) { score += 100; tags.push('Single Char'); reasons.push('1-character usernames are the holy grail.'); category = 'SHORT'; }
  else if (len === 2) { score += 95; tags.push('2-Letter'); reasons.push('2-character names are extremely rare.'); category = 'SHORT'; }
  else if (len === 3) { score += 85; tags.push('3-Letter'); reasons.push('3-letter names are highly sought after.'); category = 'SHORT'; }
  else if (len === 4) { score += 60; tags.push('4-Letter'); }
  else if (len === 5) { score += 40; }
  else if (len > 12) { score -= 10; reasons.push('Long usernames are generally harder to recall.'); }

  // 2. Unit Detection (Premium Feature)
  if (isUnitStyle(lower)) {
    score += 85; // Massive boost
    tags.push('Unit Style');
    reasons.push('Number + Unit combinations are aesthetic and premium.');
    category = 'UNIT';
  }

  // 3. Number/Tech Analysis
  if (isNumber(lower)) {
    tags.push('Numeric');
    category = 'NUMBER';
    if (TECH_NUMBERS.includes(lower)) {
      score += 80;
      tags.push('Tech Number');
      reasons.push('Recognizable tech/gaming number.');
    } else if (lower.split('').every(c => c === lower[0])) {
      score += 90;
      tags.push('Repeating');
      reasons.push('Repeating digits are visually satisfying.');
    } else {
      score += 40;
    }
  }

  // 4. Gaming & Slang
  if (GAMING_TERMS.includes(lower) || DESI_SLANG.includes(lower)) {
    score += 75;
    tags.push('Gaming Term');
    reasons.push('Recognizable gaming slang.');
    category = 'GAMING';
  }

  // 5. Poetic / Aesthetic
  if (POETIC_WORDS.includes(lower)) {
    score += 80;
    tags.push('Aesthetic');
    reasons.push('High-value poetic/aesthetic word.');
    category = 'POETIC';
  }

  // 6. Status Words
  if (STATUS_SUFFIXES.some(s => lower.endsWith(s)) || lower.startsWith('no')) {
    score += 50;
    tags.push('Status');
    if (category === 'GENERAL') category = 'STATUS';
  }

  // 7. Penalties
  if (/[._-]{2,}/.test(lower)) { score -= 20; reasons.push('Excessive special characters reduce value.'); }
  if (/\d{4,}$/.test(lower) && !isNumber(lower)) { score -= 15; reasons.push('Trailing random numbers makes it look generic.'); }

  // Clamp Score
  score = Math.min(Math.max(score, 0), 100);

  // Determine Rarity Label
  let rarity = RarityLevel.COMMON;
  if (score >= 90) rarity = RarityLevel.ULTRA_RARE;
  else if (score >= 70) rarity = RarityLevel.RARE;
  else if (score >= 40) rarity = RarityLevel.COMMON;
  else rarity = RarityLevel.VERY_COMMON;

  return { username, score, rarity, tags, reasons, category };
};

// --- Availability Heuristic ---

export const checkAvailability = (username: string): PlatformAvailability[] => {
  const lower = username.toLowerCase();
  const len = lower.length;
  
  // Base probability based on rarity logic
  let baseProb = 100;
  
  if (len <= 3) baseProb = 5; // Almost certainly taken
  else if (len === 4) baseProb = 20;
  else if (GAMING_TERMS.includes(lower) || UNITS.includes(lower)) baseProb = 10; // Dictionary words taken
  else if (isUnitStyle(lower)) baseProb = 30; // Specific units might be open on niche platforms
  else baseProb = 60; // Random stuff likely open

  const platforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter (X)', 'Discord'];
  
  return platforms.map(platform => {
    // Add some variance per platform
    let pProb = baseProb;
    if (platform === 'Instagram' || platform === 'Twitter (X)') pProb -= 20; // Harder to get
    if (platform === 'Discord') pProb += 30; // Easier (due to discriminators/unique systems)

    pProb = Math.min(Math.max(pProb, 0), 100);

    return {
      platform,
      probability: pProb,
      status: pProb < 40 ? 'Likely Taken' : (pProb > 70 ? 'Likely Available' : 'Unknown')
    };
  });
};

// --- Suggestion Engine ---

export const getSuggestions = (result: AnalysisResult): Suggestion[] => {
  const { username, category } = result;
  const lower = username.toLowerCase();
  const suggestions: Suggestion[] = [];

  if (category === 'UNIT') {
    const match = lower.match(/^(\d+)([a-zA-Z]+)$/);
    if (match) {
      const unit = match[2];
      const others = [10, 20, 50, 100, 144, 240, 360, 1000];
      others.forEach(n => suggestions.push({ username: `${n}${unit}`, type: 'Alt Value' }));
    }
  }

  if (category === 'GAMING' || category === 'GENERAL') {
    // Try adding short numbers or status
    suggestions.push({ username: `${lower}og`, type: 'Status' });
    suggestions.push({ username: `its${lower}`, type: 'Prefix' });
    suggestions.push({ username: `${lower}x`, type: 'Suffix' });
    
    // Suggest other gaming terms if it is one
    if (GAMING_TERMS.includes(lower)) {
        suggestions.push({ username: GAMING_TERMS[Math.floor(Math.random() * GAMING_TERMS.length)], type: 'Similiar Vibe' });
    }
  }

  if (category === 'POETIC') {
    const idx = POETIC_WORDS.indexOf(lower);
    if (idx !== -1) {
        // Suggest next/prev poetic words
        const next = POETIC_WORDS[(idx + 1) % POETIC_WORDS.length];
        const prev = POETIC_WORDS[(idx - 1 + POETIC_WORDS.length) % POETIC_WORDS.length];
        suggestions.push({ username: next, type: 'Similiar Meaning' });
        suggestions.push({ username: prev, type: 'Similiar Meaning' });
    }
  }

  if (category === 'NUMBER') {
     suggestions.push({ username: '0' + lower, type: 'Leading Zero' });
     suggestions.push({ username: lower + '0', type: 'Trailing Zero' });
     suggestions.push({ username: 'no' + lower, type: 'Rank Style' });
  }

  // General filler if few suggestions
  if (suggestions.length < 3) {
    suggestions.push({ username: `${lower}hq`, type: 'Suffix' });
    suggestions.push({ username: `the${lower}`, type: 'Prefix' });
    suggestions.push({ username: `${lower}_`, type: 'Minimal' });
  }

  return suggestions.slice(0, 6);
};
