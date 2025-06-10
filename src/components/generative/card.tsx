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

export interface CardComponentProps {
  title?: string;
  description?: string;
  footerContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  onClick?: () => void;
}

const CardComponent: React.FC<CardComponentProps> = ({
  title,
  description,
  footerContent,
  children,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  onClick,
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
        {children}
      </CardContent>
      {footerContent && (
        <CardFooter className={cn(footerClassName)}>
          {footerContent}
        </CardFooter>
      )}
    </ShadcnCard>
  );
};

const CardPrompt = `
To display content within a bordered container (a card), use the CardComponent.
Props:
- children: React.ReactNode (The main content to display inside the card)
- (optional) title: string (A title for the card, displayed in the header)
- (optional) description: string (A description for the card, displayed in the header below the title)
- (optional) footerContent: React.ReactNode (Content to display in the card's footer)
- (optional) className: string (Tailwind classes for the card itself)
- (optional) headerClassName: string (Tailwind classes for the card header)
- (optional) contentClassName: string (Tailwind classes for the card content area)
- (optional) footerClassName: string (Tailwind classes for the card footer)
- (optional) onClick: () => void (Function to call when the card is clicked)

Example of wrapping other components:
<CardComponent title="User Details" description="Information about the user.">
  <KeyValueDisplayComponent 
    data={{ name: 'Jane Doe', email: 'jane@example.com' }} 
    items={[{key: 'name', label: 'Full Name'}, {key: 'email', label: 'Email Address'}]} 
  />
</CardComponent>

Example with simple text:
<CardComponent title="Note">
  <p>This is an important piece of information.</p>
</CardComponent>
`;

export const CardComponentRegistry: RegistryComponent = {
  component: CardComponent,
  prompt: CardPrompt,
};

export default CardComponent;