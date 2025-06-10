import type { ToolInvocation } from "ai";
import { Card, CardContent } from "./ui/card";
import { Loader2 } from "lucide-react";

export function ToolCall({ call } : { call: ToolInvocation }) {
    if (call.state === 'result') {
        return null;
    }
    return <Card className="max-w-md">
        <CardContent>
            <div className="flex flex-row gap-8">
                <div>
                    <Loader2 
                        size={32}
                        className="animate-spin" />
                </div>
                <div>
                    Calling tool <br/>
                    { call.toolName }
                </div>
            </div>
        </CardContent>
    </Card>
}