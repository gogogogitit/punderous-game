import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const puns = [
  { question: "What do you call a fake noodle?", answer: "An impasta", difficulty: 1 },
  { question: "What do you call a can opener that doesn't work?", answer: "A cannot opener", difficulty: 2 },
  { question: "Why don't scientists trust atoms?", answer: "They make up everything", difficulty: 3 },
  { question: "What do you call a bear with no teeth?", answer: "A gummy bear", difficulty: 1 },
  { question: "What do you call a parade of rabbits hopping backwards?", answer: "A receding hare line", difficulty: 3 },
  { question: "What do you call a fake stone in Ireland?", answer: "A sham rock", difficulty: 2 },
  { question: "What do you call a sleeping bull?", answer: "A bulldozer", difficulty: 1 },
  { question: "What do you call a fish wearing a bowtie?", answer: "Sofishticated", difficulty: 3 },
  { question: "What do you call a dog magician?", answer: "A labracadabrador", difficulty: 2 },
];

async function main() {
  console.log('Resetting puns in the database...');

  // Delete all existing puns
  await prisma.pun.deleteMany();

  // Insert new puns
  for (const pun of puns) {
    await prisma.pun.create({
      data: {
        ...pun,
        upVotes: 0,
        downVotes: 0,
      },
    });
  }

  console.log('Puns have been reset and seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });