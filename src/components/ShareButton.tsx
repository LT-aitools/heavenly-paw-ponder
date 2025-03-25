
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
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
        ? 'dogs'
        : results.moreDogsOrHumans === 'humans'
          ? 'humans'
          : 'equal numbers of dogs and humans'
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
      className="px-6 py-4 text-md font-medium rounded-full shadow-elevated bg-white text-primary border border-primary hover:bg-primary/5 transition-all"
    >
      <Share className="mr-2 h-5 w-5" />
      <span>Share My Heaven Census</span>
    </Button>
  );
};

export default ShareButton;
