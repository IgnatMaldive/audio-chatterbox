import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  onPlayPause: (messageId: string) => void;
}

export const ChatMessage = ({ message, onPlayPause }: ChatMessageProps) => {
  const isBot = message.role === "assistant";

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
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground/90">{message.content}</p>
        {isBot && message.audioUrl && (
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
        )}
      </div>
    </div>
  );
};