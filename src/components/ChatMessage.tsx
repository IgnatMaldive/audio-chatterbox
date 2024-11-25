import { Message } from "../types/chat";
import { Button } from "./ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useEffect, useRef } from "react";

interface ChatMessageProps {
  message: Message;
  onPlayPause: (messageId: string) => void;
  onAudioEnd: () => void; // New prop to handle audio end
}

export const ChatMessage = ({ message, onPlayPause, onAudioEnd }: ChatMessageProps) => {
  const isBot = message.role === "assistant";
  const audioRef = useRef<HTMLAudioElement>(null); // Create a ref for the audio element

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', onAudioEnd); // Listen for the audio end event
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', onAudioEnd); // Clean up the event listener
      }
    };
  }, [onAudioEnd]);

  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4",
        isBot ? "bg-muted/50" : "bg-background"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border",
          isBot ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/20 bg-background"
        )}
      >
        {isBot ? <Volume2 className="h-4 w-4" /> : "You"}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <p className="text-sm text-foreground/90">{message.content}</p>
        {isBot && message.audioUrl && (
          <div className="flex justify-end"> {/* Added this div to align the button to the right */}
            <audio ref={audioRef} src={message.audioUrl} /> {/* Audio element */}
            <Button
              variant="outline"
              size="sm"
              className="w-fit gap-2"
              onClick={() => onPlayPause(message.id)}
            >
              {message.isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span className="animate-pulse-opacity">Playing...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play audio
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
