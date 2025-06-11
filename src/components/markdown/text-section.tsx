import { MarkdownSection } from "./markdown-section";
import { LoadingCard } from "../loading-card";
import { JSXSection } from "./jsx-section";

/**
 * Splits content into markdown and jsx sections and renders them.
 * 
 * 1. Markdown section
 *    They are rendered instantly as they work with partial streamed markdown.
 * 
 * 2. JSX sections 
 *    They are only render after all we get complete jsx
 *    LLM must enclose jsx codw within <jsx></jsx>
 * 
 */

type TextSectionType =
  | { type: "markdown"; content: string }
  | { type: "jsx"; content: string; partial_jsx: boolean };

function stripJSXTags(content: string) {
  return content.replace("<jsx>", '').replace("</jsx>", '');
}

function splitSections(input: string): TextSectionType[] {
  const sections: TextSectionType[] = [];
  let pos = 0;
  const openingTag = "<jsx>";
  const closingTag = "</jsx>";
  const closingTagLength = closingTag.length

  while (pos < input.length) {
    const jsxStart = input.indexOf(openingTag, pos);

    if (jsxStart === -1) {
      sections.push({ type: "markdown", content: input.slice(pos) });
      break;
    }

    if (jsxStart > pos) {
      sections.push({ type: "markdown", content: input.slice(pos, jsxStart) });
    }

    const jsxEnd = input.indexOf(closingTag, jsxStart);
    if (jsxEnd === -1) {
      sections.push({
        type: "jsx",
        content: input.slice(jsxStart),
        partial_jsx: true,
      });
      break;
    }

    sections.push({
      type: "jsx",
      content: input.slice(jsxStart, jsxEnd + closingTagLength),
      partial_jsx: false,
    });
    pos = jsxEnd + closingTagLength;
  }

  return sections;
}

export function TextSection({ text }: { text: string }) {
  const sections = splitSections(text);

  // divide it into sections - each section is either markdown or jsx
  return <div className="whitespace-pre-wrap">
      <div className="flex flex-col gap-6">
        {
          sections.map((section, i) => {
            if (section.type === 'markdown') {
              return <MarkdownSection key={i}>{section.content}</MarkdownSection>
            }
            if (section.type === 'jsx') {
              if (section.partial_jsx) {
                return <LoadingCard title="Generating UI" key={i} />
              }
              console.debug('rendering', stripJSXTags(section.content));
              return <JSXSection key={i} code={stripJSXTags(section.content)} />
            }
            return null;
          })
        }
      </div>
  </div>
}
