'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Star, Trophy, Send, ThumbsUp, ThumbsDown, ArrowRight, CircleDollarSign, Share2 } from 'lucide-react'
import { submitFeedback, votePun } from './actions'


interface Pun {
  question: string;
  answer: string;
  difficulty: number;
  upVotes: number;
  downVotes: number;
}

interface GameState {
  currentPun: Pun;
  userAnswer: string;
  guessedAnswers: string[];
  attempts: number;
  score: number;
  gameOver: boolean;
  playerSkillLevel: number;
  feedback: string;
  isCorrect: boolean;
  showCorrectAnswer: boolean;
  correctAnswerDisplay: string;
  usedPunIds: Set<number>;
  partialMatch: string;
  revealedLetters: string[];
}

const initialPuns: Pun[] = [
  { question: "What do you call a rabbit with a positive future outlook?", answer: "A hoptimist", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a fake noodle?", answer: "An impasta", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a can opener that doesn't work?", answer: "A can't opener", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why don't scientists trust atoms?", answer: "They make up everything", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a bear with no teeth?", answer: "A gummy bear", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why did the scarecrow win an award?", answer: "They were outstanding in their field", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a pig that does karate?", answer: "A pork chop", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why don't eggs tell jokes?", answer: "They would crack up", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a sleeping bull?", answer: "A bulldozer", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why did the math book look so sad?", answer: "It had too many problems", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the golfer bring two pairs of pants?", answer: "In case they got a hole in one", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a parade of rabbits hopping backwards?", answer: "A receding hare line", difficulty: 3, upVotes: 0, downVotes: 0 },
  { question: "Why don't skeletons fight each other?", answer: "They don't have the guts", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a fake stone in Ireland?", answer: "A sham rock", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "How do you organize a space party?", answer: "You planet", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why don't scientists trust atoms?", answer: "They make up everything", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a fish wearing a bowtie?", answer: "Sofishticated", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a dinosaur that crashes their car?", answer: "Tyrannosaurus wrecks", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why don't oysters donate to charity?", answer: "They're shellfish", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the gym get smaller and close down?", answer: "It didn't work out", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a fake noodle?", answer: "An impasta", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why did the cookie go to the doctor?", answer: "Because it was feeling crumbly", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a snowman with a six-pack?", answer: "An abdominal snowman", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What did the grape do when it got stepped on?", answer: "Let out a little wine", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the banker switch careers?", answer: "They lost interest", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the stadium get so hot?", answer: "All the fans left", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a dinosaur with an extensive vocabulary?", answer: "A thesaurus", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a bee that can't make up its mind?", answer: "A maybee", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why do cows wear bells?", answer: "Their horns don't work", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the frog take the bus?", answer: "Their car got toad", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the barber win a race?", answer: "They took a shortcut", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What did the janitor say when they jumped out of the closet?", answer: "Supplies!", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the coffee file a police report?", answer: "It got mugged", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why couldn't the bicycle find its way?", answer: "It lost its bearings", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What did the buffalo say to their son when he left for college?", answer: "Bison", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call an alligator detective?", answer: "An investigator", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you get if you cross a vampire with a snowman?", answer: "Frostbite", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why don't seagulls fly over the bay?", answer: "Then they'd be bagels", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What's a vampire's least favorite room in the house?", answer: "The living room", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "How do mountains stay warm in winter?", answer: "They wear snow caps", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why can't you hear a pterodactyl use the bathroom?", answer: "The 'P' is silent", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the orange stop?", answer: "It ran out of juice", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "How did the big flower greet the smaller flower?", answer: "Hey little bud!", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What's the best way to watch a fly-fishing tournament?", answer: "Live stream it", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a gigantic pile of cats?", answer: "A meowtain", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What kind of car does an egg drive?", answer: "A Yolkswagen", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What does a nosy pepper do?", answer: "Gets jalapeño business", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the person name their dogs Rolex and Timex?", answer: "They were watch dogs", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the blanket go to jail?", answer: "It was covering up", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why are elevator jokes so good?", answer: "They work on many levels", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the pony get detention?", answer: "It kept horsing around", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call an apology written in dots and dashes?", answer: "Remorse code", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the bicycle fall over?", answer: "It was two-tired", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "How did the cell phone propose?", answer: "With a ringtone", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What is a grape's favorite dance move?", answer: "Raisin the roof", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What did the clock do when it was hungry?", answer: "Went back four seconds", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a broken pencil?", answer: "Pointless", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why did the banana go to the doctor?", answer: "It wasn't peeling well", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do chickens do after school?", answer: "Eggstracurricular activities", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What's a ghost's favorite dessert?", answer: "I scream", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why do cows never have any money?", answer: "Farmers milk them dry", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a possessed chicken?", answer: "A poultrygeist", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What's a vampire's least favorite food?", answer: "Steak", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why did the sun go to school?", answer: "To get a little brighter", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why do bees have sticky hair?", answer: "They use honeycombs", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What kind of pants do ghosts wear?", answer: "Boo jeans", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why was the belt arrested?", answer: "For holding up a pair of pants", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What's a plumber's least favorite vegetable?", answer: "Leeks", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What kind of bird works at a construction site?", answer: "A crane", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why did the cookie visit the therapist?", answer: "It was feeling crumby", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "Why did the hipster burn their mouth?", answer: "They drank coffee before it was cool", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a fairy that doesn't take a bath?", answer: "Stinkerbell", difficulty: 2, upVotes: 0, downVotes: 0 },
  { question: "What do you call a swimming melon?", answer: "A watermelon", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why was the calendar sad?", answer: "Its days were numbered", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why are frogs so happy?", answer: "They eat whatever bugs them", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What noise does a nut make when it sneezes?", answer: "Cashew!", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a clever duck?", answer: "A wise quacker", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a bagel that flies?", answer: "A plane bagel", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why did the computer go to the doctor?", answer: "It had a virus", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a bear that's stuck in the rain?", answer: "A drizzly bear", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "Why did the opera singer need a ladder?", answer: "To reach the high notes", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a kangaroo who watches TV all day?", answer: "A pouch potato", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a cow that plays an instrument?", answer: "A moosician", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a pony with a cough?", answer: "A little hoarse", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a factory that makes okay products?", answer: "A satisfactory", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a cow with two legs?", answer: "Lean beef", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "How do trees access the internet?", answer: "They log on", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a snake building a house?", answer: "A boa constructor", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a bear that never wants to grow up?", answer: "Peter Panda", difficulty: 1, upVotes: 0, downVotes: 0 },
  { question: "What do you call a cow with no legs?", answer: "Ground beef", difficulty: 1, upVotes: 0, downVotes: 0 },
]

const LetterHint: React.FC<{ answer: string; revealedLetters: string[] }> = ({ answer, revealedLetters }) => {
  const words = answer.split(' ');
  const isShortAnswer = answer.length <= 12;

  const renderHintLine = (line: string) => (
    <div className="flex justify-center space-x-1">
      {line.split('').map((letter, index) => (
        <span key={index} className="text-lg font-bold w-6 h-8 flex items-center justify-center">
          {letter === ' ' ? '\u00A0' : (revealedLetters.includes(letter.toLowerCase()) ? letter : '_')}
        </span>
      ))}
    </div>
  );

  if (isShortAnswer) {
    return <div className="mt-2">{renderHintLine(answer)}</div>;
  }

  const firstHalf = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const secondHalf = words.slice(Math.ceil(words.length / 2)).join(' ');

  return (
    <div className="mt-2 space-y-1">
      {renderHintLine(firstHalf)}
      {renderHintLine(secondHalf)}
    </div>
  );
};

export default function PunderousGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentPun: initialPuns[0],
    userAnswer: '',
    guessedAnswers: [],
    attempts: 5,
    score: 0,
    gameOver: false,
    playerSkillLevel: 1,
    feedback: '',
    isCorrect: false,
    showCorrectAnswer: false,
    correctAnswerDisplay: '',
    usedPunIds: new Set([initialPuns[0].question.length]),
    partialMatch: '',
    revealedLetters: [],
  });
  const [puns, setPuns] = useState<Pun[]>(initialPuns)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [comment, setComment] = useState('')
  const [submitError, setSubmitError] = useState('')

  const compareAnswers = useCallback((userAnswer: string, correctAnswer: string): boolean => {
    const cleanAnswer = (answer: string) => 
      answer.toLowerCase()
        .replace(/^(a|an|it|they're|they)\s+/i, '')
        .replace(/\s+/g, ' ')
        .replace(/[.,!?]/g, '')
        .trim();
    const cleanedUserAnswer = cleanAnswer(userAnswer);
    const cleanedCorrectAnswer = cleanAnswer(correctAnswer);
    if (cleanedUserAnswer === cleanedCorrectAnswer) {
      return true;
    }
    const userWords = cleanedUserAnswer.split(' ');
    const correctWords = cleanedCorrectAnswer.split(' ');
    const allWordsPresent = correctWords.every(word => userWords.includes(word));
    const matchPercentage = correctWords.filter(word => userWords.includes(word)).length / correctWords.length;

    return allWordsPresent || matchPercentage >= 0.6;
  }, [])

  const handleAnswerSubmit = useCallback(() => {
    if (gameState.userAnswer.trim() === '' || gameState.gameOver) return;
    const correctAnswer = gameState.currentPun.answer;
    const userGuess = gameState.userAnswer.trim();

    const newRevealedLetters = [...gameState.revealedLetters];
    userGuess.toLowerCase().split('').forEach(letter => {
      if (correctAnswer.toLowerCase().includes(letter) && !newRevealedLetters.includes(letter)) {
        newRevealedLetters.push(letter);
      }
    });

    if (compareAnswers(userGuess, correctAnswer)) {
      const pointsEarned = gameState.currentPun.difficulty;
      setGameState(prev => ({
        ...prev,
        score: prev.score + pointsEarned,
        playerSkillLevel: prev.playerSkillLevel + 1,
        isCorrect: true,
        showCorrectAnswer: true,
        correctAnswerDisplay: correctAnswer,
        userAnswer: '',
        feedback: `Correct! You earned ${pointsEarned} point${pointsEarned > 1 ? 's' : ''}.`,
        guessedAnswers: [...prev.guessedAnswers, userGuess],
        revealedLetters: newRevealedLetters,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        attempts: prev.attempts - 1,
        guessedAnswers: [...prev.guessedAnswers, userGuess],
        feedback: prev.attempts - 1 === 0 ? `Game over!` : `Not quite! You have ${prev.attempts - 1} attempts left.`,
        gameOver: prev.attempts - 1 === 0,
        userAnswer: '',
        showCorrectAnswer: prev.attempts - 1 === 0,
        correctAnswerDisplay: prev.attempts - 1 === 0 ? correctAnswer : '',
        revealedLetters: newRevealedLetters,
      }));
    }
  }, [gameState, compareAnswers]);

  const getNextPun = useCallback(() => {
    const unusedPuns = puns.filter(pun => !gameState.usedPunIds.has(pun.question.length))
    
    if (unusedPuns.length === 0) {
      const shuffledPuns = [...puns].sort(() => Math.random() - 0.5)
      setPuns(shuffledPuns)
      setGameState(prev => ({
        ...prev,
        currentPun: shuffledPuns[0],
        attempts: 5,
        guessedAnswers: [],
        showCorrectAnswer: false,
        isCorrect: false,
        feedback: '',
        userAnswer: '',
        usedPunIds: new Set([shuffledPuns[0].question.length]),
        revealedLetters: [],
      }))
    } else {
      const randomPun = unusedPuns[Math.floor(Math.random() * unusedPuns.length)]
      setGameState(prev => ({
        ...prev,
        currentPun: randomPun,
        attempts: 5,
        guessedAnswers: [],
        showCorrectAnswer: false,
        isCorrect: false,
        feedback: '',
        userAnswer: '',
        usedPunIds: new Set([...prev.usedPunIds, randomPun.question.length]),
        revealedLetters: [],
      }))
    }
  }, [gameState.usedPunIds, puns])

  const handleEmailSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')

    try {
      const result = await submitFeedback(email, comment)

      if (result.success) {
        setEmailSubmitted(true)
        setEmail('')
        setComment('')
      } else {
        setSubmitError(result.error || 'An error occurred while submitting your email.')
      }
    } catch (error) {
      console.error('Error submitting email:', error)
      setSubmitError('An error occurred while submitting your email. Please try again.')
    }
  }, [email, comment])

  const handleVote = useCallback(async (pun: Pun, voteType: 'up' | 'down') => {
    try {
      const result = await votePun(pun.question, voteType)

      if (result.success && result.data) {
        const updatedPun = result.data
        setPuns(prevPuns => prevPuns.map(p => 
          p.question === pun.question ? { 
            ...p, 
            upVotes: updatedPun?.upVotes ?? p.upVotes, 
            downVotes: updatedPun?.downVotes ?? p.downVotes 
          } : p
        ))

        if (gameState.currentPun.question === pun.question) {
          setGameState(prevState => ({
            ...prevState,
            currentPun: {
              ...prevState.currentPun,
              upVotes: updatedPun?.upVotes ?? prevState.currentPun.upVotes,
              downVotes: updatedPun?.downVotes ?? prevState.currentPun.downVotes
            }
          }))
        }

        // Move to the next question after voting
        getNextPun()
      } else {
        console.error('Error submitting vote:', result.error)
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
    }
  }, [gameState.currentPun, getNextPun])

  const getDifficultyText = (difficulty: number): string => difficulty === 1 ? "Easy (1 point)" :
    difficulty === 2 ? "Medium (2 points)" :
    difficulty === 3 ? "Hard (3 points)" : "Unknown";

  const handleDonation = useCallback((platform: 'paypal' | 'venmo') => {
    const paypalUrl = 'https://www.paypal.com/ncp/payment/RJJZ7Z78PTDUW'
    const venmoUrl = 'https://venmo.com/u/punderousgame'

    window.open(platform === 'paypal' ? paypalUrl : venmoUrl, '_blank', 'noopener,noreferrer')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00B4D8] p-2">
      <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center border-b border-gray-200 py-1.5">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-[210px] h-[210px] mb-3">
              <Image
                src="/punderous-logo.png"
                alt="Punderous™ Logo"
                width={300}
                height={300}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              A pun-filled word game where we ask the questions and you guess the puns!
            </p>
            <CardDescription className="text-lg font-medium text-[#00B4D8]">
              Let the Brainstorm Begin!
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-3 p-3">
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <div className="px-2 py-1 bg-[#FFD151] text-gray-800 rounded-full">
              <Trophy className="w-4 h-4 inline-block mr-1" />
              Score: {gameState.score}
            </div>
            <div className="px-2 py-1 bg-[#FF6B35] text-white rounded-full">
              <ChevronRight className="w-4 h-4 inline-block mr-1" />
              Attempts: {gameState.attempts}
            </div>
            <div className="px-2 py-1 bg-[#A06CD5] text-white rounded-full">
              <Star className="w-4 h-4 inline-block mr-1" />
              Level: {gameState.playerSkillLevel}
            </div>
          </div>
          <AnimatePresence mode="wait">
            {gameState.isCorrect && gameState.showCorrectAnswer ? (
              <motion.div
                key="correct-answer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="w-full rounded-lg border-2 border-[#00B4D8] p-3 bg-[#00B4D8]/10"
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-xl font-medium text-[#00B4D8] text-center"
                >
                  Correct!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-lg font-medium text-gray-800 mt-1 text-center"
                >
                  {gameState.correctAnswerDisplay}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col items-center space-y-2 mt-2"
                >
                  <p className="text-sm text-gray-700 font-medium">Was this a good pun or a bad pun?</p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => handleVote(gameState.currentPun, 'up')}
                      variant="outline"
                      className="flex items-center space-x-1 text-sm border-[#00B4D8] text-[#00B4D8] "
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{gameState.currentPun.upVotes}</span>
                    </Button>
                    <Button
                      onClick={() => handleVote(gameState.currentPun, 'down')}
                      variant="outline"
                      className="flex items-center space-x-1 text-sm border-[#FF6B35] text-[#FF6B35]"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{gameState.currentPun.downVotes}</span>
                    </Button>
                    <Button
                      onClick={getNextPun}
                      variant="outline"
                      className="flex items-center space-x-1 text-sm border-[#A06CD5] text-[#A06CD5]"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Next</span>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="question"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="w-full rounded-lg border-2 border-[#00B4D8] p-3 bg-[#00B4D8]/10 text-center"
              >
                <p className="text-lg font-medium text-gray-800 mb-1">
                  {gameState.currentPun.question}
                </p>
                <p className="text-sm text-gray-600">
                  Difficulty: {getDifficultyText(gameState.currentPun.difficulty)}
                </p>
                {gameState.feedback && (
                  <p className="text-sm text-center text-gray-700 mt-2">
                    {gameState.feedback}
                  </p>
                )}
                <LetterHint answer={gameState.currentPun.answer} revealedLetters={gameState.revealedLetters} />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-full">
            <Input
              type="text"
              placeholder="Enter your answer"
              value={gameState.userAnswer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAnswerSubmit()
                }
              }}
              className="w-full text-sm border-2 border-gray-300 focus:border-[#00B4D8] focus:ring-[#00B4D8]"
              disabled={gameState.gameOver || gameState.isCorrect}
            />
          </div>
          <div className="flex justify-between w-full space-x-2">
            <Button
              onClick={handleAnswerSubmit}
              className="flex-1 bg-[#00B4D8] text-white hover:bg-[#00B4D8]/90 text-sm py-2"
              disabled={gameState.gameOver || gameState.isCorrect}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
            <Button
              onClick={getNextPun}
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm py-2"
              disabled={gameState.isCorrect || gameState.gameOver}
            >
              Skip
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3 border-t border-gray-200 p-3">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">Coming Soon: Punderous™ Full Version</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AI-powered pun game that adapts to your skill</li>
              <li>• Create and share your own puns in the game</li>
              <li>• Compete with friends and climb the leaderboard</li>
              <li>• Unlock achievements and earn badges</li>
              <li>• Earn points for speed and consecutive answers</li>
            </ul>
          </div>
          <div className="w-full space-y-2 mt-4">
            {!emailSubmitted && (
              <form onSubmit={handleEmailSubmit} className="w-full space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email for updates"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full text-sm border-2 border-gray-300 focus:border-[#00B4D8] focus:ring-[#00B4D8]"
                  required
                />
                <Textarea
                  placeholder="Optional: Share your thoughts or suggestions..."
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                  className="w-full text-sm border-2 border-gray-300 focus:border-[#00B4D8] focus:ring-[#00B4D8]"
                />
                <Button 
                  type="submit"
                  className="w-full bg-[#00B4D8] text-white hover:bg-[#00B4D8]/90 text-sm py-2"
                >
                  Get Notified
                </Button>
              </form>
            )}
            {emailSubmitted && (
              <p className="text-sm text-green-600 font-medium">
                Thank you for your interest! We'll keep you updated on the full version release.
              </p>
            )}
            {submitError && (
              <p className="text-sm text-red-600 font-medium">
                {submitError}
              </p>
            )}
          </div>
          <div className="w-full space-y-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">Support Punderous™ Development</h3>
            <p className="text-sm text-gray-600 text-center mb-4">Your contribution helps bring the full version to life! Choose your preferred payment method:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <Button
                onClick={() => handleDonation('paypal')}
                className="bg-[#0070BA] text-white hover:bg-[#003087] text-sm py-2 flex-1"
              >
                <CircleDollarSign className="w-4 h-4 mr-2" />
                Support with PayPal
              </Button>
              <Button
                onClick={() => handleDonation('venmo')}
                className="bg-[#008CFF] text-white hover:bg-[#0070BA] text-sm py-2 flex-1"
              >
                <CircleDollarSign className="w-4 h-4 mr-2" />
                Support with Venmo
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              All donations directly support game development.
            </p>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            © 2024 MJKUltra. All rights reserved.
            <Link href="/privacy-policy" className="ml-2 text-[#00B4D8] hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}