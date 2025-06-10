'use client';

import { RegistryContextProvider, useRegistryContext } from '@/components/generative/registry';
import { registeredUiComponents } from '@/components/generative/registry-components';
import { Input } from '@/components/ui/input';
import { useChat } from '@ai-sdk/react';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';
import { getCustomComponentsPrompt } from '@/components/generative/registry-prompt';
import { ToolCall } from '@/components/tool-call';

export default function Page() {
  return <RegistryContextProvider value={{ components: registeredUiComponents, hooks: {} }}>
    <Chat />
  </RegistryContextProvider>
}

const mockMd = `
<mdx> 
export const inventorySummaryData = { total_distinct_products: 0, total_units_on_hand: 0, last_updated: "", }; 
export const lowStockProductsData = []; 
export const InventorySummaryTitle = "Inventory Summary"; 
export const LowStockProductsTitle = "Low Stock Products"; 
export function InventorySummaryCard() { 
  return ( <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
    <StatsCardComponent title="Total Distinct Products" value={inventorySummaryData.total_distinct_products} /> 
    <StatsCardComponent title="Total Units On Hand" value={inventorySummaryData.total_units_on_hand} /> 
    <StatsCardComponent title="Last Updated" value={new Date(inventorySummaryData.last_updated).toLocaleString()} /> 
  </div> ); 
} 
export default function LowStockProductsTable() { 
  return ( 
    <DataTableComponent title={LowStockProductsTitle} data={lowStockProductsData} columns={[ { key: "product_id", header: "Product ID" }, { key: "name", header: "Product Name" }, { key: "warehouse.name", header: "Warehouse" }, { key: "quantity_on_hand", header: "Stock" }, { key: "reorder_level", header: "Reorder At" }, ]} className="mt-4" /> 
  ); 
}
</mdx> 
`

function Chat() {

  const registryContext = useRegistryContext();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: '/api/generative-dashboard',
    body: {
      customComponentPrompt: getCustomComponentsPrompt(registryContext),
    }
  });

  return (
    <div className="container mx-auto">
      <div className="flex flex-col py-24 stretch">
        {/* <div>
          <MarkdownRenderer markdown={mockMd} />
        </div> */}
        {messages.map(message => (
          <div key={message.id} className="whitespace-pre-wrap">
            {/* <div>{ JSON.stringify(message.parts, null, 4) }</div> <br/> */}
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return <div key={`${message.id}-${i}`}>
                    <MarkdownRenderer markdown={part.text} />
                  </div>;
                case 'tool-invocation':
                  return (
                    <ToolCall key={`${message.id}-${i}`} call={part.toolInvocation} />
                  )
              }
            })}
          </div>
        ))}

        <form onSubmit={handleSubmit} className='fixed bottom-0 left-0 right-0 w-full'>
          <div className="container mx-auto p-4 flex justify-center">
            <Input
              className="rounded shadow-xl w-lg max-w-full"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
}