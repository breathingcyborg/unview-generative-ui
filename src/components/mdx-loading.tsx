import { Card, CardContent } from "./ui/card";
import { Loader2 } from "lucide-react";

export function MDXLoading() {
    return <Card className="max-w-md">
        <CardContent>
            <div className="flex flex-row gap-8">
                <div>
                    <Loader2 
                        size={32}
                        className="animate-spin" />
                </div>
                <div>
                    Generating UI
                </div>
            </div>
        </CardContent>
    </Card>
}