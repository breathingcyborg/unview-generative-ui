import { cn } from "@/lib/utils";

export function CustomSpinner({ className } : { className?: string }) {
    return <div className={cn("spinner", className)}>
        <div className="spinner-inner"></div>
    </div>
}