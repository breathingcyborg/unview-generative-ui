'use client'
   
import React from 'react';
import { cn } from "@/lib/utils";
import { RegistryComponent } from '@/components/generative/registry';


export interface KeyValueItem {
  key: string;
  label: string;
  valueRenderer?: (value: any, data: Record<string, any>) => React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export interface KeyValueDisplayComponentProps {
  data: Record<string, any>;
  items: KeyValueItem[];
  title?: string;
  className?: string;
  itemLayout?: 'horizontal' | 'vertical'; // horizontal: label and value on same line
}

const KeyValueDisplayComponent: React.FC<KeyValueDisplayComponentProps> = ({
  data,
  items,
  title,
  className,
  itemLayout = 'horizontal',
}) => {
  const getValue = (obj: Record<string, any>, key: string) => {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <div className={cn("p-4 border rounded-md", className)}>
      {title && <h3 className="text-lg font-semibold mb-3 border-b pb-2">{title}</h3>}
      <dl className={cn(itemLayout === 'vertical' ? "space-y-4" : "")}>
        {items.map((item) => {
          const value = getValue(data, item.key);
          return (
            <div
              key={item.key}
              className={cn(
                "py-2",
                itemLayout === 'horizontal' && "grid grid-cols-3 gap-4 sm:grid-cols-4",
                item.className
              )}
            >
              <dt className={cn("text-sm font-medium text-gray-600 dark:text-gray-400", itemLayout === 'horizontal' && "col-span-1", item.labelClassName)}>
                {item.label}
              </dt>
              <dd className={cn("mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0", itemLayout === 'horizontal' && "col-span-2 sm:col-span-3", item.valueClassName)}>
                {item.valueRenderer ? item.valueRenderer(value, data) : (value !== undefined && value !== null ? String(value) : 'N/A')}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

const KeyValueDisplayPrompt = `
To display a set of key-value pairs from an object, use the KeyValueDisplayComponent.
Props:
- data: object (The source object containing the data)
- items: An array of item definition objects. Each item object should have:
    - key: string (The key in the data object. Can use dot notation for nested properties e.g., 'customer.email')
    - label: string (The label to display for this key)
    - (optional) valueRenderer: (value, data) => React.ReactNode (A function to custom render the value)
    - (optional) className: string (Tailwind classes for the item container div)
    - (optional) labelClassName: string (Tailwind classes for the label)
    - (optional) valueClassName: string (Tailwind classes for the value)
- (optional) title: string (A title for the display block)
- (optional) className: string (Tailwind classes for the main container)
- (optional) itemLayout: 'horizontal' | 'vertical' (Default 'horizontal'. 'horizontal' places label and value on same line, 'vertical' places value below label)

Example:
<KeyValueDisplayComponent
  title="Inventory Summary"
  data={{ total_distinct_products: 150, total_units_on_hand: 12500, last_updated: "2023-10-27T10:00:00Z" }}
  items={[
    { key: 'total_distinct_products', label: 'Total Products' },
    { key: 'total_units_on_hand', label: 'Total Units' },
    { key: 'last_updated', label: 'Last Updated', valueRenderer: (val) => new Date(val).toLocaleString() }
  ]}
/>
`;

export const KeyValueDisplayComponentRegistry: RegistryComponent = {
  component: KeyValueDisplayComponent,
  prompt: KeyValueDisplayPrompt,
};

export default KeyValueDisplayComponent;