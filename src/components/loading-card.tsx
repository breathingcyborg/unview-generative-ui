import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { CustomSpinner } from "./ui/custom-spinner";

export function LoadingCard({ title, subtitle }: { title: string, subtitle?: string }) {
    return <Card className="max-w-md">
        <CardContent>
            <div className="flex flex-row gap-8 items-center">
                <div>
                    <CustomSpinner className="w-7 h-7"/>
                </div>
                <div>
                    <div className={cn(
                        "text-xl font-bold",
                        { "mb-2": !!subtitle }
                    )}>
                        {title}
                    </div>
                    {
                        subtitle && (
                            <div className="text-card-foreground/50">
                                {subtitle}
                            </div>
                        )
                    }
                </div>
            </div>
        </CardContent>
    </Card>
}