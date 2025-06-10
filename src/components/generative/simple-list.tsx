'use client'

import React from 'react';
import { cn } from "@/lib/utils";
import { RegistryComponent } from '@/components/generative/registry';

export interface SimpleListComponentProps {
  items: (string | number | React.ReactNode)[];
  ordered?: boolean;
  title?: string;
  className?: string;
  itemClassName?: string | ((item: any, index: number) => string);
  listType?: 'ul' | 'ol';
}

const SimpleListComponent: React.FC<SimpleListComponentProps> = ({
  items,
  ordered, // Deprecated in favor of listType
  title,
  className,
  itemClassName,
  listType = 'ul',
}) => {
  const ListTag = listType === 'ol' || ordered ? 'ol' : 'ul';

  return (
    <div className={cn(className)}>
      {title && <h4 className="text-md font-semibold mb-2">{title}</h4>}
      <ListTag className={cn(ListTag === 'ol' ? "list-decimal" : "list-disc", "pl-5 space-y-1")}>
        {items.map((item, index) => (
          <li
            key={index}
            className={cn(typeof itemClassName === 'function' ? itemClassName(item, index) : itemClassName)}
          >
            {item}
          </li>
        ))}
      </ListTag>
    </div>
  );
};

const SimpleListPrompt = `
To render a simple bulleted or numbered list, use the SimpleListComponent.
Props:
- items: An array of (string | number | React.ReactNode). Each element will be a list item.
- (optional) title: string (A title to display above the list)
- (optional) listType: 'ul' | 'ol' (Default 'ul'. Use 'ol' for an ordered/numbered list, 'ul' for a bulleted list)
- (optional) className: string (Tailwind classes for the container div)
- (optional) itemClassName: string | (item, index) => string (Tailwind classes for each list item <li>)

Example (bulleted):
<SimpleListComponent
  title="Product Tags"
  items={["electronics", "audio", "wireless"]}
/>

Example (numbered):
<SimpleListComponent
  title="Top 3 Steps"
  items={["Register an account", "Verify email", "Start using features"]}
  listType="ol"
/>
`;

export const SimpleListComponentRegistry: RegistryComponent = {
  component: SimpleListComponent,
  prompt: SimpleListPrompt,
};

export default SimpleListComponent;
