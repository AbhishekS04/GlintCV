import type { ScoreResult } from '../lib/atsService'
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react'
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
        <Card className="overflow-hidden border-2 shadow-sm">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        ATS Readiness Score
                    </CardTitle>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-background rounded-full border shadow-sm">
                        <span className={`text-lg font-black ${getScoreColor(result.score)}`}>{result.score}%</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-8 px-6 pb-6">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="relative h-36 w-36 shrink-0">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                            <circle className="stroke-muted/20" strokeWidth="6" fill="transparent" r="44" cx="50" cy="50" />
                            <circle
                                className={`${getCircleColor(result.score)} transition-all duration-[1500ms] ease-in-out`}
                                strokeWidth="6"
                                strokeDasharray={`${result.score * 2.76}, 276.4`}
                                strokeLinecap="round"
                                fill="transparent"
                                r="44"
                                cx="50"
                                cy="50"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center -mt-1">
                            <span className="text-3xl font-black tracking-tighter">{result.score}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">of 100</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {result.checks.map((check, i) => (
                                <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg border bg-card/50">
                                    {check.passed ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[11px] font-bold leading-none">{check.label}</span>
                                        <p className="text-[10px] text-muted-foreground leading-tight">
                                            {check.suggestion}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                        <div className="space-y-1">
                            <p className="text-[12px] font-bold text-amber-600">ATS Estimation Disclaimer</p>
                            <p className="text-[11px] text-amber-600/80 leading-snug">
                                This score is an estimate based on industry-standard parsing rules. Different ATS systems (Workday, Greenhouse, Lever) use proprietary logic. A score above 80% is recommended for most applications.
                            </p>
                        </div>
                    </div>

                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3 items-center">
                        <Info className="h-4 w-4 text-blue-500 shrink-0" />
                        <p className="text-[11px] text-blue-600 font-medium">
                            How we calculate: Score = 15% Contact + 15% Summary + 30% Experience + 20% Skills + 10% Impact + 10% Completeness.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
