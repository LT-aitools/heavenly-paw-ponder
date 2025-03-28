import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ShareButtonProps {
  doctrine: string;
  totalSouls: number;
  humanSouls: number;
  dogSouls: number;
}

export function ShareButton({
  doctrine,
  totalSouls,
  humanSouls,
  dogSouls,
}: ShareButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 5000);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isAnimating}
        className="px-6 py-4 text-md font-medium rounded-full shadow-elevated bg-white text-heaven-contrast border border-heaven-contrast hover:bg-heaven-contrast/5 transition-all"
      >
        <Sparkles className="mr-2 h-5 w-5" />
        <span>Make this a party 🎉</span>
      </Button>

      {isAnimating && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Angel stickers */}
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <img
              key={`angel${num}`}
              src={`/angel${num}.png`}
              alt={`Angel ${num}`}
              className="absolute w-[120px] h-[120px] animate-bounce"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
          
          {/* Dog angel stickers */}
          {[1, 2, 3, 4].map((num) => (
            <img
              key={`dog-angel${num}`}
              src={`/dog-angel${num}.png`}
              alt={`Dog Angel ${num}`}
              className="absolute w-[120px] h-[120px] animate-bounce"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}

          {/* Animated GIFs */}
          <img
            src="/animated-werner-dog.gif"
            alt="Animated Werner Dog"
            className="absolute w-[240px] h-[240px]"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
          <img
            src="/sora-angel-pup.gif"
            alt="Sora Angel Pup"
            className="absolute w-[240px] h-[240px]"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        </div>
      )}
    </>
  );
}
