import { FC } from 'react';

interface Props {
  score: number;
  maxScore?: number;
  title?: string;
  description?: string;
}

export const SuccessThermometer: FC<Props> = ({
  score,
  maxScore = 100,
  title = "Success Thermometer",
  description = "The thermometer shows how successfully you played the game. The higher the score, the better your strategy and balance of decisions."
}) => {
  // Ensure score is within bounds
  const normalizedScore = Math.min(Math.max(score, 0), maxScore);
  const percentage = (normalizedScore / maxScore) * 100;

  // Determine thermometer color based on score
  const getThermometerColor = () => {
    if (percentage >= 80) return 'bg-green-400';
    if (percentage >= 60) return 'bg-yellow-400';
    if (percentage >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  // Get level indicators
  const getLevelData = () => {
    return [
      { label: 'Low', position: 0, color: 'text-red-500' },
      { label: 'Medium', position: 50, color: 'text-yellow-600' },
      { label: 'High', position: 100, color: 'text-green-500' }
    ];
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Thermometer Container */}
      <div className="flex flex-col gap-4">
        {/* Thermometer Bar */}
        <div className="relative">
          {/* Background Bar */}
          <div className="w-full h-12 bg-gray-200 rounded-full relative overflow-hidden">
            {/* Fill Bar */}
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${getThermometerColor()}`}
              style={{ width: `${percentage}%` }}
            />

            {/* Score Badge */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 bg-white border-2 border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-sm"
              style={{
                left: `calc(${percentage}% - 42px)`,
              }}
            >
              <div className="flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="yellow" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>

            </div>
          </div>
        </div>

        {/* Level Indicators */}
        <div className="relative flex justify-between items-center px-2">
          {getLevelData().map((level) => (
              <div
                  key={level.label}
                  className="flex flex-col items-center gap-1"
              >
                {/* Indicator Dot */}
                <div className={`w-2 h-2 rounded-full ${
                    percentage >= level.position ? 'bg-current' : 'bg-gray-300'
                } ${level.color}`}/>

                {/* Label */}
                <span className={`text-xs font-medium ${level.color}`}>
                {level.label}
              </span>
            </div>
          ))}
        </div>

        {/* Score Display */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {normalizedScore}
            <span className="text-lg text-gray-500">/{maxScore}</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Your Success Score
          </div>
        </div>
      </div>
    </div>
  );
};