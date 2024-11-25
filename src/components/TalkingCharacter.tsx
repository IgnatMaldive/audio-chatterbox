import { cn } from "@/lib/utils";

interface TalkingCharacterProps {
  isPlaying: boolean;
}

export const TalkingCharacter = ({ isPlaying }: TalkingCharacterProps) => {
  return (
    <div className="w-32 h-32 relative mx-auto mb-4">
      {/* Face */}
      <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
        {/* Eyes */}
        <div className="absolute top-12 left-8 w-4 h-4 rounded-full bg-primary" />
        <div className="absolute top-12 right-8 w-4 h-4 rounded-full bg-primary" />
        {/* Mouth */}
        <div
          className={cn(
            "absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-4 bg-primary rounded-lg transition-all duration-200",
            isPlaying && "animate-[mouth-move_0.3s_ease-in-out_infinite]"
          )}
        />
      </div>
    </div>
  );
};