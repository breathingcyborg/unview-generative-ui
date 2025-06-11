import { MDXSection } from "./mdx-section";
import { MDXProvider } from "@mdx-js/react";
import { useRegistryContext } from "@/components/generative/registry";
import { useMemo } from "react";
import { PlainMarkdownSection } from "./plain-markdown-section";
import { MDXLoading } from "../mdx-loading";

/**
 * Splits content into markdown and mdx sections and renders them.
 * 
 * 1. Markdown section
 *    They are rendered instantly as they work with partial streamed markdown.
 * 
 * 2. MDX sections 
 *    They are only render after all we get complete mdx
 *    LLM must enclose mdx codw within <mdx></mdx>
 * 
 */

type MarkdownSection =
  | { type: "markdown"; content: string }
  | { type: "mdx"; content: string; partial_mdx: boolean };

function stripMdxTags(content: string) {
  return content.replace("<mdx>", '').replace("</mdx>", '');
}

function splitMarkdownSections(input: string): MarkdownSection[] {
  const sections: MarkdownSection[] = [];
  let pos = 0;
  const openingTag = "<mdx>";
  const closingTag = "</mdx>";
  const closingTagLength = closingTag.length

  while (pos < input.length) {
    const mdxStart = input.indexOf(openingTag, pos);

    if (mdxStart === -1) {
      sections.push({ type: "markdown", content: input.slice(pos) });
      break;
    }

    if (mdxStart > pos) {
      sections.push({ type: "markdown", content: input.slice(pos, mdxStart) });
    }

    const mdxEnd = input.indexOf(closingTag, mdxStart);
    if (mdxEnd === -1) {
      sections.push({
        type: "mdx",
        content: input.slice(mdxStart),
        partial_mdx: true,
      });
      break;
    }

    sections.push({
      type: "mdx",
      content: input.slice(mdxStart, mdxEnd + closingTagLength),
      partial_mdx: false,
    });
    pos = mdxEnd + closingTagLength;
  }

  return sections;
}

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  const sections = splitMarkdownSections(markdown);
  const { components, hooks } = useRegistryContext();

  const mdxComponents = useMemo(() => {
    const entires = Object.entries(components).map(([k, v], ) => {
      return [k, v.component]
    });
    return Object.fromEntries(entires);
  }, [components]);

  // divide it into sections - each section is either markdown or mdx
  return <div className="whitespace-pre-wrap">
    <MDXProvider components={mdxComponents}>
    {
      sections.map((section, i) => {
        if (section.type === 'markdown') {
          return <PlainMarkdownSection key={i}>{section.content}</PlainMarkdownSection>
        }
        if (section.type === 'mdx') {
          if (section.partial_mdx) {
            return <MDXLoading key={i}/>
          }
          console.debug('rendering', stripMdxTags(section.content));
          return <MDXSection className="my-3" key={i} code={stripMdxTags(section.content)} />
        }
        return null;
      })
    }
    </MDXProvider>
  </div>
}
