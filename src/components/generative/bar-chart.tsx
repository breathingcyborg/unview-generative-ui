      
'use client'

import React from 'react';
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RegistryComponent } from '@/components/generative/registry';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '../ui/chart';

// Define a type for the data that will be used in the chart.  This allows LLMs to understand
// the expected format.  It's an *example*, so the LLM knows what keys to expect.
interface ChartDataPoint {
  [key: string]: number | string; // flexible type for data point values
}

// Define the type for the keys that will be used for the bars.  Important for prompting.
interface BarKeyConfig {
  dataKey: string;
  fill: string;
  label?: string; // Optional, for tooltips/legends
}

interface GenericBarChartComponentProps {
  title?: string;
  description?: string;
  data: ChartDataPoint[]; // Explicit type for data
  xAxisKey: string;
  barKeys: BarKeyConfig[]; // Explicit type for bar keys
  trendingUp?: number;
  footerContent?: React.ReactNode; //Replaces footerDescription. Makes more flexible
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  onClick?: () => void;
  yAxisLabel?: string;
  chartConfig: ChartConfig
}

const GenericBarChartComponent: React.FC<GenericBarChartComponentProps> = ({
  title,
  description,
  data,
  xAxisKey,
  barKeys,
  trendingUp,
  footerContent,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  onClick,
  yAxisLabel,
  chartConfig
}) => {


  return (
    <ShadcnCard className={cn(className, { 'cursor-pointer hover:shadow-lg transition-shadow': !!onClick })} onClick={onClick}>
      {(title || description) && (
        <CardHeader className={cn(headerClassName)}>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn(contentClassName)}>
        <ChartContainer config={chartConfig}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis>
                  {yAxisLabel && <text x={0} y={0} dy={12} textAnchor="middle" transform="rotate(-90)">{yAxisLabel}</text>}
                </YAxis>
              <ChartTooltip
                 cursor={false}
                 content={<ChartTooltipContent indicator="dashed" />}
                />
              {barKeys.map((bar, index) => (
                <Bar key={index} dataKey={bar.dataKey} fill={bar.fill} barSize={20} name={bar.label} radius={4} />
              ))}
            </BarChart>
          </ChartContainer>
      </CardContent>
      {(footerContent || trendingUp) && (
        <CardFooter className={cn(footerClassName)}>
          {trendingUp !== undefined && (
            <div className="flex gap-2 leading-none font-medium">
              Trending up by {trendingUp}% this month <TrendingUp className="h-4 w-4" />
            </div>
          )}
          {footerContent}
        </CardFooter>
      )}
    </ShadcnCard>
  );
};

const GenericBarChartComponentPrompt = `
To display a bar chart within a card, use the GenericBarChartComponent component.  This component takes data and configuration
options to render a bar chart using Recharts.

Props:
- data: ChartDataPoint[] (An array of objects, where each object represents a data point for the chart.  Each object
         must have a key corresponding to the xAxisKey and keys corresponding to the dataKey in each element of the barKeys array)
- xAxisKey: string (The key in each data point object to use for the x-axis labels.)
- barKeys: BarKeyConfig[] (An array of objects, each defining a bar to display.  Each object should have:
    - dataKey: string (The key in each data point object to use for the bar's value.)
    - fill: string (The color to fill the bar with, e.g., a Tailwind color class or hex code.)
    - label?: string (Optional label for tooltip.)
- (optional) title: string (A title for the card, displayed in the header)
- (optional) description: string (A description for the card, displayed in the header below the title)
- (optional) footerContent: React.ReactNode (Content to display in the card's footer.  Use this to display custom
    footer content instead of the trendingUp prop.)
- (optional) trendingUp: number (A percentage to display in the footer indicating a trending increase.  Mutually exclusive with footerContent.)
- (optional) className: string (Tailwind classes for the card itself)
- (optional) headerClassName: string (Tailwind classes for the card header)
- (optional) contentClassName: string (Tailwind classes for the card content area)
- (optional) footerClassName: string (Tailwind classes for the card footer)
- (optional) onClick: () => void (Function to call when the card is clicked)
- (optional) yAxisLabel: string (Label for the y-axis)
- (required) chartConfig: ChartConfig - Configuration object for styling and theming the chart using ChartContainer.
  The ChartConfig type is defined as:
  \`\`\`typescript
  interface ChartConfig {
    [key: string]: {
      label: string;
      color: string;
    };
  }
  \`\`\`
  Each key in the object corresponds to a dataKey in the data array.  The \`label\` is used in the tooltip, and the \`color\` is used for the bar fill.

Interface ChartDataPoint {
    [key: string]: number | string;
}

Interface BarKeyConfig {
    dataKey: string;
    fill: string;
    label?: string;
}

Example:
\`\`\`jsx
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
];

const barKeys = [
  { dataKey: "desktop", fill: "var(--chart-1)", label: "Desktop" },
  { dataKey: "mobile", fill: "var(--chart-2)", label: "Mobile" },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
}

<GenericBarChartComponent
  title="Monthly Traffic"
  description="Desktop vs. Mobile Traffic"
  data={chartData}
  xAxisKey="month"
  barKeys={barKeys}
  trendingUp={10}
  chartConfig={chartConfig}
/>
\`\`\`

This will render a card containing a bar chart showing desktop and mobile traffic for each month. The \`ChartConfig\` object is used to theme the chart and provide labels for the tooltip.
`;

export const GenericBarChartComponentRegistry: RegistryComponent = {
  component: GenericBarChartComponent,
  prompt: GenericBarChartComponentPrompt,
};

export default GenericBarChartComponent;

    