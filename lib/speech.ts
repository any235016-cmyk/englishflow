// Utility for Text to Speech (TTS) using SpeechSynthesis API
export function speakText(text: string, rate: number = 1.0, lang: string = 'en-US'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = lang;

  // Try to pick an English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Compare target string with user spoken string and return accuracy score and word highlights
export function calculateAccuracy(
  target: string,
  spoken: string
): {
  score: number;
  matchedWords: string[];
  missedWords: string[];
  wordDetails: { word: string; matched: boolean }[];
} {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
      .trim();

  const targetClean = normalize(target);
  const spokenClean = normalize(spoken);

  if (!spokenClean) {
    const targetWords = targetClean.split(/\s+/);
    return {
      score: 0,
      matchedWords: [],
      missedWords: targetWords,
      wordDetails: targetWords.map((w) => ({ word: w, matched: false })),
    };
  }

  const targetWords = targetClean.split(/\s+/);
  const spokenWords = spokenClean.split(/\s+/);

  const matchedWords: string[] = [];
  const missedWords: string[] = [];
  const wordDetails: { word: string; matched: boolean }[] = [];

  targetWords.forEach((word) => {
    // Check exact match or fuzzy inclusion
    const matched = spokenWords.some(
      (sw) => sw === word || levenshteinDistance(sw, word) <= 1
    );
    if (matched) {
      matchedWords.push(word);
      wordDetails.push({ word, matched: true });
    } else {
      missedWords.push(word);
      wordDetails.push({ word, matched: false });
    }
  });

  const score = Math.round((matchedWords.length / targetWords.length) * 100);

  return {
    score,
    matchedWords,
    missedWords,
    wordDetails,
  };
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
