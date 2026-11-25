/** Lowercase, without spaces, hyphens or underscores, so "in-progress", "In progress" and "InProgress" compare equal. */
export const normalize = (text) => text.toLowerCase().replace(/[\s_-]+/g, "");

/** Queries shorter than this match names only; on aliases they'd match too much. */
const MIN_ALIAS_QUERY = 3;

/**
 * Turns Carbon's search terms for each icon into what a query is compared
 * against: each term whole, and each word of a term, so "sign" finds an
 * icon tagged "plus sign".
 * @param {Record<string, string[]>} aliases
 * @returns {Map<string, string[]>}
 */
export function indexAliases(aliases) {
  const index = new Map();
  for (const [name, terms] of Object.entries(aliases)) {
    const keys = new Set();
    for (const term of terms) {
      keys.add(normalize(term));
      for (const word of term.split(/\s+/)) keys.add(normalize(word));
    }
    keys.delete("");
    index.set(name, [...keys]);
  }
  return index;
}


/** The words of a module name: "CheckmarkOutline" is "checkmark" and "outline". */
const words = (name) => name.split(/(?=[A-Z])|[_\d]+/).map((word) => word.toLowerCase()).filter(Boolean);

/**
 * How well a normalized query matches an icon's name, best first: 0 for the
 * whole name, 1 for its start, 2 for the start of a later word, 3 anywhere
 * else in it. -1 if it doesn't.
 * @param {string} query
 * @param {string} name
 */
export function rankName(query, name) {
  const key = normalize(name);
  if (key === query) return 0;
  if (key.startsWith(query)) return 1;
  if (words(name).some((word) => word.startsWith(query))) return 2;
  if (key.includes(query)) return 3;
  return -1;
}

/**
 * How well a normalized query matches an icon's search terms, after any
 * name match: 4 for a whole term, 5 for the start of one. -1 if it doesn't.
 * @param {string} query
 * @param {string[] | undefined} keys
 */
export function rankAliases(query, keys) {
  if (query.length < MIN_ALIAS_QUERY || keys === undefined) return -1;
  if (keys.includes(query)) return 4;
  return keys.some((key) => key.startsWith(query)) ? 5 : -1;
}

/** The rank a typo-tolerant match gets, used only when nothing else matches. */
export const FUZZY_RANK = 6;

/**
 * The search term a normalized query matched, as Carbon wrote it, to show
 * why an icon is in the results: "heart" for Favorite. A whole term first,
 * then a term or one of its words that starts with the query.
 * @param {string} query
 * @param {string[] | undefined} terms
 */
export function matchingTerm(query, terms) {
  if (query.length < MIN_ALIAS_QUERY || terms === undefined) return undefined;
  const keys = (term) => [normalize(term), ...term.split(/\s+/).map(normalize)];
  return (
    terms.find((term) => keys(term).includes(query)) ??
    terms.find((term) => keys(term).some((key) => key.startsWith(query)))
  );
}
