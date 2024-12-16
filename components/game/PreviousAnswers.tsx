interface PreviousAnswersProps {
  answers: string[];
}

const PreviousAnswers: React.FC<PreviousAnswersProps> = ({ answers }) => (
  <div className="text-center space-y-1">
    {answers.map((answer, index) => (
      <div key={index} className="text-sm text-gray-600">
        {index + 1}: {answer}
      </div>
    ))}
  </div>
);

export default PreviousAnswers;
