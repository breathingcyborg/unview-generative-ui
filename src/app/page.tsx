'use client';

import { Chat } from '@/components/chat';
import { RegistryContextProvider } from '@/components/generative/registry';
import { registeredUiComponents } from '@/components/generative/registry-components';

export default function Page() {
  return <RegistryContextProvider value={{ components: registeredUiComponents, hooks: {} }}>
    <Chat />
  </RegistryContextProvider>
}