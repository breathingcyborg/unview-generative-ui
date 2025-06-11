import { Fragment, useEffect, useMemo, useState } from "react";
import { useRegistryContext } from "@/components/generative/registry";
import React from 'react';
import { transform } from '@babel/standalone';
import { PluginItem } from "@babel/core";

interface JSXSectionProps {
  code: string;
  className?: string;
}

/**
 * Renders JSX code using components & hooks provided by generative components registry
 * Uses Babel to transform JSX to executable JavaScript
 */
export const JSXSection: React.FC<JSXSectionProps> = ({ code, className }) => {

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [Content, setContent] = useState<React.ComponentType | null>(null);

  // generative components / hook registry
  const registryContext = useRegistryContext();

  // Scope that we would pass to the compiled JSX
  const scope = useMemo(() => {
    // object like {ComponentName: Component}
    const components = Object.fromEntries(Object.entries(registryContext.components).map((e) => {
      const [k, v] = e;
      return [k, v.component]
    }));

    // object like {hookName: Hook}
    const hooks = Object.fromEntries(Object.entries(registryContext.hooks).map((e) => {
      const [k, v] = e;
      return [k, v.hook]
    }));

    return { 
      components, 
      hooks: { ...hooks, useState, useEffect, useMemo }, 
      React: React,
      Fragment: Fragment
    }
  }, [registryContext]);

  useEffect(() => {
    const renderJSX = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        if (!code.trim()) {
          setContent(() => Fragment);
          return;
        }

        // Custom Babel plugin to handle export default
        const customExportPlugin : PluginItem = () => ({
          visitor: {
            // @ts-ignore
            ExportDefaultDeclaration(path) {
              // Get the exported declaration (function, class, etc.)
              const declaration = path.node.declaration;
              
              // Replace export default with just the declaration
              path.replaceWith(declaration);
              
              // Add return statement at the end of program
                // @ts-ignore
              const program = path.findParent(p => p.isProgram());
              if (declaration.type === 'FunctionDeclaration' && declaration.id) {
                // Add return statement with the function name
                program.pushContainer('body', {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'Identifier',
                    name: declaration.id.name
                  }
                });
              } else if (declaration.type === 'ArrowFunctionExpression' || declaration.type === 'FunctionExpression') {
                // For arrow functions or function expressions, return directly
                program.pushContainer('body', {
                  type: 'ReturnStatement',
                  argument: declaration
                });
              }
            }
          }
        });

        // Transform JSX to JavaScript using Babel
        const result = transform(code, {
          presets: [
            ['react', { 
              runtime: 'classic',
              pragma: 'React.createElement',
              pragmaFrag: 'React.Fragment'
            }]
          ],
          plugins: [customExportPlugin],
          filename: 'jsx-section.jsx'
        });

        // Debug log
        console.debug('Babel result.code:', result.code);

        if (!result.code) {
          throw new Error('Babel transformation failed');
        }

        // Create the component function with injected scope
        const componentCode = `
          const { React, Fragment } = scope;
          const { ${Object.keys(scope.components).join(', ')} } = scope.components;
          const { ${Object.keys(scope.hooks).join(', ')} } = scope.hooks;
          
          ${result.code}
        `;

        // Log for debugging
        console.debug('Final component code:', componentCode);

        // Create and execute the function - it should return our component
        const createComponent = new Function('scope', componentCode);
        const ComponentFunction = createComponent(scope);

        setContent(() => ComponentFunction);

      } catch (err) {
        console.error('JSX rendering error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      renderJSX();
    } else {
      setContent(() => Fragment);
      setIsLoading(false);
    }

  }, [code, scope]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Rendering JSX...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">JSX Rendering Error</h3>
        <pre className="text-red-700 text-sm whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  if (!Content) {
    return (
      <div className="p-4 text-gray-500">
        No JSX content provided
      </div>
    );
  }

  return (
    <div className={className}>
      <Content />
    </div>
  );
};