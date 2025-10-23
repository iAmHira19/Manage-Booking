/**
 * Username utility that removes all duplicate words
 * Fixes issues like "Muhammed Hashim Hashim" -> "Muhammed Hashim"
 */

export const cleanupUsername = (username) => {
  if (!username) return "";
  
  const trimmed = String(username).trim();
  const words = trimmed
    .split(/\s+/)
    .map(w => w.trim())
    .filter(Boolean);
  
  // Remove any duplicate consecutive words
  const uniqueWords = [];
  for (let i = 0; i < words.length; i++) {
    const cur = words[i];
    const prev = i > 0 ? words[i - 1] : null;
    if (cur && (i === 0 || cur.toLowerCase() !== String(prev || '').toLowerCase())) {
      uniqueWords.push(words[i]);
    }
  }
  
  let result = uniqueWords.join(' ');
  
  // Additional check: if last two words are the same, remove the last one
  const finalWords = result.split(' ');
  if (
    finalWords.length >= 3 &&
    finalWords[finalWords.length - 1].toLowerCase() === finalWords[finalWords.length - 2].toLowerCase()
  ) {
    result = finalWords.slice(0, -1).join(' ');
  }

  // Special case: if there are exactly two words and
  // the first word already ends with the second word (case-insensitive),
  // then split into 'prefix second' to ensure a single space between
  // first and last names. Example: "Irfanyousuf Yousuf" -> "Irfan Yousuf".
  const two = result.split(' ').filter(Boolean);
  if (
    two.length === 2 &&
    two[0].length > two[1].length &&
    two[0].toLowerCase().endsWith(two[1].toLowerCase())
  ) {
    const prefix = two[0].slice(0, two[0].length - two[1].length).trim();
    result = prefix ? `${prefix} ${two[1]}` : two[0];
  }
  
  return result;
};

export default cleanupUsername;
