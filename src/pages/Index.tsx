import { useState, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Message } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { openai } from "@/lib/openai";

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
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Keep responses concise and engaging.",
          },
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: "user", content }
        ],
      });

      const responseText = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

      const speech = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: responseText,
      });

      const audioBlob = new Blob([await speech.arrayBuffer()], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const botMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: responseText,
        audioUrl,
        isPlaying: true,
      };

      setMessages((prev) => [...prev, botMessage]);
      
      // Auto-play the audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          if (!msg.isPlaying && audioRef.current && msg.audioUrl) {
            audioRef.current.src = msg.audioUrl;
            audioRef.current.play();
          } else if (msg.isPlaying && audioRef.current) {
            audioRef.current.pause();
          }
          return { ...msg, isPlaying: !msg.isPlaying };
        }
        return { ...msg, isPlaying: false };
      })
    );
  };

  const handleAudioEnded = () => {
    setMessages((prev) =>
      prev.map((msg) => ({
        ...msg,
        isPlaying: false,
      }))
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
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={handleAudioEnded}
      />
    </div>
  );
};

export default Index;