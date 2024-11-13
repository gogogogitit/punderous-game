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
import Confetti from 'react-dom-confetti'

// Define return types for mock functions
type FeedbackResponse = {
  success: boolean;
  message?: string;
}

type VoteResponse = {
  success: boolean;
  message?: string;
  data?: {
    upVotes: number;
    downVotes: number;
  };
}

// Mock functions with proper return types
const submitFeedback = async (email: string, comment: string): Promise<FeedbackResponse> => {
  console.log('Feedback submitted:', { email, comment });
  return { success: true };
};

const votePun = async (question: string, voteType: 'up' | 'down'): Promise<VoteResponse> => {
  console.log('Vote submitted:', { question, voteType });
  return { 
    success: true, 
    data: { upVotes: 1, downVotes: 0 } 
  };
};

const track = (event: string, properties?: any) => {
  console.log('Event tracked:', event, properties);
};

interface Pun {
  id: number;
  question: string;
  answer: string;
  difficulty: number;
  upVotes: number;
  downVotes: number;
}

interface GameState {
  currentPun: Pun | null;
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
  showAnswerCard: boolean;
  showNonEnglishCard: boolean;
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

const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// Basic English word list for fallback
const basicEnglishWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us']);

const LetterHint: React.FC<{ answer: string; revealedLetters: string[] }> = ({ answer, revealedLetters }) => {
  const words = answer.split(' ');
  const isShortAnswer = answer.length <= 12;

  const renderHintLine = (line: string) => (
    <div className="flex justify-center space-x-0.5">
      {line.split('').map((letter, index) => (
        <span key={index} className="text-base font-bold w-5 h-7 flex items-center justify-center">
          {letter === ' ' ? '\u00A0' : (revealedLetters.includes(letter.toLowerCase()) ? letter : '_')}
        </span>
      ))}
    </div>
  );

  if (isShortAnswer) {
    return <div className="mt-1">{renderHintLine(answer)}</div>;
  }

  const firstHalf = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const secondHalf = words.slice(Math.ceil(words.length / 2)).join(' ');

  return (
    <div className="mt-1 space-y-0.5">
      {renderHintLine(firstHalf)}
      {renderHintLine(secondHalf)}
    </div>
  );
};

const PreviousAnswers: React.FC<{ answers: string[] }> = ({ answers }) => {
  if (answers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-lg border border-gray-200 p-2 bg-white/50 mt-2 mb-2 text-center"
    >
      <p className="text-[15.6px] font-medium text-gray-600 mb-1">Previous Answers:</p>
      <div className="space-y-0.5">
        {answers.map((answer, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-[14.4px] text-gray-700"
          >
            {index + 1}. {answer}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
};

const getRandomPun = (puns: Pun[], usedPunIds: Set<number>): Pun | null => {
  const availablePuns = puns.filter(pun => !usedPunIds.has(pun.id));
  if (availablePuns.length === 0) return null;
  return availablePuns[Math.floor(Math.random() * availablePuns.length)];
};

export default function PunderousGame() {
  const [puns, setPuns] = useState<Pun[]>([]);
  const [gameState, setGameState] = useState<GameState>(() => ({
    currentPun: null,
    userAnswer: '',
    guessedAnswers: [],
    attempts: 5,
    score: 0,
    gameOver: false,
    playerSkillLevel: 0,
    feedback: '',
    isCorrect: false,
    showCorrectAnswer: false,
    correctAnswerDisplay: '',
    usedPunIds: new Set(),
    partialMatch: '',
    revealedLetters: [],
    showAnswerCard: false,
    showNonEnglishCard: false,
  }));
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [dictionary, setDictionary] = useState<Set<string>>(new Set());

  const loadDictionaryAndPuns = async () => {
    try {
      // Simulating puns loading for v0 preview
      const punsData = [
        { id: 1, question: "What do you call a fake noodle?", answer: "An impasta", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 2, question: "What do you call a can opener that doesn't work?", answer: "A can't opener", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 3, question: "Why don't scientists trust atoms?", answer: "Because they make up everything", difficulty: 3, upVotes: 0, downVotes: 0 },
      ];
      setPuns(punsData);

      // Initialize dictionary with words from pun answers and basic English words
      const dictionaryWords = new Set(basicEnglishWords);
      punsData.forEach(pun => {
        pun.answer.toLowerCase().split(' ').forEach(word => dictionaryWords.add(word));
      });
      setDictionary(dictionaryWords);

      // Set initial pun
      const initialPun = getRandomPun(punsData, new Set());
      if (initialPun) {
        setGameState(prev => ({
          ...prev,
          currentPun: initialPun,
          usedPunIds: new Set([initialPun.id])
        }));
      }
    } catch (error) {
      console.error('Error loading dictionary and puns:', error);
    }
  };

  useEffect(() => {
    loadDictionaryAndPuns();
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
  }, []);

  const isValidWord = useCallback(async (word: string): Promise<boolean> => {
    const lowercaseWord = word.toLowerCase().trim();
    
    // Check if the word is in the pun answers or our local dictionary
    if (dictionary.has(lowercaseWord)) {
      return true;
    }

    // If not found locally, check the API
    try {
      const response = await fetch(`${API_URL}${lowercaseWord}`);
      if (response.ok) {
        // Word exists in the dictionary
        setDictionary(prev => new Set(prev).add(lowercaseWord));
        return true;
      }
    } catch (error) {
      console.error('Error checking word in API:', error);
    }

    return false;
  }, [dictionary]);

  const handleAnswerSubmit = useCallback(async () => {
    if (gameState.userAnswer.trim() === '' || gameState.gameOver || !gameState.currentPun) return;
    const correctAnswer = gameState.currentPun.answer;
    const userGuess = gameState.userAnswer.trim();

    const words = userGuess.split(' ');
    const allWordsValid = await Promise.all(words.map(isValidWord));

    if (!allWordsValid.every(Boolean)) {
      setGameState(prev => ({
        ...prev,
        showNonEnglishCard: true,
      }));
      return;
    }

    const newRevealedLetters = [...gameState.revealedLetters];
    userGuess.toLowerCase().split('').forEach(letter => {
      if (correctAnswer.toLowerCase().includes(letter) && !newRevealedLetters.includes(letter)) {
        newRevealedLetters.push(letter);
      }
    });

    const allLettersRevealed = correctAnswer.toLowerCase().split('').every(letter => 
      letter === ' ' || newRevealedLetters.includes(letter)
    );

    if (compareAnswers(userGuess, correctAnswer) || allLettersRevealed) {
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
      track('Correct Answer', { difficulty: gameState.currentPun.difficulty });
    } else {
      const newAttempts = gameState.attempts - 1;
      setGameState(prev => ({
        ...prev,
        attempts: newAttempts,
        guessedAnswers: [...prev.guessedAnswers, userGuess],
        feedback: newAttempts === 0 ? `Game over!` : `Not quite! You have ${newAttempts} attempts left.`,
        gameOver: newAttempts === 0,
        userAnswer: '',
        showCorrectAnswer: newAttempts === 0,
        correctAnswerDisplay: newAttempts === 0 ? correctAnswer : '',
        revealedLetters: newRevealedLetters,
        showAnswerCard: newAttempts === 0,
        playerSkillLevel: 0,
      }));
      track('Incorrect Answer', { attemptsLeft: newAttempts });
    }
  }, [gameState, compareAnswers, isValidWord]);

  const getNextPun = useCallback(() => {
    const newPun = getRandomPun(puns, gameState.usedPunIds);
    if (newPun) {
      setGameState(prev => ({
        ...prev,
        currentPun: newPun,
        attempts: 5,
        guessedAnswers: [],
        showCorrectAnswer: false,
        isCorrect: false,
        feedback: '',
        userAnswer: '',
        usedPunIds: new Set([...prev.usedPunIds, newPun.id]),
        revealedLetters: [],
        showAnswerCard: false,
        gameOver: false,
        playerSkillLevel: 0,
        showNonEnglishCard: false,
      }));
      track('Next Pun');
    } else {
      // If all puns have been used, reset the usedPunIds and get a new pun
      const resetPun = getRandomPun(puns, new Set());
      if (resetPun) {
        setGameState(prev => ({
          ...prev,
          currentPun: resetPun,
          attempts: 5,
          guessedAnswers: [],
          showCorrectAnswer: false,
          isCorrect: false,
          feedback: '',
          userAnswer: '',
          usedPunIds: new Set([resetPun.id]),
          revealedLetters: [],
          showAnswerCard: false,
          gameOver: false,
          playerSkillLevel: 0,
          showNonEnglishCard: false,
        }));
        track('New Game Started');
      }
    }
  }, [gameState.usedPunIds, puns]);

  const handleEmailSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    try {
      const result = await submitFeedback(email, comment);

      if (result.success) {
        setEmailSubmitted(true);
        setEmail('');
        setComment('');
        track('Email Submitted');
      } else {
        setSubmitError(result.message || 'An error occurred while submitting your email.');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      setSubmitError('An error occurred while submitting your email. Please try again.');
    }
  }, [email, comment]);

  const handleVote = useCallback(async (pun: Pun, voteType: 'up' | 'down') => {
    try {
      const result = await votePun(pun.question, voteType);

      if (result.success && result.data) {
        setPuns(prevPuns => prevPuns.map(p => 
          p.id === pun.id ? { 
            ...p, 
            upVotes: result.data!.upVotes,
            downVotes: result.data!.downVotes 
          } : p
        ));

        if (gameState.currentPun && gameState.currentPun.id === pun.id) {
          setGameState(prevState => ({
            ...prevState,
            currentPun: {
              ...prevState.currentPun!,
              upVotes: result.data!.upVotes,
              downVotes: result.data!.downVotes
            }
          }));
        }

        getNextPun();
        track('Vote Submitted', { voteType, punQuestion: pun.question });
      } else {
        console.error('Error submitting vote:', result.message);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  }, [gameState.currentPun, getNextPun]);

  const getDifficultyText = (difficulty: number): string => 
    difficulty === 1 ? "Easy (1 pt)" :
    difficulty === 2 ? "Medium (2 pts)" :
    difficulty === 3 ? "Hard (3 pts)" : "Unknown";

  const handleDonation = useCallback((platform: 'paypal' | 'venmo') => {
    const paypalUrl = 'https://www.paypal.com/ncp/payment/RJJZ7Z78PTDUW';
    const venmoUrl = 'https://venmo.com/u/punderousgame';

    window.open(platform === 'paypal' ? paypalUrl : venmoUrl, '_blank', 'noopener,noreferrer');
    track('Donation Link Clicked', { platform });
  }, []);

  if (!gameState.currentPun) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00B4D8] p-1">
      <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center border-b border-gray-200 py-1.5">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-[230px] h-[230px] mb-3">
            <Image
  src="/punderous-logo.png"
  alt="Punderous™ Logo"
  width={220}
  height={220}
  className="object-contain drop-shadow-lg"
  priority
/>
            </div>
            <p className="text-sm text-gray-600 mb-2.5">
              A pun-filled word game where we ask the questions and you guess the puns!
            </p>
            <CardDescription className="text-lg font-medium text-[#00B4D8] flex items-center justify-center">
              <span className="mr-2">⚡</span>
              Let the Brainstorm Begin!
              <span className="ml-2">⚡</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-2.5 p-1.5">
          <div className="flex justify-center gap-1 text-[11px] mb-2">
            <div className="px-1 py-0.5 bg-[#FFD151] text-gray-800 rounded-full flex items-center">
              <Trophy className="w-2 h-2 mr-0.5" />
              <span>Score: {gameState.score}</span>
            </div>
            <div className="px-1 py-0.5 bg-[#FF6B35] text-white rounded-full flex items-center">
              <ChevronRight className="w-2 h-2 mr-0.5" />
              <span>Attempts: {gameState.attempts}</span>
            </div>
            <div className="px-1 py-0.5 bg-[#A06CD5] text-white rounded-full flex items-center">
              <Star className="w-2 h-2 mr-0.5" />
              <span>Level: {gameState.playerSkillLevel}</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {gameState.showNonEnglishCard ? (
              <motion.div
                key="non-english-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="w-full rounded-lg border-2 border-[#A06CD5] p-2 bg-[#A06CD5]/10 text-center"
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-[22.5px] font-medium text-center text-[#A06CD5]"
                >
                  <span className="mr-2">⚠️</span>
                  Nice try!
                  <span className="ml-2">⚠️</span>
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-[16.875px] font-medium text-gray-800 mt-1 text-center"
                >
                  Give it another shot.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex justify-center mt-3"
                >
                  <Button
                    onClick={() => setGameState(prev => ({ ...prev, showNonEnglishCard: false }))}
                    className="bg-[#A06CD5] text-white hover:bg-[#A06CD5]/90 text-[13px] py-1 h-9"
                  >
                    Try Again
                  </Button>
                </motion.div>
              </motion.div>
            ) : (gameState.isCorrect && gameState.showCorrectAnswer) || gameState.showAnswerCard ? (
              <motion.div
                key="correct-answer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className={`w-full rounded-lg border-2 p-2 ${gameState.isCorrect ? 'border-[#FFD151] bg-[#FFD151]/10' : 'border-[#FF6B35] bg-[#FF6B35]/10'}`}
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className={`text-[22.5px] font-medium text-center ${gameState.isCorrect ? 'text-[#FFD151]' : 'text-[#FF6B35]'}`}
                >
                  {gameState.isCorrect ? (
                    <span>
                      <span className="mr-2">⚡</span>
                      Correct!
                      <span className="ml-2">⚡</span>
                    </span>
                  ) : (
                    <span>
                      <span className="mr-2">☁️</span>
                      Game Over!
                      <span className="ml-2">☁️</span>
                    </span>
                  )}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-[16.875px] font-medium text-gray-800 mt-1 text-center"
                >
                  {gameState.isCorrect ? '' : 'The answer is: '}{gameState.correctAnswerDisplay}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col items-center space-y-2 mt-3"
                >
                  <p className="text-[12.5px] text-gray-700 font-medium">Was this a good pun or a bad pun?</p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => handleVote(gameState.currentPun!, 'up')}
                      variant="outline"
                      size="sm"
                      className="h-9 w-[72px] text-[13.75px] border-[#A06CD5] text-[#A06CD5] hover:bg-[#A06CD5] hover:text-white"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1.5" />
                      Good
                    </Button>
                    <Button
                      onClick={() => handleVote(gameState.currentPun!, 'down')}
                      variant="outline"
                      size="sm"
                      className="h-9 w-[72px] text-[13.75px] border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                    >
                      <ThumbsDown className="w-4 h-4 mr-1.5" />
                      Bad
                    </Button>
                    <Button
                      onClick={getNextPun}
                      variant="outline"
                      size="sm"
                      className="h-9 w-[72px] text-[13.75px] border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white"
                    >
                      <ArrowRight className="w-4 h-4 mr-1.5" />
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
                className="w-full rounded-lg border-2 border-[#00B4D8] p-2 bg-[#00B4D8]/10 text-center"
              >
                <p className="text-base font-medium text-gray-800 mb-1">
                  {gameState.currentPun.question}
                </p>
                <p className="text-[11px] text-gray-600">
                  {getDifficultyText(gameState.currentPun.difficulty)}
                </p>
                {gameState.feedback && (
                  <p className="text-[12.5px] text-center text-gray-700 mt-1">
                    {gameState.feedback}
                  </p>
                )}
                <LetterHint answer={gameState.currentPun.answer} revealedLetters={gameState.revealedLetters} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <PreviousAnswers answers={gameState.guessedAnswers} />
          
          <div className="w-full">
  <Input
    type="text"
    placeholder="Enter your answer"
    value={gameState.userAnswer}
    onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAnswerSubmit();
      }
    }}
    className="w-full text-[13.2px] border border-gray-300 focus:border-[#00B4D8] focus:ring-[#00B4D8] h-10"
    disabled={gameState.gameOver || gameState.isCorrect || gameState.showNonEnglishCard}
  />
</div>
<div className="flex flex-col w-full space-y-2.5">
  <div className="flex justify-between w-full space-x-2">
    <Button
      onClick={handleAnswerSubmit}
      className="flex-1 bg-[#00B4D8] text-white hover:bg-[#00B4D8]/90 text-[13px] py-1 h-9"
      disabled={gameState.gameOver || gameState.isCorrect || gameState.showNonEnglishCard}
    >
      <Send className="w-3 h-3 mr-1" />
      Submit
    </Button>
    <Button
      onClick={getNextPun}
      className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 text-[13px] py-1 h-9"
      disabled={gameState.isCorrect || gameState.gameOver || gameState.showNonEnglishCard}
    >
      Skip
    </Button>
  </div>
            <Button
              onClick={() => {
                const shareUrl = "https://punderous.com"; 
                const shareText = `I'm playing Punderous™! Can you guess this pun? "${gameState.currentPun!.question}"`;
                
                if (navigator.share) {
                  navigator.share({
                    title: 'Punderous™',
                    text: shareText,
                    url: shareUrl,
                  }).then(() => {
                    console.log('Successfully shared');
                  }).catch((error) => {
                    console.error('Error sharing:', error);
                  });
                } else {
                  const fallbackShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                  window.open(fallbackShareUrl, '_blank');
                }
                track('Share Button Clicked');
              }}
              className="w-full bg-[#0070BA] text-white hover:bg-[#003087] text-[13px] py-1 h-9 mt-0.5"
              aria-label="Share Punderous game"
            >
              <Share2 className="w-3 h-3 mr-1" />
              Share Punderous™
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3 border-t border-gray-200 p-2">
          <div className="text-center space-y-1">
            <h3 className="text-[1.08rem] font-semibold text-gray-800">Coming Soon: Punderous™ Plus</h3>
            <ul className="text-[14px] text-gray-600 space-y-0.5">
              <li>• AI-powered pun game that adapts to your skill</li>
              <li>• Create and share your own puns in the game</li>
              <li>• Compete with friends and climb the leaderboard</li>
              <li>• Unlock achievements and earn badges</li>
              <li>• Earn points for speed and consecutive answers</li>
            </ul>
          </div>
          <div className="w-full space-y-1 mt-2">
            {!emailSubmitted && (
              <form onSubmit={handleEmailSubmit} className="w-full space-y-1">
                <Input
                  type="email"
                  placeholder="Enter your email for updates"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs border border-gray-300 focus:border-[#00B4D8] focus:ring-[#00B4D8] h-8"
                  required
                />
                <Textarea
                  placeholder="Optional: Share your thoughts or suggestions..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs border border-gray-300 focus:border-[#00B4D8] focus:ring-[#00B4D8] h-16"
                />
                <Button 
                  type="submit"
                  className="w-full bg-[#00B4D8] text-white hover:bg-[#00B4D8]/90 text-[13px] py-1 h-9 mt-2"
                >
                  Get Notified
                </Button>
              </form>
            )}
            {emailSubmitted && (
              <p className="text-xs text-green-600 font-medium">
                Thank you for your interest! We'll keep you updated on the full version release.
              </p>
            )}
            {submitError && (
              <p className="text-xs text-red-600 font-medium">
                {submitError}
              </p>
            )}
          </div>
          <div className="w-full space-y-1 mt-2">
            <h3 className="text-[1.08rem] font-semibold text-gray-800 text-center">Support Punderous™ Development</h3>
            <p className="text-[14px] text-gray-600 text-center mb-1">Your contribution helps bring the full version to life! Choose your preferred payment method:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 mt-2">
              <Button
                onClick={() => handleDonation('paypal')}
                className="bg-[#0070BA] text-white hover:bg-[#003087] text-[15px] py-1 h-10 flex-1"
              >
                <CircleDollarSign className="w-4 h-4 mr-1" />
                Support with PayPal
              </Button>
              <Button
                onClick={() => handleDonation('venmo')}
                className="bg-[#008CFF] text-white hover:bg-[#0070BA] text-[15px] py-1 h-10 flex-1"
              >
                <CircleDollarSign className="w-4 h-4 mr-1" />
                Support with Venmo
              </Button>
            </div>
            <p className="text-[12px] text-gray-500 text-center mt-1">
              All donations directly support game development.
            </p>
          </div>
          <div className="text-[8px] text-gray-500 mt-2">
            © 2024 MJKUltra. All rights reserved.
            <Link href="/privacy-policy" className="ml-1 text-[#00B4D8] hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardFooter>
      </Card>
      <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <Confetti active={gameState.isCorrect} config={confettiConfig} />
      </div>
    </div>
  );
}