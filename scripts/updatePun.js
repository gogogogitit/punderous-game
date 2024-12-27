require('dotenv').config();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updatePun() {
  try {
    await prisma.pun.update({
      where: {
        id: 108
      },
      data: {
        question: "Why did Mr. Mushroom get invited to all the parties?",
        answer: "He was a fungi"
      }
    })
    console.log('Pun #108 updated successfully')
  } catch (error) {
    console.error('Error updating pun:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePun() 