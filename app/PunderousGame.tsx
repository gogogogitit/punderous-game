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
import { trackEvent } from '@/lib/analytics'

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
  // ... (include all other puns here)
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

const getRandomPun = (puns: Pun[]): Pun => {
  return puns[Math.floor(Math.random() * puns.length)];
};

export default function PunderousGame() {
  const [gameState, setGameState] = useState<GameState>(() => ({
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
  }));
  const [puns, setPuns] = useState<Pun[]>(initialPuns)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [comment, setComment] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const randomPun = getRandomPun(initialPuns);
    setGameState(prev => ({
      ...prev,
      currentPun: randomPun,
      usedPunIds: new Set([randomPun.question.length])
    }));
  }, []);

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
      trackEvent('correct_answer', {
        difficulty: gameState.currentPun.difficulty.toString(),
        score: (gameState.score + pointsEarned).toString()
      });
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
      trackEvent('incorrect_answer', {
        attempts_remaining: (gameState.attempts - 1).toString()
      });
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
      const newPun = getRandomPun(shuffledPuns)
      setGameState(prev => ({
        ...prev,
        currentPun: newPun,
        attempts: 5,
        guessedAnswers: [],
        showCorrectAnswer: false,
        isCorrect: false,
        feedback: '',
        userAnswer: '',
        usedPunIds: new Set([newPun.question.length]),
        revealedLetters: [],
      }))
    } else {
      const randomPun = getRandomPun(unusedPuns)
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
    trackEvent('new_pun');
  }, [gameState.usedPunIds, puns])

  const handleEmailSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')

    try {
      const result = await submitFeedback(email, comment)

      if (result.success) {
        trackEvent('email_submitted');
        setEmailSubmitted(true)
        setEmail('')
        setComment('')
      } else {
        trackEvent('email_error');
        setSubmitError(result.error || 'An error occurred while submitting your email.')
      }
    } catch (error) {
      trackEvent('email_error');
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

        trackEvent('pun_vote', { vote_type: voteType });

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
    trackEvent('donation_click', { platform });
    const paypalUrl = 'https://www.paypal.com/ncp/payment/RJJZ7Z78PTDUW'
    const venmoUrl = 'https://venmo.com/u/punderousgame'

    window.open(platform === 'paypal' ? paypalUrl : venmoUrl, '_blank', 'noopener,noreferrer')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00B4D8] p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white">
        <CardHeader className="text-center border-b border-gray-200 pb-4">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 mb-4">
              <Image
                src="/punderous-logo.png"
                alt="Punderous™ Logo"
                layout="fill"
                objectFit="contain"
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
        <CardContent className="space-y-4 p-4">
          <div className="flex justify-center gap-2 text-sm">
            <div className="px-2 py-1 bg-[#FFD151] text-gray-800 rounded-full flex items-center">
              <Trophy className="w-4 h-4 mr-1" />
              Score: {gameState.score}
            </div>
            <div className="px-2 py-1 bg-[#FF6B35] text-white rounded-full flex items-center">
              <ChevronRight className="w-4 h-4 mr-1" />
              Attempts: {gameState.attempts}
            </div>
            <div className="px-2 py-1 bg-[#A06CD5] text-white rounded-full flex items-center">
              <Star className="w-4 h-4 mr-1" />
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
                className="rounded-lg border-2 border-[#00B4D8] p-4 bg-[#00B4D8]/10"
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
                  className="text-lg font-medium text-gray-800 mt-2 text-center"
                >
                  {gameState.correctAnswerDisplay}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col items-center space-y-2 mt-4"
                >
                  <p className="text-sm text-gray-700 font-medium">Was this a good pun or a bad pun?</p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => handleVote(gameState.currentPun, 'up')}
                      variant="outline"
                      size="sm"
                      className="border-[#00B4D8] text-[#00B4D8]"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleVote(gameState.currentPun, 'down')}
                      variant="outline"
                      size="sm"
                      className="border-[#FF6B35] text-[#FF6B35]"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={getNextPun}
                      variant="outline"
                      size="sm"
                      className="border-[#A06CD5] text-[#A06CD5]"
                    >
                      <ArrowRight className="w-4 h-4 mr-1" />
                      Next
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
                className="rounded-lg border-2 border-[#00B4D8] p-4 bg-[#00B4D8]/10 text-center"
              >
                <p className="text-lg font-medium text-gray-800 mb-2">
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
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your answer"
              value={gameState.userAnswer}
              onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAnswerSubmit()
                }
              }}
              className="w-full"
              disabled={gameState.gameOver || gameState.isCorrect}
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleAnswerSubmit}
                className="flex-1 bg-[#00B4D8] text-white hover:bg-[#00B4D8]/90"
                disabled={gameState.gameOver || gameState.isCorrect}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
              <Button
                onClick={getNextPun}
                variant="secondary"
                className="flex-1"
                disabled={gameState.isCorrect || gameState.gameOver}
              >
                Skip
              </Button>
            </div>
            <Button
              onClick={() => {
                const shareUrl = "https://punderous.com"; 
                const shareText = `I'm playing Punderous™! Can you guess this pun? "${gameState.currentPun.question}"`;
                
                if (navigator.share) {
                  navigator.share({
                    title: 'Punderous™',
                    text: shareText,
                    url: shareUrl,
                  }).then(() => {
                    console.log('Successfully shared');
                    trackEvent('share_success');
                  }).catch((error) => {
                    console.error('Error sharing:', error);
                    trackEvent('share_error');
                  });
                } else {
                  const fallbackShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                  window.open(fallbackShareUrl, '_blank');
                  trackEvent('share_fallback');
                }
              }}
              className="w-full bg-[#0070BA] text-white hover:bg-[#003087]"
              aria-label="Share Punderous game"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Punderous™
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 border-t border-gray-200 p-4">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">Coming Soon: Punderous™ Plus</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AI-powered pun game that adapts to your skill</li>
              <li>• Create and share your own puns in the game</li>
              <li>• Compete with friends and climb the leaderboard</li>
              <li>• Unlock achievements and earn badges</li>
              <li>• Earn points for speed and consecutive answers</li>
            </ul>
          </div>
          <div className="w-full space-y-2">
            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email for updates"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Optional: Share your thoughts or suggestions..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="w-full bg-[#00B4D8] text-white hover:bg-[#00B4D8]/90"
                >
                  Get Notified
                </Button>
              </form>
            ) : (
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
          <div className="w-full space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 text-center">Support Punderous™ Development</h3>
            <p className="text-sm text-gray-600 text-center mb-2">Your contribution helps bring the full version to life! Choose your preferred payment method:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <Button
                onClick={() => handleDonation('paypal')}
                className="bg-[#0070BA] text-white hover:bg-[#003087] flex-1"
              >
                <CircleDollarSign className="w-4 h-4 mr-2" />
                Support with PayPal
              </Button>
              <Button
                onClick={() => handleDonation('venmo')}
                className="bg-[#008CFF] text-white hover:bg-[#0070BA] flex-1"
              >
                <CircleDollarSign className="w-4 h-4 mr-2" />
                Support with Venmo
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              All donations directly support game development.
            </p>
          </div>
          <div className="text-xs text-gray-500 mt-2">
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