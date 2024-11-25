import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { SendHorizontal } from "lucide-react";
import { useState, FormEvent, useEffect, useRef, forwardRef, Ref } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(({ onSend, disabled }, ref) => {
  const [input, setInput] = useState("");
  const textareaRef = ref as React.RefObject<HTMLTextAreaElement> || useRef<HTMLTextAreaElement>(null); // Use passed ref or create a new one

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
    textareaRef.current?.focus(); // Keep the cursor active in the textarea after sending
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter key without Shift
      handleSubmit(e);
    }
  };

  useEffect(() => {
    textareaRef.current?.focus(); // Focus the textarea when the component mounts
  }, []);

  // Expose focus method
  const focus = () => {
    textareaRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        ref={textareaRef} // Attach the ref to the textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown} // Attach the key down event handler
        placeholder="Type a message..."
        className="min-h-[52px] resize-none"
        disabled={disabled}
      />
      <Button type="submit" size="icon" disabled={disabled || !input.trim()}>
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
});

export default Object.assign(ChatInput, { focus }); // Ensure default export and expose focus method
