export interface GuestCandidate {
  firstname: string;
  lastname: string;
  [key: string]: any;
}

/**
 * Normalizes a string for fuzzy comparison:
 * - Converts to lowercase
 * - Strips diacritics / accents (e.g., "José" -> "jose", "Zoë" -> "zoe")
 * - Removes non-alphanumeric characters
 */
export function normalizeName(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Computes standard Levenshtein distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost, // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Calculates a similarity score between 0.0 and 1.0.
 * Also accounts for common nickname/prefix matches (e.g. "Will" -> "William", "Mike" -> "Michael").
 */
export function nameSimilarity(a: string, b: string): number {
  const normA = normalizeName(a);
  const normB = normalizeName(b);

  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0.0;

  // Prefix match check: if one is a prefix of the other and at least 3 chars
  const minLen = Math.min(normA.length, normB.length);
  const maxLen = Math.max(normA.length, normB.length);

  if (
    minLen >= 3 &&
    (normA.startsWith(normB) || normB.startsWith(normA))
  ) {
    // Generous score for valid prefix matches
    return 0.85 + 0.15 * (minLen / maxLen);
  }

  const distance = levenshteinDistance(normA, normB);
  return Math.max(0, 1 - distance / maxLen);
}

/**
 * Evaluates candidate guests and returns the best fuzzy match if confidence is above the threshold.
 * 
 * @param queryFirstname - First name entered by the user
 * @param queryLastname - Last name entered by the user
 * @param guests - List of all guests in the database
 * @param threshold - Minimum composite confidence score (default 0.75)
 */
export function findBestGuestMatch<T extends GuestCandidate>(
  queryFirstname: string,
  queryLastname: string,
  guests: T[],
  threshold = 0.75,
): T | null {
  const normQFn = normalizeName(queryFirstname);
  const normQLn = normalizeName(queryLastname);

  if (!normQFn || !normQLn) return null;

  let bestMatch: T | null = null;
  let highestScore = 0;

  for (const guest of guests) {
    const fnSim = nameSimilarity(normQFn, guest.firstname);
    const lnSim = nameSimilarity(normQLn, guest.lastname);

    // Exact match short-circuit
    if (fnSim === 1.0 && lnSim === 1.0) {
      return guest;
    }

    // Weight last name slightly more heavily (55%) than first name (45%) to prevent cross-family mismatches
    const compositeScore = fnSim * 0.45 + lnSim * 0.55;

    // Both parts must have reasonable similarity (e.g. not a completely wrong last name)
    const isReasonableMatch = fnSim >= 0.70 && lnSim >= 0.75;

    if (compositeScore > highestScore && compositeScore >= threshold && isReasonableMatch) {
      highestScore = compositeScore;
      bestMatch = guest;
    }
  }

  return bestMatch;
}
