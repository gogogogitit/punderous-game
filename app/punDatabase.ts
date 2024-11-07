export interface Pun {
  id: number;
  question: string;
  answer: string;
  difficulty: number;
  votes: {
    up: number;
    down: number;
  };
}

export const initialPuns: Pun[] = [
  { id: 1, question: "What do you call a rabbit with a positive future outlook?", answer: "A hoptimist", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 2, question: "What do you call a fake noodle?", answer: "An impasta", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 3, question: "Why don't scientists trust atoms?", answer: "They make up everything", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 4, question: "What do you call a bear with no teeth?", answer: "A gummy bear", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 5, question: "Why did the scarecrow win an award?", answer: "They were outstanding in their field", difficulty: 3, votes: { up: 0, down: 0 } },
  { id: 6, question: "Why don't eggs tell jokes?", answer: "They crack up", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 7, question: "What do you call a can opener that doesn't work?", answer: "A can't opener", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 8, question: "Why did the math book look so sad?", answer: "It had too many problems", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 9, question: "What do you call a boomerang that doesn't come back?", answer: "A stick", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 10, question: "Why did the golfer bring two pairs of pants?", answer: "In case they got a hole in one", difficulty: 3, votes: { up: 0, down: 0 } },
  { id: 11, question: "What do you call a sleeping bull?", answer: "A bulldozer", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 12, question: "Why don't skeletons fight each other?", answer: "They don't have the guts", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 13, question: "What do you call a parade of rabbits hopping backwards?", answer: "A receding hare-line", difficulty: 3, votes: { up: 0, down: 0 } },
  { id: 14, question: "Why don't scientists trust stairs?", answer: "They're always up to something", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 15, question: "What do you call a fake stone in Ireland?", answer: "A sham rock", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 16, question: "What do you call a belt made of watches?", answer: "A waist of time", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 17, question: "Why did the cookie go to the doctor?", answer: "It was feeling crumbly", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 18, question: "What do you call a fish wearing a tuxedo?", answer: "Sofishticated", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 19, question: "How do you organize a space party?", answer: "You planet", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 20, question: "What do you call a dog magician?", answer: "A labracadabrador", difficulty: 3, votes: { up: 0, down: 0 } },
  { id: 21, question: "Why don't oysters donate to charity?", answer: "They're shellfish", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 22, question: "Why did the lazy gym close down?", answer: "It didn't work out", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 23, question: "Why did the bicycle fall over?", answer: "It was two-tired", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 24, question: "How does the moon cut its hair?", answer: "Eclipse it", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 25, question: "Why did the tomato turn red?", answer: "It saw the salad dressing", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 26, question: "What do you call cheese that isn't yours?", answer: "Nacho cheese", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 27, question: "Why are ghosts bad at lying?", answer: "They're too transparent", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 28, question: "How do trees access the internet?", answer: "They log in", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 29, question: "Why did the computer go to the doctor?", answer: "It had a virus", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 30, question: "How do celebrities stay cool?", answer: "Lots of fans", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 31, question: "Why did the banana go to the doctor?", answer: "It wasn't peeling well", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 32, question: "What's orange and sounds like a parrot?", answer: "A carrot", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 33, question: "What did one wall say to the other wall?", answer: "Let's meet at the corner", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 34, question: "What did the ocean say to the beach?", answer: "Nothing, it waved", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 35, question: "Why can't a nose be 12 inches long?", answer: "It would be a foot", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 36, question: "What kind of shoes do ninjas wear?", answer: "Sneakers", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 37, question: "How does a train eat?", answer: "Chew chew", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 38, question: "What's brown and sticky?", answer: "A stick", difficulty: 1, votes: { up: 0, down: 0 } },
  { id: 39, question: "Why do melons have formal weddings?", answer: "Because they cantaloupe", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 40, question: "How do you make a tissue dance?", answer: "Put a little boogie in it", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 41, question: "Why did the skeleton go to the party alone?", answer: "He had no body to go with him", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 42, question: "Why did the belt get arrested?", answer: "It held up a pair of pants", difficulty: 2, votes: { up: 0, down: 0 } },
  { id: 43, question: "What do you call a snowman with a six-pack?", answer: "An abdominal snowman", difficulty: 2, votes: { up: 0, down: 0 } },
];