import type { ScoreResult } from '../lib/atsService'
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'

export function ATSScoreDisplay({ result }: { result: ScoreResult }) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-500"
        if (score >= 50) return "text-amber-500"
        return "text-rose-500"
    }

    const getCircleColor = (score: number) => {
        if (score >= 80) return "stroke-emerald-500"
        if (score >= 50) return "stroke-amber-500"
        return "stroke-rose-500"
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-card/50 pb-4">
                <CardTitle className="flex items-center justify-between">
                    ATS Score
                    <span className={`text-2xl font-black ${getScoreColor(result.score)}`}>{result.score}%</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex justify-center mb-8">
                    <div className="relative h-32 w-32">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                            <circle className="stroke-muted" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
                            <circle
                                className={`${getCircleColor(result.score)} transition-all duration-1000 ease-out`}
                                strokeWidth="8"
                                strokeDasharray={`${result.score * 2.51}, 251.2`}
                                strokeLinecap="round"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{result.score}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {result.checks.map((check, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            {check.passed ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                            )}
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold leading-none">{check.label}</span>
                                <p className="text-[10px] text-muted-foreground leading-tight italic">
                                    {check.suggestion}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-primary uppercase">Pro Tip</span>
                        <p className="text-[11px] font-medium leading-tight">Focus on action verbs and metrics.</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-primary" />
                </div>
            </CardContent>
        </Card>
    )
}
