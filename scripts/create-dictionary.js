const fs = require('fs');
const path = require('path');

// List of top 500 most common English words
const top500Words = [
  'I', 'a', 'of', 'to', 'in', 'it', 'is', 'be', 'as', 'at', 'so', 'we', 'he', 'by', 'or', 'on', 'do', 'if', 'me', 'my', 'up', 'an', 'go', 'no', 'us', 'am',
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but', 'his', 'from', 'they', 'say', 'her', 'she', 'will', 'one', 'all', 'would', 'there', 'their', 'what', 'out', 'about', 'who', 'get', 'which', 'when', 'make', 'can', 'like', 'time', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'yours', 'years', 'ours', 'day', 'most', 'us',
  "can't", "don't", "won't", "isn't", "aren't", "can't" 
  // ... (add the rest of the words here)
];

// Add words from pun questions and answers
const punWords = [
  "rabbit", "positive", "future", "outlook", "hoptimist",
  "fake", "noodle", "impasta",
  "can", "opener", "doesn't", "work", "can't",
  "scientists", "trust", "atoms", "make", "up", "everything",
  "bear", "teeth", "gummy",
  "scarecrow", "win", "award", "outstanding", "field",
  "pig", "karate", "pork", "chop",
  "eggs", "tell", "jokes", "crack",
  "sleeping", "bull", "bulldozer",
  "math", "book", "sad", "problems",
  "golfer", "bring", "two", "pairs", "pants", "hole", "one",
  "parade", "rabbits", "hopping", "backwards", "receding", "hare", "line",
  "skeletons", "fight", "guts",
  "fake", "stone", "ireland", "sham", "rock",
  "organize", "space", "party", "planet",
  "fish", "wearing", "bowtie", "sofishticated",
  "dinosaur", "crashes", "car", "tyrannosaurus", "wrecks",
  "oysters", "donate", "charity", "shellfish",
  "gym", "smaller", "close", "down", "work", "out",
  "cookie", "doctor", "feeling", "crumbly",
  "snowman", "six", "pack", "abdominal",
  "grape", "stepped", "little", "wine",
  "banker", "switch", "careers", "lost", "interest",
  "stadium", "hot", "fans", "left",
  "dinosaur", "extensive", "vocabulary", "thesaurus",
  "bee", "make", "mind", "maybee",
  "cows", "wear", "bells", "horns", "don't", "work",
  "frog", "take", "bus", "car", "toad",
  "barber", "win", "race", "shortcut",
  "janitor", "jump", "closet", "supplies",
  "coffee", "file", "police", "report", "mugged",
  "bicycle", "find", "way", "lost", "bearings",
  "buffalo", "son", "college", "bison",
  "alligator", "detective", "investigator",
  "vampire", "snowman", "frostbite",
  "seagulls", "fly", "bay", "bagels",
  "vampire's", "least", "favorite", "room", "house", "living",
  "mountains", "stay", "warm", "winter", "wear", "snow", "caps",
  "hear", "pterodactyl", "use", "bathroom", "p", "silent",
  "orange", "stop", "ran", "juice",
  "big", "flower", "greet", "smaller", "hey", "little", "bud",
  "watch", "fly", "fishing", "tournament", "live", "stream",
  "gigantic", "pile", "cats", "meowtain",
  "kind", "car", "egg", "drive", "yolkswagen",
  "nosy", "pepper", "gets", "jalapeno", "business",
  "person", "name", "dogs", "rolex", "timex", "watch",
  "blanket", "jail", "covering",
  "elevator", "jokes", "good", "many", "levels",
  "pony", "detention", "horsing", "around",
  "apology", "written", "dots", "dashes", "remorse", "code",
  "bicycle", "fall", "two", "tired",
  "cell", "phone", "propose", "ringtone",
  "grape's", "favorite", "dance", "move", "raisin", "roof",
  "clock", "hungry", "went", "back", "four", "seconds",
  "broken", "pencil", "pointless",
  "banana", "doctor", "peeling", "well",
  "chickens", "school", "eggstracurricular", "activities",
  "ghost's", "favorite", "dessert", "scream",
  "cows", "never", "money", "farmers", "milk", "dry",
  "possessed", "chicken", "poultrygeist",
  "vampire's", "least", "favorite", "food", "steak",
  "sun", "school", "brighter",
  "bees", "sticky", "hair", "honeycombs",
  "pants", "ghosts", "wear", "boo", "jeans",
  "belt", "arrested", "holding", "pair", "pants",
  "plumber's", "least", "favorite", "vegetable", "leeks",
  "bird", "works", "construction", "site", "crane",
  "cookie", "visit", "therapist", "crumby",
  "hipster", "burn", "mouth", "drank", "coffee", "cool",
  "fairy", "doesn't", "take", "bath", "stinkerbell",
  "swimming", "melon", "watermelon",
  "calendar", "sad", "days", "numbered",
  "frogs", "happy", "eat", "whatever", "bugs",
  "noise", "nut", "make", "sneezes", "cashew",
  "clever", "duck", "wise", "quacker",
  "bagel", "flies", "plane",
  "computer", "doctor", "virus",
  "bear", "stuck", "rain", "drizzly",
  "opera", "singer", "need", "ladder", "reach", "high", "notes",
  "kangaroo", "watches", "tv", "day", "pouch", "potato",
  "cow", "plays", "instrument", "moosician",
  "pony", "cough", "little", "hoarse",
  "factory", "makes", "okay", "products", "satisfactory",
  "cow", "two", "legs", "lean", "beef",
  "trees", "access", "internet", "log",
  "snake", "building", "house", "boa", "constructor",
  "bear", "never", "wants", "grow", "peter", "panda",
  "cow", "legs", "ground", "beef"
];

// Combine top words and pun words
const allWords = new Set([...top500Words, ...punWords]);

// Convert Set to sorted array
const compressedDictionary = Array.from(allWords).sort();

// Save the compressed dictionary
const outputPath = path.join(__dirname, '..', 'public', 'compressed-dictionary.json');
fs.writeFileSync(outputPath, JSON.stringify(compressedDictionary));

console.log('Compressed dictionary with top words and pun words created successfully in public folder.');