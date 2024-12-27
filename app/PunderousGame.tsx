'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Star, Trophy, Send, ThumbsUp, ThumbsDown, CircleDollarSign, Share2 } from 'lucide-react'
import Confetti from 'react-dom-confetti'
import { useDictionary } from '@/hooks/useDictionary'
import { GoogleAnalytics } from '@next/third-parties/google'
import { trackEvent as analyticsTrackEvent } from '../lib/analytics'
import RulesDialog from "@/components/RulesDialog";
import LetterHint from '@/components/game/LetterHint';
import PreviousAnswers from '@/components/game/PreviousAnswers';

const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  analyticsTrackEvent(eventName, eventParams);
};

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

const submitFeedback = async (email: string, comment: string): Promise<FeedbackResponse> => {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, comment }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, message: 'An error occurred while submitting feedback.' };
  }
};

const votePun = async (punId: number, voteType: 'up' | 'down'): Promise<VoteResponse> => {
  try {
    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ punId, voteType }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data: { upVotes: data.upVotes, downVotes: data.downVotes } };
  } catch (error) {
    console.error('Error submitting vote:', error);
    return { success: false, message: 'An error occurred while submitting vote.' };
  }
};

const submitEmail = async (email: string, comment: string): Promise<FeedbackResponse> => {
  try {
    const response = await fetch('/api/submit-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, comment }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting email:', error);
    return { success: false, message: 'An error occurred while submitting email.' };
  }
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
  playerLevel: number;
  feedback: string;
  isCorrect: boolean;
  showCorrectAnswer: boolean;
  correctAnswerDisplay: string;
  usedPunIds: Set<number>;
  partialMatch: string;
  revealedLetters: string[];
  showAnswerCard: boolean;
  showNonEnglishCard: boolean;
  lastPlayedDate: string | null;
  currentPunIndex: number;
  showVoteCard: boolean;
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

export default function Component() {
  console.log('PunderousGame: Component mounted')
  const [puns, setPuns] = useState<Pun[]>([])
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      currentPun: null,
      userAnswer: '',
      guessedAnswers: [],
      attempts: 5,
      score: 0,
      gameOver: false,
      playerLevel: 0,
      feedback: '',
      isCorrect: false,
      showCorrectAnswer: false,
      correctAnswerDisplay: '',
      usedPunIds: new Set(),
      partialMatch: '',
      revealedLetters: [],
      showAnswerCard: false,
      showNonEnglishCard: false,
      lastPlayedDate: null,
      currentPunIndex: 0,
      showVoteCard: false,
    }
  })
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState('');
  const dictionary = useDictionary();
  const [cheatModeActive, setCheatModeActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true
    let controller = new AbortController()

    const loadPuns = async () => {
      try {
        const response = await fetch('/api/puns', {
          signal: controller.signal,
          cache: 'force-cache'
        })
        if (!response.ok) throw new Error('Failed to fetch puns')
        const data = await response.json()
        if (data.success && Array.isArray(data.puns) && isMounted) {
          setPuns(data.puns)
          if (data.puns.length > 0) {
            // Calculate today's pun index
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const startDate = new Date('2024-01-01');
            const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const punOfTheDayIndex = daysSinceStart % data.puns.length;
            
            console.log('Today:', today);
            console.log('Days since start:', daysSinceStart);
            console.log('Pun of the day index:', punOfTheDayIndex);
            
            setGameState(prev => ({
              ...prev,
              currentPun: data.puns[punOfTheDayIndex],
              currentPunIndex: punOfTheDayIndex,
              lastPlayedDate: today.toDateString()
            }))
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error loading puns:', error)
        }
      }
    }

    loadPuns()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGameState(prevState => ({
        ...prevState,
        score: parseInt(localStorage.getItem('score') || '0'),
        playerLevel: parseInt(localStorage.getItem('playerLevel') || '0'),
        lastPlayedDate: localStorage.getItem('lastPlayedDate'),
        currentPunIndex: parseInt(localStorage.getItem('currentPunIndex') || '0'),
      }));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('score', gameState.score.toString());
      localStorage.setItem('playerLevel', gameState.playerLevel.toString());
    }
  }, [gameState.score, gameState.playerLevel]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (gameState.gameOver || gameState.isCorrect || gameState.showAnswerCard) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('refreshRedirect', 'true');
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameState.gameOver, gameState.isCorrect, gameState.showAnswerCard]);

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
     const cleanWord = word.toLowerCase().trim().replace(/[.,!?]/g, '');
     
     const wordInPuns = puns.some(pun => 
       pun.question.toLowerCase().includes(cleanWord) || 
       pun.answer.toLowerCase().includes(cleanWord)
     );
     if (wordInPuns) {
       return true;
     }
     
     try {
       const response = await fetch(`${API_URL}${cleanWord}`);
       if (response.ok) {
         return true;
       }
     } catch (error) {
       console.error('Error checking word in API:', error);
     }

     return false;
   }, [puns]);

  const resetScoreAndLevel = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      playerLevel: 0
    }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('score', '0');
      localStorage.setItem('playerLevel', '0');
    }
  }, []);

  const handleAnswerSubmit = useCallback(async () => {
    if (gameState.userAnswer.trim() === '#playforever#') {
      setCheatModeActive(true);
      setGameState(prev => ({
        ...prev,
        feedback: "Cheat mode activated! You can now play all puns without daily limits.",
        userAnswer: '',
      }));
      trackEvent('cheat_mode_activated', {
        event_category: 'Game',
        event_label: 'Cheat Mode Activated',
      });
      return;
    }

    if (gameState.userAnswer.trim() === '' || gameState.gameOver || !gameState.currentPun) return;
    const correctAnswer = gameState.currentPun.answer;
    const userGuess = gameState.userAnswer.trim();

    const answerWordCount = correctAnswer.split(/\s+/).length;
    const userGuessWordCount = userGuess.split(/\s+/).length;

    if (userGuessWordCount > answerWordCount) {
      setGameState(prev => ({
        ...prev,
        showNonEnglishCard: true,
        feedback: "Nice try!",
      }));
      return;
    }

    const words = userGuess.split(/\s+/);
    const wordValidityPromises = words.map(async word => {
      const isValid = await isValidWord(word);
      return isValid;
    });
    const allWordsValid = (await Promise.all(wordValidityPromises)).every(Boolean);

    if (!allWordsValid) {
      setGameState(prev => ({
        ...prev,
        showNonEnglishCard: true,
      }));
      trackEvent('invalid_word_submitted', {
        event_category: 'Game',
        event_label: 'Invalid Word',
        value: userGuess,
      });
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
        playerLevel: prev.playerLevel + 1,
        isCorrect: true,
        showCorrectAnswer: true,
        correctAnswerDisplay: correctAnswer,
        userAnswer: '',
        feedback: `Correct! You earned ${pointsEarned} point${pointsEarned > 1 ? 's' : ''}. Your level is now ${prev.playerLevel + 1}.`,
        guessedAnswers: [...prev.guessedAnswers, userGuess],
        revealedLetters: newRevealedLetters,
        gameOver: true,
      }));
      trackEvent('correct_answer', {
        event_category: 'Game',
        event_label: 'Correct Answer',
        value: gameState.currentPun.difficulty,
      });
    } else {
      const newAttempts = gameState.attempts - 1;
      if (newAttempts === 0) {
        resetScoreAndLevel();
        setGameState(prev => ({
          ...prev,
          attempts: newAttempts,
          guessedAnswers: [...prev.guessedAnswers, userGuess],
          feedback: 'Game over! Your score and level have been reset to 0.',
          gameOver: true,
          userAnswer: '',
          showCorrectAnswer: true,
          correctAnswerDisplay: correctAnswer,
          revealedLetters: newRevealedLetters,
          showAnswerCard: true,
        }));
        trackEvent('game_over', {
          event_category: 'Game',
          event_label: 'Game Over',
          value: gameState.score,
        });
      } else {
        setGameState(prev => ({
          ...prev,
          attempts: newAttempts,
          guessedAnswers: [...prev.guessedAnswers, userGuess],
          feedback: `Not quite! You have ${newAttempts} attempts left.`,
          userAnswer: '',
          revealedLetters: newRevealedLetters,
        }));
        trackEvent('incorrect_answer', {
          event_category: 'Game',
          event_label: 'Incorrect Answer',
          value: newAttempts,
        });
      }
    }
  }, [gameState, compareAnswers, isValidWord, resetScoreAndLevel]);

  const getNextPun = useCallback(() => {
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();
      if (cheatModeActive || gameState.lastPlayedDate !== today) {
        const newPunIndex = (gameState.currentPunIndex + 1) % puns.length;
        const newPun = puns[newPunIndex];
        if (newPun) {
          setGameState(prev => ({
            ...prev,
            currentPun: newPun,
            currentPunIndex: newPunIndex,
            attempts: 5,
            guessedAnswers: [],
            showCorrectAnswer: false,
            isCorrect: false,
            feedback: '',
            userAnswer: '',
            usedPunIds: new Set([newPun.id]),
            revealedLetters: [],
            showAnswerCard: false,
            gameOver: false,
            showNonEnglishCard: false,
            lastPlayedDate: cheatModeActive ? prev.lastPlayedDate : today,
            showVoteCard: false, 
          }));
          if (!cheatModeActive) {
            localStorage.setItem('lastPlayedDate', today);
            localStorage.setItem('currentPunIndex', newPunIndex.toString());
          }
        }
      } else {
        setGameState(prev => ({
          ...prev,
          gameOver: true,
          feedback: "You've played today's pun. Come back tomorrow for a new one!",
          showAnswerCard: true,
          showVoteCard: false, 
        }));
      }
    }
    trackEvent('next_pun', {
      event_category: 'Game',
      event_label: 'Next Pun',
      value: gameState.playerLevel,
    });
  }, [puns, gameState.playerLevel, gameState.currentPunIndex, gameState.lastPlayedDate, cheatModeActive]);

  const handleSkip = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameOver: true,
      feedback: "You've skipped today's pun. Come back tomorrow for a new one!",
      showAnswerCard: true,
      showVoteCard: false,
    }));
    trackEvent('skipped_pun', {
      event_category: 'Game',
      event_label: 'Skipped Pun',
      value: gameState.playerLevel,
    });
  }, [gameState.playerLevel]);

  const handleEmailSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, comment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setEmailSubmitted(true);
        setEmail('');
        setComment('');
        trackEvent('email_submitted', {
          event_category: 'User',
          event_label: 'Email Submitted',
        });
      } else {
        setSubmitError(result.message || 'An error occurred while submitting your email.');
        trackEvent('email_submission_failed', {
          event_category: 'User',
          event_label: 'Email Submission Failed',
          value: result.message,
        });
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      setSubmitError('An error occurred while submitting your email. Please try again.');
      trackEvent('email_submission_error', {
        event_category: 'User',
        event_label: 'Email Submission Error',
        value: 'Network error',
      });
    }
  }, [email, comment]);

  const handleVote = useCallback(async (pun: Pun, voteType: 'up' | 'down') => {
    console.log('handleVote called with:', { punId: pun.id, voteType });
    setGameState(prevState => ({
      ...prevState,
      showVoteCard: true,
    }));
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ punId: pun.id, voteType }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setPuns(prevPuns => prevPuns.map(p => 
           p.id === pun.id ? { 
             ...p, 
             upVotes: result.upVotes,
             downVotes: result.downVotes 
           } : p
         ));
         trackEvent('vote_submitted', {
           event_category: 'Game',
           event_label: 'Vote Submitted',
           value: voteType === 'up' ? 1 : 0,
         });
       } else {
         console.error('Error submitting vote:', result.message);
       }
     } catch (error) {
       console.error('Error in handleVote:', error);
     }
   }, []);

  const getDifficultyText = (difficulty: number): string => 
    difficulty === 1 ? "Easy (1 pt)" :
    difficulty === 2 ? "Medium (2 pts)" :
    difficulty === 3 ? "Hard (3 pts)" : "Unknown";

  const handleDonation = useCallback((platform: 'paypal' | 'venmo') => {
    const paypalUrl = 'https://www.paypal.com/ncp/payment/RJJZ7Z78PTDUW';
    const venmoUrl = 'https://venmo.com/u/punderousgame';

    window.open(platform === 'paypal' ? paypalUrl : venmoUrl, '_blank', 'noopener,noreferrer');
    trackEvent('donation_link_clicked', {
      event_category: 'User',
      event_label: 'Donation Link Clicked',
      value: platform === 'paypal' ? 1 : 0,
    });
  }, []);

  const handleTryAgain = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      showNonEnglishCard: false,
      userAnswer: ''
    }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && gameState.showNonEnglishCard) {
        handleTryAgain();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.showNonEnglishCard, handleTryAgain]);

  if (!gameState.currentPun) return null

  console.log('Current game state:', gameState);

  return (
    <>
      <GoogleAnalytics gaId="G-74PSL8QNEV" />
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
              <p className="text-sm text-gray-600 mb-5">
                The pun-a-day word game.
              </p>
              <CardDescription className="text-xl font-medium text-[#00B4D8] flex items-center justify-center">
                <span className="mr-2 text-2xl" role="img" aria-label="lightning">&#x26A1;</span>
                Let the Brainstorm Begin!
                <span className="ml-2 text-2xl" role="img" aria-label="lightning">&#x26A1;</span>
              </CardDescription>
              {cheatModeActive && (
                 <p className="text-xs text-[#FF6B35] font-semibold mt-1">
                   Cheat Mode Active
                 </p>
               )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-2.5 p-1.5">
          <div className="flex justify-center gap-1.5 text-[13px] mb-2">
            <div className="px-1.5 py-0.75 bg-[#FFD151] text-gray-800 rounded-full flex items-center">
              <Trophy className="w-3 h-3 mr-0.75" />
              <span>Score: {gameState.score}</span>
            </div>
            <div className="px-1.5 py-0.75 bg-[#FF6B35] text-white rounded-full flex items-center">
              <ChevronRight className="w-3 h-3 mr-0.75" />
              <span>Attempts: {gameState.attempts}</span>
            </div>
            <div className="px-1.5 py-0.75 bg-[#A06CD5] text-white rounded-full flex items-center">
              <Star className="w-3 h-3 mr-0.75" />
              <span>Level: {gameState.playerLevel}</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
  {gameState.showVoteCard ? (
    <motion.div
      key="vote-card"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-lg border-2 border-[#00B4D8] p-2 bg-[#00B4D8]/10 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-[22.5px] font-medium text-center text-[#00B4D8]"
      >
        🙏 Thanks for playing! 🙏
        <br />
        Pun back tomorrow for a new Punderous™ challenge! 😃
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-4"
      >
        <Button
          onClick={() => {
            const shareUrl = "https://punderous.com"; 
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const startDate = new Date('2024-01-01');
            const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const punOfTheDayIndex = daysSinceStart % puns.length;
            const punOfTheDay = puns[punOfTheDayIndex];
            const shareText = `I just played Punderous™! Can you guess today's pun?`;
            
            if (navigator.share) {
              navigator.share({
                title: 'Punderous™',
                text: shareText,
                url: shareUrl,
              }).then(() => {
                console.log('Successfully shared');
                trackEvent('game_shared', {
                  event_category: 'Game',
                  event_label: 'Game Shared',
                  value: 1,
                });
              }).catch((error) => {
                console.error('Error sharing:', error);
                trackEvent('share_error', {
                  event_category: 'Game',
                  event_label: 'Share Error',
                  value: 0,
                });
              });
            } else {
              const fallbackShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
              window.open(fallbackShareUrl, '_blank');
              trackEvent('game_shared', {
                event_category: 'Game',
                event_label: 'Game Shared (Twitter Fallback)',
                value: 1,
              });
            }
          }}
          className="w-full bg-[#0070BA] text-white hover:bg-[#003087] text-[13px] py-1 h-9"
          aria-label="Share Punderous game"
        >
          <Share2 className="w-3 h-3 mr-1" />
          Share Punderous™ with a friend!
        </Button>
      </motion.div>
    </motion.div>
  ) : gameState.showNonEnglishCard ? (
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
          onClick={handleTryAgain}
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
        <p className="text-[12.5px] text-gray-700 font-medium">Was this punny or not punny?</p>
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => handleVote(gameState.currentPun!, 'up')}
            variant="outline"
            size="sm"
            className="h-9 w-[110px] text-[13.75px] border-[#A06CD5] text-[#A06CD5] hover:bg-[#A06CD5] hover:text-white"
          >
            <ThumbsUp className="w-4 h-4 mr-1.5" />
            Punny
          </Button>
          <Button
            onClick={() => handleVote(gameState.currentPun!, 'down')}
            variant="outline"
            size="sm"
            className="h-9 w-[110px] text-[13.75px] border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
          >
            <ThumbsDown className="w-4 h-4 mr-1.5" />
            Not punny
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
    <RulesDialog />
  </div>
  <Button
    onClick={() => {
      const shareUrl = "https://punderous.com"; 
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date('2024-01-01');
      const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const punOfTheDayIndex = daysSinceStart % puns.length;
      const punOfTheDay = puns[punOfTheDayIndex];
      const shareText = `I'm playing Punderous™! Can you guess today's pun?`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Punderous™',
          text: shareText,
          url: shareUrl,
        }).then(() => {
          console.log('Successfully shared');
          trackEvent('game_shared', {
            event_category: 'Game',
            event_label: 'Game Shared',
            value: 1,
          });
        }).catch((error) => {
          console.error('Error sharing:', error);
          trackEvent('share_error', {
            event_category: 'Game',
            event_label: 'Share Error',
            value: 0,
          });
        });
      } else {
        const fallbackShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(fallbackShareUrl, '_blank');
        trackEvent('game_shared', {
          event_category: 'Game',
          event_label: 'Game Shared (Twitter Fallback)',
          value: 1,
        });
      }
    }}
    className="w-full bg-[#0070BA] text-white hover:bg-[#003087] text-[13px] py-1 h-9 mt-0.5"
    aria-label="Share Punderous game"
  >
    <Share2 className="w-3 h-3 mr-1" />
    Share Punderous™ with a friend!
  </Button>
</div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-3 border-t border-gray-200 p-2">
            <div className="text-center space-y-1">
              <h3 className="text-[1.08rem] font-semibold text-gray-800">Coming Soon: Punderous™ Plus</h3>
              <ul className="text-[14px] text-gray-600 space-y-0.5">
                <li>• Hints!</li>
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
                    Submit Email - Comment Optional
                  </Button>
                </form>
              )}
              {emailSubmitted && (
                <p className="text-xs text-green-600 font-medium">
                  Thank you for your interest! We'll keep you updated on Punderous™ Plus!
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
              <p className="text-[14px] text-gray-600 text-center mb-1">Your puntribution helps bring the full game to life! Donate below:</p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 mt-2">
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
              © 2024 Punderous™. All rights reserved.
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
    </>
  );
}