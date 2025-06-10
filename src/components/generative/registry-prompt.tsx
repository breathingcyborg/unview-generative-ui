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
  let componentPrompt = '';
  for (const key in value.components) {
    const c = value.components[key];
    if (c.prompt.trim()) {
      componentPrompt += `\n### Component: ${key}\n${c.prompt.trim()}\n`;
    }
  }
  if (componentPrompt != '') {
    componentPrompt = `<components> ${ componentPrompt } </components>`
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
    hooksPrompt = `<hooks> ${ componentPrompt } </hooks>`
  }


  let prompt = `
## MDX Component Rendering Requirements

### When to Use MDX Tags
- **DEFAULT**: Use regular markdown for most content
- **CUSTOM COMPONENTS ONLY**: Wrap custom components within <mdx></mdx> tags
- **SWITCHING CONTEXT**: Use <mdx></mdx> blocks within markdown when you need to render custom components

### Export Requirements - CRITICAL
- **MUST EXPORT**: ALL variables, functions, and components you declare MUST be exported even if they are internal
- **NO EXCEPTIONS**: Even simple variables must use \`export const\`, \`export function\`, or \`export default\`
- **MDX PARSER REQUIREMENT**: Failure to export will cause parsing errors

### Import Rules
- **DO NOT** import any components - they are pre-loaded and available
- Components are already in scope and ready to use

### Formatting Requirements
- **MANDATORY**: In MDX context Leave a blank line between function/variable declarations and any markdown content,
- **REASON**: MDX parser requires this spacing to function correctly
- **OUTSIDE MDX**: When not in MDX context you dont need to leave blank line.

### Component Selection
- Automatically choose the most appropriate component based on context
- Use Tailwind CSS for layout styling like grid, flex etc
- DONT Use Tailwind CSS for any other styling needs
- DONT style colors / backgrounds unless user explictly asks for it.

### Component Availability
- **ONLY USE REGISTERED COMPONENTS**: Only use components that are explicitly listed below
- **NO ASSUMPTIONS**: Do not assume standard components like Button, Card, etc. exist unless listed
- **CHECK BEFORE USING**: Verify a component exists in the available components list before using it

### Async Components
- **NO ASYNC COMPONENTS**: No components should be async components

### Example Structure:
\`\`\`markdown
# Regular Markdown Content

Some regular markdown text here.

<mdx>
export const myData = { title: "Example" };

{/* default exported component would be rendered */}
export function MyCustomComponent() {
  return <div className="p-4">Custom content</div>;
}

</mdx>

More regular markdown content continues here.
\`\`\`

${componentPrompt}

${hooksPrompt}
`;


  return prompt;
}