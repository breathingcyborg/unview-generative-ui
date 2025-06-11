import { getUiGenerationLLM } from '@/lib/llms';
import { ECommerceTools } from '@/lib/tools';
import { getUiGeneratorPrompt } from '@/lib/ui-generator-prompt';
import { 
  convertToCoreMessages, 
  streamText, 
  ToolSet, 
  UIMessage 
} from 'ai';

// 10 minutes in seconds
export const maxDuration = 600;

export async function POST(req: Request) {

  const { messages, hooksPrompt, componentsPrompt }: { messages: UIMessage[], hooksPrompt: string, componentsPrompt: string } = await req.json();

  const model = getUiGenerationLLM();

  const tools: ToolSet = {
    ...ECommerceTools
  }

  const result = streamText({
    model: model,
    system: getUiGeneratorPrompt(componentsPrompt, hooksPrompt),
    messages: convertToCoreMessages(messages),
    tools: tools,
    toolCallStreaming: true,
    maxSteps: 100,
    temperature: 0,
    onError: (event) => {
      console.error(event.error);
      console.error((event.error as any).requestBodyValues)
      console.error((event.error as any).responseBody)
    }
  });

  return result.toDataStreamResponse();
}