import type { ToolInvocation } from "ai";
import { LoadingCard } from "./loading-card";

export function ToolCall({ call } : { call: ToolInvocation }) {
    if (call.state === 'result') {
        return null;
    }
    return <LoadingCard title="Calling Tool" subtitle={call.toolName} />
}