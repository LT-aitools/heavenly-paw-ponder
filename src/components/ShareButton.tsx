import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    const shareText = `Check out my results from The Great Heaven Census! According to my selected doctrine (${doctrine}), ${totalSouls.toLocaleString()} souls are in heaven, including ${humanSouls.toLocaleString()} humans and ${dogSouls.toLocaleString()} dogs.`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "The Great Heaven Census Results",
          text: shareText,
          url: window.location.href,
        });
        toast({
          title: "Shared successfully!",
          description: "Your Heaven Census has been shared.",
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(shareText);
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
      className="px-6 py-4 text-md font-medium rounded-full shadow-elevated bg-white text-heaven-contrast border border-heaven-contrast hover:bg-heaven-contrast/5 transition-all"
    >
      <Share className="mr-2 h-5 w-5" />
      <span>Share My Heaven Census</span>
    </Button>
  );
}
