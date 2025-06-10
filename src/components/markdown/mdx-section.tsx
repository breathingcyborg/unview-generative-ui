import { compile, run } from "@mdx-js/mdx";
import { MDXModule } from "mdx/types";
import { Fragment, useEffect, useMemo, useState } from "react";
import * as runtime from 'react/jsx-runtime';
import { useMDXComponents as _provideComponents } from '@mdx-js/react';
import { useRegistryContext } from "@/components/generative/registry";
import React from 'react';

interface MDXSectionProps {
  code: string;
  className?: string;
}

/**
 * Dont forget to wrap this with <MDXProvider components={components}></MDXProvider>
 * https://mdxjs.com/packages/react/#use
 * 
 * Renders mdx sections 
 * using components & hooks provided by generative components registry
 * 
 */
export const MDXSection: React.FC<MDXSectionProps> = ({ code, className }) => {

  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // module compiled by mdx library
  const [mdxModule, setMdxModule] = useState<MDXModule | null>()

  // Content component
  const Content = mdxModule ? mdxModule.default : Fragment

  // generative components / hook registry
  const registryContext = useRegistryContext();

  // Scope that we would pass to code compiled by mdx library
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

    return { components, hooks: { ...hooks, useState, useEffect, useMemo }, React: React }

  }, [registryContext]);

  // Import all components and hooks, at top of the generated code
  const importStatements = useMemo(() => {

    const hooksNameList = Object.keys(scope.hooks).join(', ');

    const componentsNameList = Object.keys(scope.components).join(', ');

    return `
      const {${hooksNameList}} = arguments[0].scope.hooks;
      const {${componentsNameList}} = arguments[0].scope.components;
      const React = arguments[0].scope.React;
    `;
  }, [scope]);



  useEffect(() => {

    const renderMDX = async (): Promise<void> => {
      try {

        setIsLoading(true);
        setError(null);

        // compile code
        const compiledCode = await compile(String(code), {
          outputFormat: 'function-body',
          providerImportSource: '@mdx-js/react',
          baseUrl: import.meta.url,
        })

        // add imports
        const codeWithImports = `
          ${importStatements}
          ${String(compiledCode)}        
          `
        // Log for debugging
        console.debug(String(codeWithImports));

        // Create module from compiled code
        // default export of this module is content component
        const module = await run(String(codeWithImports), {
          ...runtime,
          baseUrl: import.meta.url,
          useMDXComponents: _provideComponents,
          // @ts-ignore
          scope: scope
        })

        setMdxModule(module)

      } catch (err) {

        console.error('MDX rendering error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');

      } finally {

        setIsLoading(false);

      }
    };

    if (code) {
      renderMDX();
    }

  }, [code]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Rendering MDX...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">MDX Rendering Error</h3>
        <pre className="text-red-700 text-sm whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  if (!Content) {
    return (
      <div className="p-4 text-gray-500">
        No MDX content provided
      </div>
    );
  }

  return (
    <div className={className}>
      <Content />
    </div>
  );
};
