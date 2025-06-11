'use client'

import { RegistryContextType } from "./registry";

/**
 * Prompt frontend would pass to backend,
 * giving a list of generative components that llm can use.
 * 
 * @param value 
 * @returns
 */

export function getCustomComponentsPrompt(value: RegistryContextType) {

  // Add component-specific instructions
  let componentsPrompt = '';
  for (const key in value.components) {
    const c = value.components[key];
    if (c.prompt.trim()) {
      componentsPrompt += `\n### Component: ${key}\n${c.prompt.trim()}\n`;
    }
  }
  if (componentsPrompt != '') {
    componentsPrompt = `<components> ${ componentsPrompt } </components>`
  }

  // Add hooks-specific instructions
  let hooksPrompt = '';
  for (const key in value.hooks) {
    const h = value.hooks[key];
    if (h.prompt.trim()) {
      hooksPrompt += `\n### Hook: ${key}\n${h.prompt.trim()}\n`;
    }
  }
  if (hooksPrompt != '') {
    hooksPrompt = `<hooks> ${ componentsPrompt } </hooks>`
  }

  return { hooksPrompt, componentsPrompt }
}