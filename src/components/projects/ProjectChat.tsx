
import React, { useRef, useEffect } from 'react';
import { SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from "@/lib/utils";

interface ProjectChatProps {
  chatMessages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  currentUserId: string;
}

export const ProjectChat: React.FC<ProjectChatProps> = ({
  chatMessages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  currentUserId
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom of chat when new messages arrive
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="bg-card rounded-lg border shadow-md h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Project Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length > 0 ? (
          chatMessages.map(message => (
            <div key={message.id} className={cn(
              "flex max-w-[80%] mb-2",
              message.sender.id === currentUserId ? "ml-auto" : ""
            )}>
              {message.sender.id !== currentUserId && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div>
                {message.sender.id !== currentUserId && (
                  <p className="text-xs text-muted-foreground mb-1">{message.sender.name}</p>
                )}
                <div className={cn(
                  "rounded-lg p-3 inline-block",
                  message.sender.id === currentUserId 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}>
                  <p className="text-sm">{message.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
