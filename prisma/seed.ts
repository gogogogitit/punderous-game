import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const puns = [
        { id: 1, question: "What do you call a rabbit with a positive future outlook?", answer: "A hoptimist", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 2, question: "What do you call a fake noodle?", answer: "An impasta", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 3, question: "What do you call a can opener that doesn't work?", answer: "A cannot opener", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 4, question: "Why don't scientists trust atoms?", answer: "They make up everything", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 5, question: "What do you call a bear with no teeth?", answer: "A gummy bear", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 6, question: "Why did the scarecrow win an award?", answer: "They were outstanding in their field", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 7, question: "What do you call a pig that does karate?", answer: "A pork chop", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 8, question: "Why don't eggs tell jokes?", answer: "They would crack up", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 9, question: "What do you call a sleeping bull?", answer: "A bulldozer", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 10, question: "Why did the math book look so sad?", answer: "It had too many problems", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 11, question: "Why did the golfer bring two pairs of pants?", answer: "In case they got a hole in one", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 12, question: "What do you call a parade of rabbits hopping backwards?", answer: "A receding hare line", difficulty: 3, upVotes: 0, downVotes: 0 },
        { id: 13, question: "Why don't skeletons fight each other?", answer: "They have no guts", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 14, question: "What do you call a fake stone in Ireland?", answer: "A sham rock", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 15, question: "How do you organize a space party?", answer: "You planet", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 16, question: "Why don't scientists trust atoms?", answer: "They make up everything", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 17, question: "What do you call a fish wearing a bowtie?", answer: "Sofishticated", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 18, question: "What do you call a dinosaur that crashes their car?", answer: "Tyrannosaurus wrecks", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 19, question: "Why don't oysters donate to charity?", answer: "They are shellfish", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 20, question: "Why did the gym get smaller and close down?", answer: "It didn not work out", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 21, question: "Why did the cookie go to the doctor?", answer: "Because it felt crumby", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 22, question: "What do you call a snowman with a six-pack?", answer: "An abdominal snowman", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 23, question: "What did the grape do when it got stepped on?", answer: "Let out a little wine", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 24, question: "Why did the banker switch careers?", answer: "They lost interest", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 25, question: "Why did the stadium get so hot?", answer: "All the fans left", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 26, question: "What do you call a dinosaur with an extensive vocabulary?", answer: "A thesaurus", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 27, question: "What do you call a bee that can't make up its mind?", answer: "A maybee", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 28, question: "Why do cows wear bells?", answer: "Their horns don't work", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 29, question: "Why did the frog take the bus?", answer: "Their car got toad", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 30, question: "Why did the barber win a race?", answer: "They took a shortcut", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 31, question: "What did the janitor say when they jumped out of the closet?", answer: "Supplies!", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 32, question: "Why did the coffee file a police report?", answer: "It got mugged", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 33, question: "Why couldn't the bicycle find its way?", answer: "It lost its bearings", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 34, question: "What did the buffalo say to their son when he left for college?", answer: "Bison", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 35, question: "What do you call an alligator detective?", answer: "An investigator", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 36, question: "What do you get if you cross a vampire with a snowman?", answer: "Frostbite", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 37, question: "Why don't seagulls fly over the bay?", answer: "Then they'd be bagels", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 38, question: "What's a vampire's least favorite room in the house?", answer: "The living room", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 39, question: "How do mountains stay warm in winter?", answer: "They wear snow caps", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 40, question: "Why can't you hear a pterodactyl use the bathroom?", answer: "The P is silent", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 41, question: "Why did the orange stop?", answer: "It ran out of juice", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 42, question: "How did the big flower greet the smaller flower?", answer: "Hey little bud", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 43, question: "What's the best way to watch a fly-fishing tournament?", answer: "Live stream it", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 44, question: "What do you call a gigantic pile of cats?", answer: "A meowtain", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 45, question: "What kind of car does an egg drive?", answer: "A Yolkswagen", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 46, question: "What does a nosy pepper do?", answer: "Gets jalapeno business", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 47, question: "Why did the person name their dogs Rolex and Timex?", answer: "They were watch dogs", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 48, question: "Why did the blanket go to jail?", answer: "It was covering up", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 49, question: "Why are elevator jokes so good?", answer: "They work on many levels", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 50, question: "Why did the pony get detention?", answer: "It kept horsing around", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 51, question: "What do you call an apology written in dots and dashes?", answer: "Remorse code", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 52, question: "Why did the bicycle fall over?", answer: "It was two-tired", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 53, question: "How did the cell phone propose?", answer: "With a ringtone", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 54, question: "What is a grape's favorite dance move?", answer: "Raisin the roof", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 55, question: "What did the clock do when it was hungry?", answer: "Went back four seconds", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 56, question: "What do you call a broken pencil?", answer: "Pointless", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 57, question: "Why did the banana go to the doctor?", answer: "It was not peeling well", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 58, question: "What do chickens do after school?", answer: "Eggstracurricular activities", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 59, question: "What's a ghost's favorite dessert?", answer: "I scream", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 60, question: "Why do cows never have any money?", answer: "Farmers milk them dry", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 61, question: "What do you call a possessed chicken?", answer: "A poultrygeist", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 62, question: "What's a vampire's least favorite food?", answer: "Steak", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 63, question: "Why did the sun go to school?", answer: "To get a little brighter", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 64, question: "Why do bees have sticky hair?", answer: "They use honeycombs", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 65, question: "What kind of pants do ghosts wear?", answer: "Boo jeans", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 66, question: "Why was the belt arrested?", answer: "For holding up a pair of pants", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 67, question: "What's a plumber's least favorite vegetable?", answer: "Leeks", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 68, question: "What kind of bird works at a construction site?", answer: "A crane", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 69, question: "Why did the cookie visit the therapist?", answer: "It was feeling crumby", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 70, question: "Why did the hipster burn their mouth?", answer: "They drank coffee before it was cool", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 71, question: "What do you call a fairy that doesn't take a bath?", answer: "Stinkerbell", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 72, question: "What do you call a swimming melon?", answer: "A watermelon", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 73, question: "Why was the calendar sad?", answer: "Its days were numbered", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 74, question: "Why are frogs so happy?", answer: "They eat whatever bugs them", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 75, question: "What noise does a nut make when it sneezes?", answer: "Cashew!", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 76, question: "What do you call a clever duck?", answer: "A wise quacker", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 77, question: "What do you call a bagel that flies?", answer: "A plane bagel", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 78, question: "Why did the computer go to the doctor?", answer: "It had a virus", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 79, question: "What do you call a bear that's stuck in the rain?", answer: "A drizzly bear", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 80, question: "Why did the opera singer need a ladder?", answer: "To reach the high notes", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 81, question: "What do you call a kangaroo who watches TV all day?", answer: "A pouch potato", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 82, question: "What do you call a cow that plays an instrument?", answer: "A moosician", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 83, question: "What do you call a pony with a cough?", answer: "A little hoarse", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 84, question: "What do you call a factory that makes okay products?", answer: "A satisfactory", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 85, question: "What do you call a cow with two legs?", answer: "Lean beef", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 86, question: "How do trees access the internet?", answer: "They log on", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 87, question: "What do you call a snake building a house?", answer: "A boa constructor", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 88, question: "What do you call a black and white bear that never wants to grow up?", answer: "Peter Panda", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 89, question: "What do you call a cow with no legs?", answer: "Ground beef", difficulty: 1, upVotes: 0, downVotes: 0 },
      ];

  for (const pun of puns) {
    await prisma.pun.create({
      data: pun
    })
  }

  console.log('Seed data inserted successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })