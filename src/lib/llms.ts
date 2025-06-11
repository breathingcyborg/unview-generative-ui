import { openai } from "@ai-sdk/openai";
import { OpenAIChatModelId } from "@ai-sdk/openai/internal";

const DATA_GEN_MODEL : OpenAIChatModelId = 'gpt-4.1-mini-2025-04-14'

const UI_GEN_MODEL : OpenAIChatModelId = 'gpt-4.1-mini-2025-04-14'

export function getDataGenerationLLM() {
    return openai(DATA_GEN_MODEL, {
        // structuredOutputs: true
    });
}

export function getUiGenerationLLM() {
    return openai(UI_GEN_MODEL, {
        // structuredOutputs: true,
    });
}