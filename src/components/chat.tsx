'use client'

import { useChat } from "@ai-sdk/react";
import { useRegistryContext } from "./generative/registry";
import { getCustomComponentsPrompt } from "./generative/registry-prompt";
import { TextSection } from "./markdown/text-section";
import { ToolCall } from "./tool-call";
import { Input } from "./ui/input";
import { UIMessage } from "ai";
import { Card } from "./ui/card";
import { Intro } from "./intro";
import { cn } from "@/lib/utils";

export function Chat() {

  const registryContext = useRegistryContext();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append
  } = useChat({
    api: '/api/generative-dashboard',
    body: {
      ...getCustomComponentsPrompt(registryContext),
    }
  });
  
  const isEmpty = messages.length <= 0;

  const onSelectPrompt = (prompt: string) => {
    append({ role: 'user', content: prompt } );
  }

  return (
    <div className="chat-container mx-auto min-h-screen">
      {
        isEmpty && <Intro onSelectPrompt={onSelectPrompt}/>
      }
      <div className={cn("flex flex-col stretch", { "py-24": !isEmpty })}>
        {messages.map(message => (
          <div key={message.id} className="whitespace-pre-wrap">
            <MessageContainer message={message}>
              <Message message={message} />
            </MessageContainer>
          </div>
        ))}

        <form onSubmit={handleSubmit} className='fixed bottom-0 left-0 right-0 w-full'>
          <div className="chat-container mx-auto p-4 flex justify-center">
            <Input
              className="h-20 rounded-lg shadow-xl max-w-full bg-card dark:bg-card"
              value={input}
              placeholder="Your Message..."
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

function Message({ message } : { message: UIMessage }) {
  return <div className="flex flex-col gap-6">
    {message.parts.map((part, i) => {
      switch (part.type) {
        case 'text':
          return <div key={`${message.id}-${i}`}>
            <TextSection text={part.text} />
          </div>;
        case 'tool-invocation':
          return (
            <ToolCall key={`${message.id}-${i}`} call={part.toolInvocation} />
          )
        }
    })}
  </div>
}

function MessageContainer({ message, children } : { message: UIMessage, children: React.ReactNode }) {
  const isUser = message.role === 'user';
  if (!isUser) {
    return <div className="my6">
      { children }
    </div>
  }
  return <Card className="max-w-sm ml-auto px-4 my-6">
    { children }
  </Card>
}