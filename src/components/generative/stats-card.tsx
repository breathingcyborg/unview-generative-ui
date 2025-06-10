'use client'

import React from 'react';
import {
  Card as ShadcnCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RegistryComponent } from '@/components/generative/registry';

export interface StatsCardComponentProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  className?: string;
  valueClassName?: string;
  titleClassName?: string;
  onClick?: () => void;
}

const StatsCardComponent: React.FC<StatsCardComponentProps> = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  description,
  className,
  valueClassName,
  titleClassName,
  onClick,
}) => {
  const changeColorClass =
    changeType === 'positive' ? 'text-green-600 dark:text-green-500' :
    changeType === 'negative' ? 'text-red-600 dark:text-red-500' :
    'text-gray-600 dark:text-gray-400';

  return (
    <ShadcnCard className={cn("w-full", className, { 'cursor-pointer hover:shadow-md transition-shadow': !!onClick })} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn("text-sm font-medium", titleClassName)}>
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
        {change !== undefined && (
          <p className={cn("text-xs", changeColorClass)}>
            {typeof change === 'number' && change > 0 && changeType === 'positive' ? '+' : ''}
            {change}
            {description && <span className="text-muted-foreground"> {description}</span>}
          </p>
        )}
        {!change && description && (
           <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </ShadcnCard>
  );
};

const StatsCardPrompt = `
To display a single statistic in a card format, use the StatsCardComponent.
Props:
- title: string (The label for the statistic, e.g., "Total Revenue")
- value: string | number (The actual value of the statistic, e.g., "$150,000" or 1500)
- (optional) icon: React.ReactNode (An icon to display next to the title. You might need to provide SVG or an icon component instance.)
- (optional) change: string | number (A value indicating change, e.g., "+5.2%" or -100)
- (optional) changeType: 'positive' | 'negative' | 'neutral' (Default 'neutral'. Styles the change text color: green for positive, red for negative)
- (optional) description: string (Additional context, often for the change, e.g., "vs last month")
- (optional) className: string (Tailwind classes for the card itself)
- (optional) valueClassName: string (Tailwind classes for the main value text)
- (optional) titleClassName: string (Tailwind classes for the title text)
- (optional) onClick: () => void (Function to call when the card is clicked)


Example:
<StatsCardComponent
  title="Total Sales"
  value="$1,234.56"
  change="+10.2%"
  changeType="positive"
  description="from last month"
  // icon={<DollarSignIcon className="h-4 w-4" />} // LLM would need to know how to specify icons
/>

Example without change:
<StatsCardComponent
  title="Active Users"
  value="1,500"
  description="currently online"
/>
`;

export const StatsCardComponentRegistry: RegistryComponent = {
  component: StatsCardComponent,
  prompt: StatsCardPrompt,
};

export default StatsCardComponent;

    