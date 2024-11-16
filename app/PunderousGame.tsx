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
import { useDictionary } from '@/hooks/useDictionary'
import { GoogleAnalytics } from '@next/third-parties/google'
import { trackEvent as analyticsTrackEvent } from '../lib/analytics';

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

export default function Component() {
  const [puns, setPuns] = useState<Pun[]>([]);
  const [gameState, setGameState] = useState<GameState>(() => ({
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
  }));
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState('');
  const dictionary = useDictionary();
  const [cheatModeActive, setCheatModeActive] = useState(false);

  useEffect(() => {
    // Initialize state from localStorage on the client side
    setGameState(prevState => ({
      ...prevState,
      score: parseInt(localStorage.getItem('score') || '0'),
      playerLevel: parseInt(localStorage.getItem('playerLevel') || '0'),
      lastPlayedDate: localStorage.getItem('lastPlayedDate'),
      currentPunIndex: parseInt(localStorage.getItem('currentPunIndex') || '0'),
    }));
  }, []);

  const loadDictionaryAndPuns = useCallback(async () => {
    try {
      const punsData = [
        { id: 1, question: "What do you call a rabbit with a positive future outlook?", answer: "A hoptimist", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 2, question: "What do you call a fake noodle?", answer: "An impasta", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 3, question: "What do you call a can opener that doesn't work?", answer: "A cannot opener", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 4, question: "Why don't scientists trust atoms?", answer: "They make up everything", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 5, question: "What do you call a bear with no teeth?", answer: "A gummy bear", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 6, question: "Why did the scarecrow win an award?", answer: "They were outstanding in their field", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 7, question: "What do you call a pig that does karate?", answer: "A pork chop", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 8, question: "Why don't eggs tell jokes?", answer: "They would crack up", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 9, question: "What do you call a sleeping bull?", answer: "A bulldozer", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 10, question: "Why did the math book look so sad?", answer: "It had too many problems", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 11, question: "Why did the golfer bring two pairs of pants?", answer: "In case they got a hole in one", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 12, question: "What do you call a parade of rabbits hopping backwards?", answer: "A receding hare line", difficulty: 3, upVotes: 0, downVotes: 0 },
        { id: 13, question: "Why don't skeletons fight each other?", answer: "They have no guts", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 14, question: "What do you call a fake stone in Ireland?", answer: "A sham rock", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 15, question: "How do you organize a space party?", answer: "You planet", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 16, question: "Why don't scientists trust atoms?", answer: "They make up everything", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 17, question: "What do you call a fish wearing a bowtie?", answer: "Sofishticated", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 18, question: "What do you call a dinosaur that crashes their car?", answer: "Tyrannosaurus wrecks", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 19, question: "Why don't oysters donate to charity?", answer: "They are shellfish", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 20, question: "Why did the gym get smaller and close down?", answer: "It didn not work out", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 21, question: "Why did the cookie go to the doctor?", answer: "Because it felt crumby", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 22, question: "What do you call a snowman with a six-pack?", answer: "An abdominal snowman", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 23, question: "What did the grape do when it got stepped on?", answer: "Let out a little wine", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 24, question: "Why did the banker switch careers?", answer: "They lost interest", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 25, question: "Why did the stadium get so hot?", answer: "All the fans left", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 26, question: "What do you call a dinosaur with an extensive vocabulary?", answer: "A thesaurus", difficulty: 2, upVotes: 0, downVotes: 0 },
        { id: 27, question: "What do you call a bee that can't make up its mind?", answer: "A maybee", difficulty: 1, upVotes: 0, downVotes: 0 },
        { id: 28, question: "Why do cows wear bells?", answer: "Their horns don't work", difficulty: 2, upVotes: 0, downVotes: 0 },
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
        { id: 52, question: "Why did the bicycle fall over?", answer: "It was two-tired", difficulty: 1, upVotes: 0, downVotes: 0 },
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
        { id: 126, question: "Why did the shrimp blush?", answer: "It saw the bottom of the ocean", difficulty: 1, upVotes: 0, downVotes: 0 },     
      ];
      setPuns(punsData);

      const today = new Date().toDateString();
      const lastPlayedDate = localStorage.getItem('lastPlayedDate');
      let currentPunIndex = parseInt(localStorage.getItem('currentPunIndex') || '0');

      if (lastPlayedDate !== today) {
        currentPunIndex = (currentPunIndex + 1) % punsData.length;
        localStorage.setItem('lastPlayedDate', today);
        localStorage.setItem('currentPunIndex', currentPunIndex.toString());
      }

      setGameState(prev => ({
        ...prev,
        lastPlayedDate: today,
        currentPunIndex,
        currentPun: punsData[currentPunIndex],
        usedPunIds: new Set([punsData[currentPunIndex].id])
      }));
      trackEvent('game_started', {
        event_category: 'Game',
        event_label: 'Game Started',
        value: gameState.playerLevel
      });
    } catch (error) {
      console.error('Error loading dictionary and puns:', error);
    }
  }, [gameState.playerLevel]);

  useEffect(() => {
    loadDictionaryAndPuns();
  }, [loadDictionaryAndPuns]);

  useEffect(() => {
    localStorage.setItem('score', gameState.score.toString());
    localStorage.setItem('playerLevel', gameState.playerLevel.toString());
  }, [gameState.score, gameState.playerLevel]);

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
     
     // Check if word appears in any question or answer
     const wordInPuns = puns.some(pun => 
       pun.question.toLowerCase().includes(cleanWord) || 
       pun.answer.toLowerCase().includes(cleanWord)
     );
     if (wordInPuns) {
       return true;
     }
     
     // Check API
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
    localStorage.setItem('score', '0');
    localStorage.setItem('playerLevel', '0');
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

    // New logic to check word count
    const answerWordCount = correctAnswer.split(/\s+/).length;
    const userGuessWordCount = userGuess.split(/\s+/).length;

    if (userGuessWordCount === answerWordCount + 1) {
      setGameState(prev => ({
        ...prev,
        showNonEnglishCard: true,
        feedback: "Nice try! Your answer has one too many words.",
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
      const response = await fetch('/api/submit-email', {
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

  if (!gameState.currentPun) {
    return <div>Loading...</div>;
  }

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
              <p className="text-sm text-gray-600 mb-2.5">
                A pun-a-day word game where we ask the questions and you guess the puns!
              </p>
              <CardDescription className="text-xl font-medium text-[#00B4D8] flex items-center justify-center">
              <span className="mr-2 text-2xl">⚡</span>
              Let the Brainstorm Begin!
              <span className="ml-2 text-2xl">⚡</span>
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
                        const shareText = `I just played Punderous™! Can you guess this pun? "${gameState.currentPun!.question}"`;
                        
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
                      onClick={() => setGameState(prev => ({ 
                        ...prev, 
                        showNonEnglishCard: false,
                        userAnswer: ''
                      }))}
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
                        className="h-9 w-[80px] text-[13.75px] border-[#A06CD5] text-[#A06CD5] hover:bg-[#A06CD5] hover:text-white"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1.5" />
                        Good
                      </Button>
                      <Button
                        onClick={() => handleVote(gameState.currentPun!, 'down')}
                        variant="outline"
                        size="sm"
                        className="h-9 w-[80px] text-[13.75px] border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                      >
                        <ThumbsDown className="w-4 h-4 mr-1.5" />
                        Bad
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
                  className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 text-[13px] py-1 h-9"
                  disabled={true}
                >
                  Hints coming soon!
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
                    Get Notified
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
              <p className="text-[14px] text-gray-600 text-center mb-1">Your puntribution helps bring the full version to life! Donate below:</p>
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
    </>
  );
}