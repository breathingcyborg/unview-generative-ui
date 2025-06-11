import { Button } from "@/components/ui/button" 

export function Intro({ onSelectPrompt } : { onSelectPrompt: (prompt: string) => void }) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <div className="p-8 rounded-lg shadow-lg">
              
                <h1 className="text-3xl text-center block mb-4 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    UN View <br className="sm:hidden" /> <span className="hidden sm:inline">-</span>  Get Rid Of Views
                </h1>
                <p className="text-lg text-balance text-center mb-8 text-foreground/50">
                    Get focused, distraction-free screens tailored for you. And save developers countless hours building forms and tables.
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
                    <Button className="rounded-full cursor-pointer" size="lg" variant="outline" onClick={() => onSelectPrompt("I manage inventory, create a ui for me, use charts if possible")}>
                        📦 Inventory Manager
                    </Button>
                    <Button className="rounded-full cursor-pointer" size="lg" variant="outline" onClick={() => onSelectPrompt("I manage sales, create a ui for me, use charts if possible")}>
                        💰 Sales Manager
                    </Button>
                    <Button className="rounded-full cursor-pointer" size="lg" variant="outline" onClick={() => onSelectPrompt("I manage dispatch, create a ui for me")}>
                        🚚 Dispatch Manager
                    </Button>
                </div>
            </div>
        </div>
    );
}
