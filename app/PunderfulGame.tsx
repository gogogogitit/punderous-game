'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/Textarea"
import Confetti from 'react-dom-confetti'
import Image from 'next/image'
import { ChevronRight, Star, Trophy, Send, ThumbsUp, ThumbsDown } from 'lucide-react'

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
]

interface GameState {
  currentPun: Pun;
  userAnswer: string;
  guessedAnswers: string[];
  attempts: number;
  score: number;
  gameOver: boolean;
  dailyGamesPlayed: number;
  playerSkillLevel: number;
  feedback: string;
  isCorrect: boolean;
  partialMatch: string;
  showCorrectAnswer: boolean;
  correctAnswerDisplay: string;
  correctLetters: Set<string>;
  usedPunIds: Set<number>;
  unlimitedMode: boolean;
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
  colors: ["#FF6B35", "#FFD151", "#A06CD5", "#247BA0", "#FFFFFF"]
}

export default function PunderfulGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentPun: initialPuns[0],
    userAnswer: '',
    guessedAnswers: [],
    attempts: 5,
    score: 0,
    gameOver: false,
    dailyGamesPlayed: 0,
    playerSkillLevel: 1,
    feedback: '',
    isCorrect: false,
    partialMatch: '',
    showCorrectAnswer: false,
    correctAnswerDisplay: '',
    correctLetters: new Set<string>(),
    usedPunIds: new Set<number>([initialPuns[0].id]),
    unlimitedMode: false
  })
  const [puns, setPuns] = useState<Pun[]>(initialPuns)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [dailyLimitReached, setDailyLimitReached] = useState(false)
  const [comment, setComment] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const storedPuns = localStorage.getItem('punderfulPuns')
    const storedState = localStorage.getItem('punderfulGameState')
    const storedDate = localStorage.getItem('punderfulLastPlayedDate')
    const currentDate = new Date().toDateString()

    let updatedPuns = [...initialPuns]
    if (storedPuns) {
      try {
        const parsedStoredPuns = JSON.parse(storedPuns)
        updatedPuns = initialPuns.map(pun => {
          const storedPun = parsedStoredPuns.find((p: Pun) => p.id === pun.id)
          return storedPun ? { ...pun, votes: storedPun.votes } : pun
        })
      } catch (error) {
        console.error('Error parsing stored puns:', error)
      }
    }

    const shuffledPuns = updatedPuns.sort(() => Math.random() - 0.5)
    setPuns(shuffledPuns)

    if (storedState && storedDate === currentDate) {
      try {
        const parsedState = JSON.parse(storedState)
        setGameState(prevState => ({
          ...prevState,
          ...parsedState,
          correctLetters: new Set(Array.isArray(parsedState.correctLetters) ? parsedState.correctLetters : []),
          usedPunIds: new Set(Array.isArray(parsedState.usedPunIds) ? parsedState.usedPunIds : []),
        }))
        if (parsedState.dailyGamesPlayed >= 5 && !parsedState.unlimitedMode) {
          setDailyLimitReached(true)
        }
      } catch (error) {
        console.error('Error parsing stored game state:', error)
      }
    } else {
      setGameState(prevState => ({
        ...prevState,
        dailyGamesPlayed: 0,
        usedPunIds: new Set<number>(),
        unlimitedMode: false
      }))
      setDailyLimitReached(false)
      localStorage.setItem('punderfulLastPlayedDate', currentDate)
    }
  }, [])

  useEffect(() => {
    try {
      const punsToStore = puns.map(({ id, votes }) => ({ id, votes }))
      localStorage.setItem('punderfulPuns', JSON.stringify(punsToStore))
      localStorage.setItem('punderfulGameState', JSON.stringify({
        ...gameState,
        correctLetters: Array.from(gameState.correctLetters),
        usedPunIds: Array.from(gameState.usedPunIds),
      }))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [puns, gameState])

  const findPartialMatch = (userGuess: string, correctAnswer: string, previousGuesses: string[]): string | null => {
    const correctWords = correctAnswer.toLowerCase().split(' ')
    const allGuesses = [...previousGuesses, userGuess].map(guess => guess.toLowerCase())
    
    const matchedParts = correctWords.filter(word => 
      allGuesses.some(guess => guess.includes(word))
    )
    return matchedParts.length > 0 ? matchedParts.join(' ') : null
  }

  const compareAnswers = (userAnswer: string, correctAnswer: string): boolean => {
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

    return allWordsPresent || matchPercentage >= 0.7;
  };

  const findCorrectLetters = (userGuess: string, correctAnswer: string): Set<string> => {
    const guessLetters = new Set(userGuess.toLowerCase().replace(/\s/g, ''))
    const answerLetters = new Set(correctAnswer.toLowerCase().replace(/\s/g, ''))
    return new Set([...guessLetters].filter(letter => answerLetters.has(letter)))
  }

  const handleAnswerSubmit = useCallback(() => {
    if (gameState.userAnswer.trim() === '' || gameState.gameOver) return
    if (gameState.userAnswer.toLowerCase() === '#playforever') {
      setGameState(prev => ({
        ...prev,
        unlimitedMode: true,
        userAnswer: '',
        feedback: 'Unlimited mode activated! You can now play forever.',
      }))
      setDailyLimitReached(false)
      return
    }
    const correctAnswer = gameState.currentPun.answer;
    const userGuess = gameState.userAnswer;
    if (compareAnswers(userGuess, correctAnswer)) {
      const pointsEarned = gameState.currentPun.difficulty;
      setGameState(prev => ({
        ...prev,
        score: prev.score + pointsEarned,
        playerSkillLevel: Math.min(prev.playerSkillLevel + 1, 3),
        isCorrect: true,
        showCorrectAnswer: true,
        correctAnswerDisplay: correctAnswer,
        userAnswer: '',
        dailyGamesPlayed: prev.unlimitedMode ? prev.dailyGamesPlayed : prev.dailyGamesPlayed + 1,
        feedback: `Correct! You earned ${pointsEarned} point${pointsEarned > 1 ? 's' : ''}.`,
        usedPunIds: new Set([...prev.usedPunIds, prev.currentPun.id]),
      }))
    } else {
      const newCorrectLetters = findCorrectLetters(userGuess, correctAnswer)
      setGameState(prev => {
        const newAttempts = prev.attempts - 1
        const partialMatchResult = findPartialMatch(userGuess, correctAnswer, prev.guessedAnswers)
        const newFeedback = newAttempts === 0
          ? `Game over!`
          : partialMatchResult
            ? `Close! You're on the right track. Parts of the answer: "${partialMatchResult}"`
            : `Not quite! You have ${newAttempts} attempts left.`
        return {
          ...prev,
          attempts: newAttempts,
          guessedAnswers: [...prev.guessedAnswers, prev.userAnswer],
          partialMatch: partialMatchResult || '',
          feedback: newFeedback,
          gameOver: newAttempts === 0,
          userAnswer: '',
          showCorrectAnswer: newAttempts === 0,
          correctAnswerDisplay: newAttempts === 0 ? correctAnswer : '',
          correctLetters: new Set([...prev.correctLetters, ...newCorrectLetters]),
        }
      })
    }
  }, [gameState, compareAnswers, findCorrectLetters, findPartialMatch])

  const getNextPun = useCallback(() => {
    if (gameState.dailyGamesPlayed >= 5 && !gameState.unlimitedMode) {
      setDailyLimitReached(true)
      return
    }
    const unusedPuns = puns.filter(pun => !gameState.usedPunIds.has(pun.id) && pun.difficulty <= gameState.playerSkillLevel)
    
    if (unusedPuns.length === 0) {
      const shuffledPuns = [...puns].sort(() => Math.random() - 0.5)
      setPuns(shuffledPuns)
      setGameState(prev => ({
        ...prev,
        currentPun: shuffledPuns[0],
        attempts: 5,
        guessedAnswers: [],
        partialMatch: '',
        showCorrectAnswer: false,
        isCorrect: false,
        feedback: '',
        userAnswer: '',
        correctLetters: new Set<string>(),
        usedPunIds: new Set([shuffledPuns[0].id]),
        dailyGamesPlayed: prev.unlimitedMode ? prev.dailyGamesPlayed : prev.dailyGamesPlayed + 1,
      }))
    } else {
      const randomPun = unusedPuns[Math.floor(Math.random() * unusedPuns.length)]
      setGameState(prev => ({
        ...prev,
        currentPun: randomPun,
        attempts: 5,
        guessedAnswers: [],
        partialMatch: '',
        showCorrectAnswer: false,
        isCorrect: false,
        feedback: '',
        userAnswer: '',
        correctLetters: new Set<string>(),
        usedPunIds: new Set([...prev.usedPunIds, randomPun.id]),
        dailyGamesPlayed: prev.unlimitedMode ? prev.dailyGamesPlayed : prev.dailyGamesPlayed + 1,
      }))
    }
  }, [gameState, puns])

  const resetGame = useCallback(() => {
    if (gameState.dailyGamesPlayed >= 5 && !gameState.unlimitedMode) {
      setDailyLimitReached(true)
      return
    }
    const shuffledPuns = [...puns].sort(() => Math.random() - 0.5)
    setPuns(shuffledPuns)
    setGameState(prev => ({
      ...prev,
      currentPun: shuffledPuns[0],
      userAnswer: '',
      guessedAnswers: [],
      attempts: 5,
      score: 0,
      gameOver: false,
      playerSkillLevel: 1,
      feedback: '',
      isCorrect: false,
      partialMatch: '',
      showCorrectAnswer: false,
      correctAnswerDisplay: '',
      correctLetters: new Set<string>(),
      usedPunIds: new Set([shuffledPuns[0].id]),
      dailyGamesPlayed: prev.unlimitedMode ? prev.dailyGamesPlayed : prev.dailyGamesPlayed + 1,
    }))
  }, [gameState, puns])

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
    getNextPun()
  }, [getNextPun])

  const handleSkip = useCallback(() => {
    if (!gameState.isCorrect && !gameState.gameOver) getNextPun()
  }, [gameState, getNextPun])

  const getDifficultyText = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return "Easy (1 point)"
      case 2:
        return "Medium (2 points)"
      case 3:
        return "Hard (3 points)"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#A06CD5] to-[#6247AA] p-2">
      <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center border-b border-gray-200 py-3">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lettuce-IBEXinN0VWnKphTGJhalo65OURRqhY.png"
                alt="Punderful™ Logo"
                width={128}
                height={128}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              A pun-filled word game where we ask the questions and you guess the puns!
            </p>
            <CardDescription className="text-lg font-medium text-[#A06CD5]">
              Lettuce play.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-3 p-3">
          {dailyLimitReached ? (
            <div className="text-center space-y-3 p-3">
              <p className="text-xl font-bold text-gray-800">
                Daily Limit Reached!
              </p>
              <p className="text-lg text-gray-600">You've played 5 games today. Come back tomorrow for more puns!</p>
              <div className="rounded-lg border-2 border-[#A06CD5] bg-[#A06CD5]/10 p-2 w-full">
                <p className="text-sm text-center text-gray-800">
                  Don't forget to share your email address to be invited to the full version of the game as soon as it's ready!
                </p>
              </div>
              {!emailSubmitted && (
                <form onSubmit={handleEmailSubmit} className="space-y-2 mt-3">
                  <Input
                    type="email"
                    placeholder="Enter your email for updates"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="w-full text-sm border-2 border-gray-300 focus:border-[#A06CD5] focus:ring-[#A06CD5]"
                    required
                  />
                  <Textarea
                    placeholder="Optional: Share your thoughts or suggestions..."
                    value={comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                    className="w-full text-sm border-2 border-gray-300 focus:border-[#A06CD5] focus:ring-[#A06CD5]"
                  />
                  <Button 
                    type="submit"
                    className="w-full bg-[#A06CD5] text-white hover:bg-[#A06CD5]/90 text-sm py-2"
                  >
                    Get Notified
                  </Button>
                </form>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <div className="px-2 py-1 bg-[#FFD151] text-gray-800 rounded-full">
                  <Trophy className="w-4 h-4 inline-block mr-1" />
                  Score: {gameState.score}
                </div>
                <div className="px-2 py-1 bg-[#FF6B35] text-white rounded-full">
                  <ChevronRight className="w-4 h-4 inline-block mr-1" />
                  Attempts: {gameState.attempts}
                </div>
                <div className="px-2 py-1 bg-[#247BA0] text-white rounded-full">
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
                    className="w-full rounded-lg border-2 border-[#A06CD5] p-3 bg-[#A06CD5]/10"
                  >
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-xl font-medium text-[#A06CD5] text-center"
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
                          className="flex items-center space-x-1 text-sm border-[#247BA0] text-[#247BA0] hover:bg-[#247BA0] hover:text-white"
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
                      </div>
                      <Button
                        onClick={getNextPun}
                        variant="outline"
                        className="mt-1 text-sm border-[#A06CD5] text-[#A06CD5] hover:bg-[#A06CD5] hover:text-white"
                      >
                        Next Pun
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="w-full rounded-lg border-2 border-[#A06CD5] p-3 flex flex-col items-center justify-center bg-white"
                  >
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-800 text-center">{gameState.currentPun.question}</p>
                      <p className="text-xs text-center text-gray-600">
                        Difficulty: {getDifficultyText(gameState.currentPun.difficulty)}
                      </p>
                    </div>
                    <div className="flex justify-center mt-2">
                      <Button
                        onClick={handleSkip}
                        variant="outline"
                        className="text-xs border-[#A06CD5] text-[#A06CD5] hover:bg-[#A06CD5] hover:text-white"
                        disabled={gameState.isCorrect || gameState.gameOver}
                      >
                        Skip this pun
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="w-full space-y-3">
                <div className="flex flex-col w-full space-y-2">
                  <Input
                    type="text"
                    placeholder="Your punderful answer..."
                    value={gameState.userAnswer}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                    className="text-sm border-2 border-gray-300 focus:border-[#A06CD5] focus:ring-[#A06CD5]"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter' && !gameState.gameOver) {
                        handleAnswerSubmit()
                      }
                    }}
                    disabled={gameState.gameOver}
                  />
                  <Button 
                    onClick={handleAnswerSubmit}
                    className="bg-[#A06CD5] text-white hover:bg-[#A06CD5]/90 text-sm w-full"
                    disabled={gameState.gameOver}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                </div>
                {gameState.gameOver && (
                  <div className="text-center space-y-3 p-3">
                    <p className="text-xl font-bold text-gray-800">
                      Game Over!
                    </p>
                    <p className="text-lg text-gray-600">Your final score: {gameState.score}</p>
                    <div className="rounded-lg border-2 border-[#A06CD5] bg-[#A06CD5]/10 p-2 w-full">
                      <p className="text-sm text-center text-gray-800">
                        The correct answer was: <strong>{gameState.currentPun.answer}</strong>
                      </p>
                    </div>
                    <Button 
                      onClick={resetGame}
                      className="bg-[#A06CD5] text-white hover:bg-[#A06CD5]/90 text-sm px-4 py-2"
                    >
                      Play Again
                    </Button>
                  </div>
                )}
                {gameState.partialMatch && (
                  <div className="rounded-lg border-2 border-[#FFD151] bg-[#FFD151]/10 p-2">
                    <p className="text-sm text-gray-800">Partial match: <strong>{gameState.partialMatch}</strong></p>
                  </div>
                )}
                {gameState.correctLetters.size > 0 && (
                  <div className="rounded-lg border-2 border-[#A06CD5] bg-[#A06CD5]/10 p-2">
                    <p className="text-sm text-gray-800">
                      Correct letters: <strong>{Array.from(gameState.correctLetters).join(', ')}</strong>
                    </p>
                  </div>
                )}
                <div className="rounded-lg border-2 border-gray-200 p-2 bg-white">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Guesses:</h3>
                  {gameState.guessedAnswers.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {gameState.guessedAnswers.map((answer, index) => (
                        <li key={index} className="text-sm text-gray-600">{answer}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No guesses yet. Keep trying!</p>
                  )}
                </div>
              </div>
              {gameState.feedback && !gameState.gameOver && (
                <div className="rounded-lg border-2 border-[#A06CD5] bg-[#A06CD5]/10 p-2 w-full">
                  <p className="text-sm text-center text-gray-800">{gameState.feedback}</p>
                </div>
              )}
              <Progress 
                value={(gameState.attempts / 5) * 100} 
                className="w-full h-2 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-[#FFD151] [&>div]:to-[#A06CD5]"
              />
            </>
          )}
        </CardContent>
        <Separator className="my-3" />
        <CardFooter className="flex flex-col space-y-3">
          <div className="w-full space-y-2 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-center text-gray-800">Coming Soon: Punderful™ Full Version</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>AI-powered pun game that adapts to your skill level</li>
              <li>Create and share your own puns for inclusion in the game</li>
              <li>Rate community-created puns</li>
              <li>Leaderboard for puns with the most votes</li>
              <li>Global competition based on consecutive answers & speed</li>
            </ul>
            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="space-y-2 mt-3">
                <Input
                  type="email"
                  placeholder="Enter your email for updates"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full text-sm border-2 border-gray-300 focus:border-[#A06CD5] focus:ring-[#A06CD5]"
                  required
                />
                <Textarea
                  placeholder="Optional: Share your thoughts or suggestions..."
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                  className="w-full text-sm border-2 border-gray-300 focus:border-[#A06CD5] focus:ring-[#A06CD5]"
                />
                <Button 
                  type="submit"
                  className="w-full bg-[#A06CD5] text-white hover:bg-[#A06CD5]/90 text-sm py-2"
                >
                  Get Notified
                </Button>
                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
              </form>
            ) : (
              <p className="text-sm text-center text-green-600 font-medium mt-2">Thank you! We'll keep you updated on the full version release.</p>
            )}
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Confetti active={gameState.isCorrect} config={confettiConfig} />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}