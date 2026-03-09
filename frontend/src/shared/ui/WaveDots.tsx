import {FC} from 'react';

interface WaveDotsProps {
  color?: string;
  size?: string;
  className?: string;
}

export const WaveDots: FC<WaveDotsProps> = ({
  color = 'bg-brand-solid',
  size = 'w-5 h-5',
  className = ''
}) => {
  return (
    <>
      <style jsx global>{`
        @keyframes wave {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-15px);
          }
        }

        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
        }

        .delay-0 { animation-delay: 0s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>

      <div className={`flex items-center gap-2 h-10 ${className}`}>
        <div className={`${size} ${color} rounded-full animate-wave delay-0`} />
        <div className={`${size} ${color} rounded-full animate-wave delay-200`} />
        <div className={`${size} ${color} rounded-full animate-wave delay-400`} />
      </div>
    </>
  );
};