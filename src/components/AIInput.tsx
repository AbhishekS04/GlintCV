import { useState } from 'react'
import { Card, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Sparkles, Loader2, AlertCircle } from 'lucide-react'

interface AIInputProps {
    onProcess: (text: string) => Promise<void>;
    isLoading: boolean;
}

export function AIInput({ onProcess, isLoading }: AIInputProps) {
    const [text, setText] = useState("")

    return (
        <div className="flex flex-col gap-6">
            <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Raw Resume Content
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Paste your messy notes, bullet points, **raw code (React/Python/etc.)**, or ChatGPT outputs.
                        Our AI will architect a professional ATS-safe resume from your data.
                    </p>

                    <textarea
                        className="flex min-h-[300px] w-full rounded-xl border-2 border-primary/10 bg-background px-4 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-mono"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Example: Paste a React component you built, a SQL schema, or a ChatGPT character description. The AI will extract the achievements and skills automatically!"
                        disabled={isLoading}
                    />

                    <div className="mt-4 flex flex-col gap-4">
                        <Button
                            size="lg"
                            className="w-full gap-2 h-14 text-lg font-bold shadow-xl shadow-primary/20"
                            onClick={() => onProcess(text)}
                            disabled={isLoading || !text.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing with AI...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5" />
                                    Generate ATS Resume
                                </>
                            )}
                        </Button>

                        <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>
                                Make sure you have configured your API key in the settings (⚙️) before generating.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
