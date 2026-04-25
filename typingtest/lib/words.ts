/**
 * 250 carefully curated common English words.
 * Max 12 characters each. Balanced difficulty.
 */
export const WORD_LIST: readonly string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "us", "between", "need", "large",
  "often", "hand", "high", "place", "hold", "turn", "city", "play",
  "small", "number", "move", "live", "both", "last", "show", "every",
  "free", "long", "write", "open", "seem", "next", "white", "begin",
  "walk", "paper", "group", "music", "those", "mark", "book", "letter",
  "until", "river", "care", "second", "enough", "plain", "girl", "usual",
  "young", "ready", "above", "ever", "red", "list", "though", "feel",
  "talk", "bird", "soon", "body", "dog", "family", "direct", "pose",
  "leave", "song", "door", "black", "short", "class", "wind", "question",
  "happen", "complete", "ship", "area", "half", "rock", "order", "fire",
  "south", "problem", "piece", "pass", "since", "top", "whole", "king",
  "space", "best", "hour", "better", "true", "during", "five", "step",
  "early", "west", "ground", "reach", "fast", "sing", "table", "travel",
  "less", "morning", "simple", "vowel", "toward", "war", "lay", "pattern",
  "slow", "center", "love", "person", "money", "serve", "road", "map",
  "rain", "rule", "pull", "cold", "notice", "voice", "unit", "power",
  "town", "fine", "drive", "lead", "dark", "machine", "base", "cause",
  "week", "final", "form", "star", "learn", "plan", "cut", "set",
  "put", "end", "does", "another", "well", "large", "must", "big",
  "even", "such", "because", "turn", "here", "why", "ask", "went",
  "men", "read", "need", "land", "different", "home", "move", "try",
  "kind", "hand", "picture", "change", "off", "play", "spell", "air",
  "away", "animal", "house", "point", "page", "letter", "mother",
  "answer", "found", "study", "still", "learn", "plant", "cover",
  "food", "sun", "four", "between", "state", "keep", "eye", "never",
  "last", "let", "thought", "city", "tree", "cross", "farm", "hard",
  "start", "might", "story", "saw", "far", "draw", "left", "late",
  "run", "while", "press", "close", "night", "real", "life", "few",
] as const;

/**
 * Generate a random word list of the given length.
 * Words are sampled uniformly from WORD_LIST.
 */
export function generateWords(count: number): string[] {
  return Array.from({ length: count }, () =>
    WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)] as string
  );
}
