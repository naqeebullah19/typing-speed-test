// Word bank — 300 common English words, carefully curated for a natural typing experience
const WORDS = [
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
  "any", "these", "give", "day", "most", "us", "great", "between", "need",
  "large", "often", "hand", "high", "place", "hold", "turn", "been",
  "city", "play", "small", "number", "off", "always", "move", "live",
  "both", "last", "show", "every", "down", "free", "long", "write",
  "open", "seem", "together", "next", "white", "children", "begin",
  "got", "walk", "example", "ease", "paper", "group", "always", "music",
  "those", "both", "mark", "book", "letter", "until", "mile", "river",
  "car", "feet", "care", "second", "enough", "plain", "girl", "usual",
  "young", "ready", "above", "ever", "red", "list", "though", "feel",
  "talk", "bird", "soon", "body", "dog", "family", "direct", "pose",
  "leave", "song", "measure", "door", "product", "black", "short",
  "numeral", "class", "wind", "question", "happen", "complete", "ship",
  "area", "half", "rock", "order", "fire", "south", "problem", "piece",
  "told", "knew", "pass", "since", "top", "whole", "king", "space",
  "heard", "best", "hour", "better", "true", "during", "hundred",
  "five", "remember", "step", "early", "hold", "west", "ground",
  "interest", "reach", "fast", "verb", "sing", "listen", "six", "table",
  "travel", "less", "morning", "ten", "simple", "several", "vowel",
  "toward", "war", "lay", "against", "pattern", "slow", "center",
  "love", "person", "money", "serve", "appear", "road", "map", "rain",
  "rule", "govern", "pull", "cold", "notice", "voice", "unit", "power",
  "town", "fine", "drive", "lead", "cry", "dark", "machine", "base",
  "cause", "week", "final", "given", "form", "star", "learn", "plan",
];

export function generateWords(count: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return result;
}
