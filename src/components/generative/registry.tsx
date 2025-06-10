'use client'

import { ComponentType, createContext, useContext } from "react"

/**
 * Registry of generative components that llm can use
 */
export type RegistryComponent = {
    component: ComponentType<any>,
    prompt: string
}

export type RegistryHooks = {
    hook: Function,
    prompt: string,
}

export type RegistryContextType = {
    components: { [key: string]: RegistryComponent }
    hooks: { [key: string]: RegistryHooks },
}

const context = createContext<RegistryContextType>({ components: {}, hooks: {} })

export const RegistryContextProvider = context.Provider;

export const useRegistryContext = () => useContext(context);
