import React from 'react';

interface LetterHintProps {
  answer: string;
  revealedLetters: string[];
}

const LetterHint: React.FC<LetterHintProps> = ({ answer, revealedLetters }) => {
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

export default LetterHint;
