
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ShareButtonProps {
  results: {
    humanSouls: number;
    dogSouls: number;
    moreDogsOrHumans: 'dogs' | 'humans' | 'equal';
  };
}

const ShareButton = ({ results }: ShareButtonProps) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    const message = `I just ran the Heaven Census! In heaven, there are more ${
      results.moreDogsOrHumans === 'dogs' 
        ? 'dogs 🐶'
        : results.moreDogsOrHumans === 'humans'
          ? 'humans 👼'
          : 'equal numbers of dogs and humans 🐶👼'
    }. Check it out yourself!`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Population of Heaven',
          text: message,
          url: window.location.href,
        });
        toast({
          title: "Shared successfully!",
          description: "Your Heaven Census has been shared.",
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(`${message} ${window.location.href}`);
        toast({
          title: "Copied to clipboard!",
          description: "Share link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing failed",
        description: "There was an error sharing your results.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={isSharing}
      className="btn-whimsy w-full sm:w-auto h-12 flex items-center gap-2" 
      size="sm"
    >
      <Share className="h-4 w-4" />
      <span>Share My Heaven Census</span>
      <Sparkles className="h-3 w-3 text-white/80 animate-pulse-gentle" />
    </Button>
  );
};

export default ShareButton;
