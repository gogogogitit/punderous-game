import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Pun = {
  id: number;
  question: string;
  answer: string;
  difficulty: number;
  upVotes: number;
  downVotes: number;
};

const puns: Pun[] = [
  // Your puns array here
];

async function main() {
  try {
    console.log('Checking database status...');
    
    const existingPunsCount = await prisma.pun.count();
    const forceReseed = process.argv.includes('--force');

    if (existingPunsCount > 0 && !forceReseed) {
      console.log(`Database already contains ${existingPunsCount} puns. Use --force to reseed.`);
      return;
    }

    console.log('Start seeding ...');

    if (existingPunsCount > 0) {
      console.log('Clearing existing puns...');
      await prisma.pun.deleteMany({});
    }

    for (const pun of puns) {
      const result = await prisma.pun.create({
        data: pun
      });
      console.log(`Created pun with id: ${result.id}`);
    }

    console.log('Seeding finished');

  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });