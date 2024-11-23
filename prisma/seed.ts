//:  prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

    const puns = [
      { id: 7, question: "What do you call a pig that does karate?", answer: "A pork chop", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 8, question: "Why don't eggs tell jokes?", answer: "They would crack up", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 9, question: "What do you call a sleeping bull?", answer: "A bulldozer", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 10, question: "Why did the math book look so sad?", answer: "It had too many problems", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 11, question: "Why did the golfer bring two pairs of pants?", answer: "In case they got a hole in one", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 12, question: "What do you call a parade of rabbits hopping backwards?", answer: "A receding hare line", difficulty: 3, upVotes: 0, downVotes: 0 },
      { id: 13, question: "Why don't skeletons fight each other?", answer: "They have no guts", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 14, question: "What do you call a fake stone in Ireland?", answer: "A sham rock", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 15, question: "How do you organize a space party?", answer: "You planet", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 17, question: "What do you call a fish wearing a bowtie?", answer: "Sofishticated", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 18, question: "What do you call a dinosaur that crashes their car?", answer: "Tyrannosaurus wrecks", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 19, question: "Why don't oysters donate to charity?", answer: "They are shellfish", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 20, question: "Why did the gym get smaller and close down?", answer: "It did not work out", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 21, question: "Why did the cookie go to the doctor?", answer: "Because it felt crumby", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 22, question: "What do you call a snowman with a six-pack?", answer: "An abdominal snowman", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 23, question: "What did the grape do when it got stepped on?", answer: "Let out a little wine", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 24, question: "Why did the banker switch careers?", answer: "They lost interest", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 25, question: "Why did the stadium get so hot?", answer: "All the fans left", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 26, question: "What do you call a dinosaur with an extensive vocabulary?", answer: "A thesaurus", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 27, question: "What do you call a bee that can't make up its mind?", answer: "A maybee", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 28, question: "Why do cows wear bells?", answer: "Their horns are silent", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 29, question: "Why did the frog take the bus?", answer: "Their car got toad", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 30, question: "Why did the barber win a race?", answer: "They took a shortcut", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 31, question: "What did the janitor say when they jumped out of the closet?", answer: "Supplies!", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 32, question: "Why did the coffee file a police report?", answer: "It got mugged", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 33, question: "Why couldn't the bicycle find its way?", answer: "It lost its bearings", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 34, question: "What did the buffalo say to their son when he left for college?", answer: "Bison", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 35, question: "What do you call an alligator detective?", answer: "An investigator", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 36, question: "What do you get if you cross a vampire with a snowman?", answer: "Frostbite", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 37, question: "Why don't seagulls fly over the bay?", answer: "Then they would be bagels", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 38, question: "What's a vampire's least favorite room in the house?", answer: "The living room", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 39, question: "How do mountains stay warm in winter?", answer: "They wear snow caps", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 40, question: "Why can't you hear a pterodactyl use the bathroom?", answer: "The P is silent", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 41, question: "Why did the orange stop?", answer: "It ran out of juice", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 43, question: "What's the best way to watch a fly-fishing tournament?", answer: "Live stream it", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 44, question: "What do you call a gigantic pile of cats?", answer: "A meowtain", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 45, question: "What kind of car does an egg drive?", answer: "A Yolkswagen", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 46, question: "What does a nosy pepper do?", answer: "Gets jalapeno business", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 47, question: "Why did the person name their dogs Rolex and Timex?", answer: "They were watch dogs", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 48, question: "Why did the blanket go to jail?", answer: "It was covering up", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 49, question: "Why are elevator jokes so good?", answer: "They work on many levels", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 50, question: "Why did the pony get detention?", answer: "It kept horsing around", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 51, question: "What do you call an apology written in dots and dashes?", answer: "Remorse code", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 52, question: "Why did the bicycle fall over?", answer: "It was two tired", difficulty: 1, upVotes: 0, downVotes: 0 },
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
      { id: 90, question: "What do you call a musician with problems?", answer: "A trebled artist", difficulty: 3, upVotes: 0, downVotes: 0 },
      { id: 91, question: "What's a terrier's favorite city?", answer: "New Yorkie", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 92, question: "Why did the music teacher get locked out?", answer: "Because their keys were on the piano", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 93, question: "How do you get an astronaut's baby to stop crying?", answer: "You rocket", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 94, question: "What kind of lights did Noah use on the ark?", answer: "Flood lights", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 95, question: "What's the difference between a poorly dressed man on a tricycle and a well-dressed man on a bicycle?", answer: "Attire", difficulty: 3, upVotes: 0, downVotes: 0 },
      { id: 96, question: "Why don't skeletons play music in churches?", answer: "Because they have no organs", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 97, question: "Why was the fish so smart?", answer: "It went to school", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 98, question: "Why was Cinderella bad at soccer?", answer: "She ran away from the ball", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 99, question: "What's orange and sounds like a parrot?", answer: "A carrot", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 100, question: "What kind of shorts do storm clouds wear?", answer: "Thunderwear", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 101, question: "What's a cat's favorite color?", answer: "Purrrple", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 102, question: "What kind of tree fits in your hand?", answer: "A palm tree", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 103, question: "Why was the computer cold?", answer: "It left its Windows open", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 104, question: "What kind of fish goes great with peanut butter?", answer: "A jellyfish", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 105, question: "What kind of key opens a banana?", answer: "A monkey", difficulty: 1, upVotes: 0, downVotes: 0 },        
      { id: 106, question: "Where does a tree withdraw money?", answer: "A bank branch", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 107, question: "How do cows stay up to date?", answer: "They read the moospaper", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 108, question: "Why did the mushroom get invited to all the parties?", answer: "He was a fungi", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 109, question: "What did the duck say when it was time to pay for lunch?", answer: "Put it on my bill", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 110, question: "What kind of music do mummies listen to?", answer: "Wrap music", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 111, question: "Why can't your nose be 12 inches long?", answer: "It would be a foot", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 112, question: "What did the scarf say to the hat?", answer: "You go on ahead, I will hang around", difficulty: 3, upVotes: 0, downVotes: 0 },
      { id: 113, question: "Why did the golfer bring an umbrella?", answer: "They saw the forecast", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 114, question: "What kind of button can't you unbutton?", answer: "A belly button", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 115, question: "What noise does a sleeping brontosaurus make?", answer: "A dinosnore", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 116, question: "What did the left eye say to the right eye?", answer: "Between us something smells!", difficulty: 3, upVotes: 0, downVotes: 0 },
      { id: 117, question: "Why was the egg hiding?", answer: "It was a little chicken", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 118, question: "What kind of ball doesn't bounce?", answer: "An eyeball", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 119, question: "Why did the canned cucumber call 911?", answer: "It was getting in a pickle", difficulty: 3, upVotes: 0, downVotes: 0 },
      { id: 120, question: "How do you make a lemon drop?", answer: "Let go of it", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 121, question: "What kind of bug is good at math?", answer: "An account ant", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 122, question: "What did the spider make on the computer?", answer: "A website", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 123, question: "Why did the clock get in trouble at school?", answer: "It kept tocking back", difficulty: 3, upVotes: 0, downVotes: 0 },
      { id: 124, question: "Why did the police hire the book?", answer: "It could go under cover", difficulty: 2, upVotes: 0, downVotes: 0 },
      { id: 125, question: "What kind of room has no doors or windows?", answer: "A mushroom", difficulty: 1, upVotes: 0, downVotes: 0 },
      { id: 126, question: "What do you call a cute potato who works out?", answer: "A spud muffin", difficulty: 1, upVotes: 0, downVotes: 0 },                
      ];

      const forceReseed = process.argv.includes('--force')

async function main() {
  console.log('Checking database status...')

  try {
    const existingPunsCount = await prisma.pun.count()

    if (existingPunsCount > 0 && !forceReseed) {
      console.log(`Database already contains ${existingPunsCount} puns. Use --force to reseed.`)
      return
    }

    console.log('Start seeding ...')

    // Clear existing puns
    if (existingPunsCount > 0) {
      console.log('Clearing existing puns...')
      await prisma.pun.deleteMany()
    }

    for (const pun of puns) {
      const createdPun = await prisma.pun.create({
        data: pun
      })
      console.log(`Created pun with id: ${createdPun.id}`)
    }

    const finalPunsCount = await prisma.pun.count()
    console.log(`Seeding finished. Database now contains ${finalPunsCount} puns.`)

  } catch (error) {
    console.error('An error occurred during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })