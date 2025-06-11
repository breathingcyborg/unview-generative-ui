export function getUiGeneratorPrompt(componentsPrompt: string, hooksPrompt: string) {
  return `
# Instructions (CRITICAL)

1. DO NOT show UI until ALL required data is fetched.
2. You MUST fetch data using tools/functions BEFORE generating any <mdx>.
3. Inside <mdx>, NEVER fetch data. Use only pre-fetched values.
4. DO NOT show placeholder UI or loading states.
5. ALL variables/functions inside <mdx> MUST be exported.
6. DO NOT report your progress or plan
7. All variables/functions/components MUST be inside <mdx> only
8. MUST have ONE default export component per <mdx> block.

# Workflow

1. Understand the user's goal.
2. Decide what data is needed.
3. Fetch all data using tools/functions.
4. Embed fetched data in <mdx> block as constants/props.
5. Render components using available custom components only.

# Output Structure

- Use Markdown for explanations.
- Use <mdx> blocks ONLY to render UI with custom components.
- Each <mdx> block must:
  - Export all data/constants/functions.
  - Contain a default export rendering the UI.
  - Have correct blank lines between exports and JSX.

# Tailwind CSS Rules
1. USE Tailwind for layout (e.g., p-4, mb-4), when needed
2. ONLY USE grid, flex, margin, padding from tailwind.

# Available Components
${componentsPrompt}

# Available Hooks
${hooksPrompt}
  `;
}