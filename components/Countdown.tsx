
import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-emerald-500 font-bold">RELEASED</span>;

  return (
    <div className="flex gap-3 text-xs md:text-sm font-mono tracking-wider">
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-bold">{timeLeft.days}</span>
        <span className="text-gray-500 uppercase text-[10px]">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="text-gray-500 uppercase text-[10px]">Hrs</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="text-gray-500 uppercase text-[10px]">Min</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        <span className="text-gray-500 uppercase text-[10px]">Sec</span>
      </div>
    </div>
  );
};

export default Countdown;
