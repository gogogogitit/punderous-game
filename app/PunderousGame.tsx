'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Confetti from 'react-dom-confetti'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Star, Trophy, Send, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react'

interface Pun {
  id: number;
  question: string;
  answer: string;
  difficulty: number;
  votes: {
    up: number;
    down: number;
  };
}

const initialPuns: Pun[] = [
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
  { id: 13, question: "What do you call a parade of rabbits hopping backwards?", answer: "A receding hare line", difficulty: 3, votes: { up: 0, down: 0 } },
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
]

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

const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  colors: ["#FF6B35", "#A06CD5", "#00B4D8", "#247BA0", "#FFFFFF"]
}

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
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [puns, setPuns] = useState<Pun[]>([])
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [comment, setComment] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const initialPun = initialPuns[Math.floor(Math.random() * initialPuns.length)];
    setGameState({
      currentPun: initialPun,
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
      usedPunIds: new Set<number>([initialPun.id]),
      partialMatch: '',
      revealedLetters: [],
    });
    setPuns(initialPuns);
  }, []);

  useEffect(() => {
    if (!gameState) return;
    const storedPuns = localStorage.getItem('punderousPuns')
    if (storedPuns) {
      try {
        const parsedStoredPuns = JSON.parse(storedPuns)
        const updatedPuns = initialPuns.map(pun => {
          const storedPun = parsedStoredPuns.find((p: Pun) => p.id === pun.id)
          return storedPun ? { ...pun, votes: storedPun.votes } : pun
        })
        setPuns(updatedPuns)
      } catch (error) {
        console.error('Error parsing stored puns:', error)
      }
    }
  }, [gameState])

  useEffect(() => {
    if (!gameState) return;
    try {
      const punsToStore = puns.map(({ id, votes }) => ({ id, votes }))
      localStorage.setItem('punderousPuns', JSON.stringify(punsToStore))
    } catch (error) {
      console.error('Error saving puns to localStorage:', error)
    }
  }, [puns, gameState])

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

  const findPartialMatch = useCallback((userGuess: string, correctAnswer: string, previousGuesses: string[]): string | null => {
    const correctWords = correctAnswer.toLowerCase().split(' ')
    const allGuesses = [...previousGuesses, userGuess].map(guess => guess.toLowerCase())
    
    const matchedParts = correctWords.filter(word => 
      allGuesses.some(guess => guess.includes(word))
    )
    return matchedParts.length > 0 ? matchedParts.join(' ') : null
  }, [])

  const handleAnswerSubmit = useCallback(() => {
    if (!gameState || gameState.userAnswer.trim() === '' || gameState.gameOver) return
    const correctAnswer = gameState.currentPun.answer;
    const userGuess = gameState.userAnswer;
    const newRevealedLetters = [...gameState.revealedLetters]
    userGuess.toLowerCase().split('').forEach(letter => {
      if (correctAnswer.toLowerCase().includes(letter) && !newRevealedLetters.includes(letter)) {
        newRevealedLetters.push(letter)
      }
    })

    const isFullyRevealed = correctAnswer.toLowerCase().split('').every(letter => 
      letter === ' ' || newRevealedLetters.includes(letter)
    );

    if (compareAnswers(userGuess, correctAnswer) || isFullyRevealed) {
      const pointsEarned = gameState.currentPun.difficulty;
      setGameState(prev => ({
        ...prev!,
        score: prev!.score + pointsEarned,
        playerSkillLevel: prev!.playerSkillLevel + 1,
        isCorrect: true,
        showCorrectAnswer: true,
        correctAnswerDisplay: correctAnswer,
        userAnswer: '',
        feedback: `Correct! You earned ${pointsEarned} point${pointsEarned > 1 ? 's' : ''}.`,
        usedPunIds: new Set([...prev!.usedPunIds, prev!.currentPun.id]),
        guessedAnswers: [...prev!.guessedAnswers, userGuess],
        revealedLetters: Array.from(new Set([...newRevealedLetters, ...correctAnswer.toLowerCase().split('')])),
      }))
    } else {
      setGameState(prev => {
        const newAttempts = prev!.attempts - 1
        const partialMatchResult = findPartialMatch(userGuess, correctAnswer, prev!.guessedAnswers)
        const newFeedback = newAttempts === 0
          ? `Game over!`
          : `Not quite! You have ${newAttempts} attempts left.`
        return {
          ...prev!,
          attempts: newAttempts,
          playerSkillLevel: 1,
          guessedAnswers: [...prev!.guessedAnswers, userGuess],
          partialMatch: partialMatchResult || '',
          feedback: newFeedback,
          gameOver: newAttempts === 0,
          userAnswer: '',
          showCorrectAnswer: newAttempts === 0,
          correctAnswerDisplay: newAttempts === 0 ? correctAnswer : '',
          revealedLetters: newRevealedLetters,
        }
      })
    }
  }, [gameState, compareAnswers, findPartialMatch])

  const getNextPun = useCallback(() => {
    if (!gameState) return;
    const unusedPuns = puns.filter(pun => !gameState.usedPunIds.has(pun.id) && pun.difficulty <= gameState.playerSkillLevel)
    
    if (unusedPuns.length === 0) {
      const shuffledPuns = [...puns].sort(() => Math.random() - 0.5)
      setPuns(shuffledPuns)
      setGameState(prev => ({
        ...prev!,
        currentPun: shuffledPuns[0],
        attempts: 5,
        guessedAnswers: [],
        showCorrectAnswer: false,
        isCorrect: false,
        feedback: '',
        userAnswer: '',
        usedPunIds: new Set([shuffledPuns[0].id]),
        partialMatch: '',
        revealedLetters: [],
      }))
    } else {
      const randomPun = unusedPuns[Math.floor(Math.random() * unusedPuns.length)]
      setGameState(prev => ({
        ...prev!,
        currentPun: randomPun,
        attempts: 5,
        guessedAnswers: [],
        showCorrectAnswer: false,
        isCorrect: false,
        feedback: '',
        userAnswer: '',
        usedPunIds: new Set([...prev!.usedPunIds, randomPun.id]),
        partialMatch: '',
        revealedLetters: [],
      }))
    }
  }, [gameState, puns])

  const resetGame = useCallback(() => {
    const shuffledPuns = [...puns].sort(() => Math.random() - 0.5)
    const randomPun = shuffledPuns[0]
    setPuns(shuffledPuns)
    setGameState({
      currentPun: randomPun,
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
      usedPunIds: new Set([randomPun.id]),
      partialMatch: '',
      revealedLetters: [],
    })
  }, [puns])

  const handleEmailSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')

    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, comment }),
      })

      const data = await response.json()

      if (data.success) {
        setEmailSubmitted(true)
        setEmail('')
        setComment('')
      } else {
        setSubmitError(data.error || 'An error occurred while submitting your email.')
      }
    } catch (error) {
      console.error('Error submitting email:', error)
      setSubmitError('An error occurred while submitting your email. Please try again.')
    }
  }, [email, comment])

  const handleVote = useCallback((id: number, voteType: 'up' | 'down') => {
    setPuns(prevPuns => prevPuns.map(pun => 
      pun.id === id
        ? { ...pun, votes: { ...pun.votes, [voteType]: pun.votes[voteType] + 1 } }
        : pun
    ))
  }, [])

  const handleSkip = useCallback(() => {
    if (gameState && !gameState.isCorrect && !gameState.gameOver) getNextPun()
  }, [gameState, getNextPun])

  const getDifficultyText = (difficulty: number): string => difficulty === 1 ? "Easy (1 point)" :
    difficulty === 2 ? "Medium (2 points)" :
    difficulty === 3 ? "Hard (3 points)" : "Unknown";

  if (!gameState) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00B4D8] p-2">
      <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center border-b border-gray-200 py-3">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-[180px] h-[180px] mb-2">
              <Image
                src="/punderous-logo.png"
                alt="Punderous™ Logo"
                width={180}
                height={180}
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
                      onClick={() => handleVote(gameState.currentPun.id, 'up')}
                      variant="outline"
                      className="flex items-center space-x-1 text-sm border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{gameState.currentPun.votes.up}</span>
                    </Button>
                    <Button
                      onClick={() => handleVote(gameState.currentPun.id, 'down')}
                      variant="outline"
                      className="flex items-center space-x-1 text-sm border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{gameState.currentPun.votes.down}</span>
                    </Button>
                    <Button
                      onClick={getNextPun}
                      variant="outline"
                      className="flex items-center space-x-1 text-sm border-[#A06CD5] text-[#A06CD5] hover:bg-[#A06CD5] hover:text-white"
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
                {gameState.partialMatch && (
                  <p className="text-sm text-center text-[#00B4D8] font-medium mt-2">
                    Parts of the answer: {gameState.partialMatch}
                  </p>
                )}
                {gameState.guessedAnswers.length > 0 && (
                  <div className="text-sm text-center text-gray-700 mt-2">
                    <span className="font-medium">Previous guesses:</span>
                    <ol className="list-decimal list-inside">
                      {gameState.guessedAnswers.map((guess, index) => (
                        <li key={index}>{guess}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-full">
            <Input
              type="text"
              placeholder="Enter your answer"
              value={gameState.userAnswer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGameState(prev => ({ ...prev!, userAnswer: e.target.value }))}
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
              onClick={handleSkip}
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm py-2"
              disabled={gameState.isCorrect || gameState.gameOver}
            >
              Skip
            </Button>
          </div>
          {gameState.gameOver && !gameState.isCorrect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-2"
            >
              <p className="text-lg font-medium text-gray-800">Game Over!</p>
              <p className="text-sm text-gray-600">The correct answer was:</p>
              <p className="text-md font-medium text-[#00B4D8]">{gameState.correctAnswerDisplay}</p>
              <Button
                onClick={resetGame}
                className="w-full bg-[#00B4D8] text-white hover:bg-[#00B4D8]/90 text-sm py-2 mt-2"
              >
                Play Again
              </Button>
            </motion.div>
          )}
          <Confetti active={gameState.isCorrect} config={confettiConfig} />
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3 border-t border-gray-200 p-3">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Coming Soon: Punderous™ Full Version</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AI-powered pun game that adapts to your skill level</li>
              <li>• Create and share your own puns for inclusion in the game</li>
              <li>• Compete with friends and climb the global leaderboard</li>
              <li>• Unlock achievements and earn badges as you play</li>
              <li>• Daily challenges and themed pun collections</li>
            </ul>
          </div>
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