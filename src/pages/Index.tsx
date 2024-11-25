import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Message } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleSend = async (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      const response = await new Promise<string>((resolve) => 
        setTimeout(() => resolve("This is a sample response from the chatbot."), 1000)
      );

      const botMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        audioUrl: "https://example.com/audio.mp3", // TODO: Replace with actual audio URL
        isPlaying: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return { ...msg, isPlaying: !msg.isPlaying };
        }
        return { ...msg, isPlaying: false };
      })
    );
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onPlayPause={handlePlayPause}
            />
          ))}
        </div>
      </main>
      <div className="border-t bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default Index;