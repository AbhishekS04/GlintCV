import { useState } from 'react'
import { Button } from './ui/Button'
import { Eye, ArrowLeft, LayoutGrid, Sparkles, Settings } from 'lucide-react'
import type { ResumeData } from '../types/resume'
import { INITIAL_RESUME_DATA } from '../types/resume'
import { ManualForm } from './ManualForm'
import { AIInput } from './AIInput'
import { SettingsPanel } from './SettingsPanel'
import { Dialog } from './ui/Dialog'
import { processWithAI } from '../lib/aiService'
import { calculateATSScore } from '../lib/atsService'
import { exportToPDF, exportToDOCX } from '../lib/exportService'
import { ATSScoreDisplay } from './ATSScoreDisplay'
import { cn } from '../lib/utils'

export function ResumeBuilder({ onBack }: { onBack: () => void }) {
    const [mode, setMode] = useState<'manual' | 'ai'>('manual')
    const [data, setData] = useState<ResumeData>(INITIAL_RESUME_DATA)
    const [showPreview, setShowPreview] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [isAIProcessing, setIsAIProcessing] = useState(false)

    const handleAIProcess = async (text: string) => {
        const apiKey = localStorage.getItem('resume_api_key')
        const vendor = localStorage.getItem('resume_api_vendor') || 'openai'

        if (!apiKey) {
            alert("Please set your API key in settings first.")
            setShowSettings(true)
            return
        }

        setIsAIProcessing(true)
        try {
            const structuredData = await processWithAI(text, vendor, apiKey)
            setData(structuredData)
            setMode('manual')
        } catch (error: any) {
            alert("Error: " + error.message)
        } finally {
            setIsAIProcessing(false)
        }
    }

    const handleExport = async (format: 'pdf' | 'docx') => {
        const filename = `${data.personalDetails.firstName || 'Resume'}_${data.personalDetails.lastName || ''}`
        if (format === 'pdf') {
            await exportToPDF('resume-preview', filename)
        } else {
            await exportToDOCX(data, filename)
        }
    }

    const atsResult = calculateATSScore(data)

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            {/* Control Bar */}
            <div className="border-b bg-card/30 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>
                    <div className="h-4 w-[1px] bg-border" />
                    <div className="flex bg-muted rounded-lg p-1">
                        <button
                            onClick={() => setMode('manual')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                mode === 'manual' ? "bg-background shadow-sm" : "hover:text-foreground/80"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                            Manual
                        </button>
                        <button
                            onClick={() => setMode('ai')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                mode === 'ai' ? "bg-background shadow-sm text-primary" : "hover:text-foreground/80"
                            )}
                        >
                            <Sparkles className="h-4 w-4" />
                            AI Assist
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 md:hidden" onClick={() => setShowPreview(!showPreview)}>
                        <Eye className="h-4 w-4" />
                        {showPreview ? "Edit" : "Preview"}
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowSettings(true)}>
                        <Settings className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-1 h-8 bg-muted rounded-md p-1">
                        <button onClick={() => handleExport('pdf')} className="px-2 text-[10px] font-bold hover:bg-background rounded transition-colors">PDF</button>
                        <button onClick={() => handleExport('docx')} className="px-2 text-[10px] font-bold hover:bg-background rounded transition-colors">DOCX</button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className={cn(
                    "flex-1 overflow-y-auto px-4 py-6 md:p-6 transition-all duration-300",
                    showPreview ? "hidden md:block" : "block"
                )}>
                    <div className="max-w-3xl mx-auto flex flex-col gap-6 md:gap-8">
                        <ATSScoreDisplay result={atsResult} />

                        {mode === 'manual' ? (
                            <ManualForm data={data} onChange={setData} />
                        ) : (
                            <AIInput onProcess={handleAIProcess} isLoading={isAIProcessing} />
                        )}

                        <Dialog isOpen={showSettings} onClose={() => setShowSettings(false)} title="System Settings">
                            <SettingsPanel />
                        </Dialog>
                    </div>
                </div>

                <div className={cn(
                    "w-full md:w-[45%] lg:w-[45%] border-l bg-muted/30 overflow-hidden transition-all duration-300",
                    showPreview ? "block flex flex-col" : "hidden md:flex md:flex-col"
                )}>
                    <div className="resume-preview-wrapper p-4 md:p-8">
                        <div id="resume-preview" className="w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl p-[0.75in] flex flex-col gap-6 font-serif mx-auto break-words overflow-hidden [hyphens:auto]">
                            <div className="text-center flex flex-col gap-2 items-center mb-2">
                                <h1 className="font-bold text-3xl tracking-tight uppercase mb-1">
                                    {data.personalDetails.firstName || "FIRST"} {data.personalDetails.lastName || "LAST"}
                                </h1>
                                <div className="text-[10pt] text-gray-700 flex flex-wrap justify-center gap-x-3 gap-y-1 max-w-[90%] mx-auto">
                                    {data.personalDetails.email && <span>{data.personalDetails.email}</span>}
                                    {data.personalDetails.phone && (
                                        <span className="flex items-center">
                                            <span className="hidden sm:inline mr-2">•</span>
                                            {data.personalDetails.phone}
                                        </span>
                                    )}
                                    {data.personalDetails.location && (
                                        <span className="flex items-center">
                                            <span className="hidden sm:inline mr-2">•</span>
                                            {data.personalDetails.location}
                                        </span>
                                    )}
                                </div>
                                {data.personalDetails.links.length > 0 && (
                                    <div className="text-[9.5pt] text-primary/80 flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1 max-w-[90%] mx-auto font-medium">
                                        {data.personalDetails.links.map((link, i) => (
                                            <div key={i} className="flex items-center hover:underline decoration-primary/30">
                                                {link.url ? (
                                                    <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer">
                                                        {link.label || 'Link'}
                                                    </a>
                                                ) : (
                                                    <span>{link.label}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {data.summary && (
                                <div className="flex flex-col gap-2">
                                    <div className="font-bold border-b-2 border-black pb-1.5 text-[11pt] uppercase tracking-wide">Professional Summary</div>
                                    <p className="text-[10pt] leading-relaxed text-gray-900 text-justify whitespace-pre-line">
                                        {data.summary}
                                    </p>
                                </div>
                            )}

                            {data.experience.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    <div className="font-bold border-b-2 border-black pb-1.5 text-[11pt] uppercase tracking-wide">Experience</div>
                                    <div className="flex flex-col gap-4">
                                        {data.experience.map((exp) => (
                                            <div key={exp.id} className="flex flex-col gap-1">
                                                <div className="flex justify-between items-baseline">
                                                    <span className="font-bold text-[10.5pt]">{exp.company}</span>
                                                    <span className="text-[9.5pt] italic">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                                                </div>
                                                <div className="flex justify-between items-baseline text-[10pt]">
                                                    <span className="italic">{exp.position}</span>
                                                    <span className="text-[9.5pt]">{exp.location}</span>
                                                </div>
                                                <p className="text-[9.5pt] leading-tight text-gray-800 whitespace-pre-line mt-1">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.education.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <div className="font-bold border-b-2 border-black pb-1.5 text-[11pt] uppercase tracking-wide">Education</div>
                                    <div className="flex flex-col gap-3">
                                        {data.education.map((edu) => (
                                            <div key={edu.id} className="flex flex-col">
                                                <div className="flex justify-between items-baseline">
                                                    <span className="font-bold text-[10.5pt]">{edu.school}</span>
                                                    <span className="text-[9.5pt]">{edu.graduationDate}</span>
                                                </div>
                                                <div className="flex justify-between items-baseline text-[10pt]">
                                                    <span>{edu.degree} in {edu.field}</span>
                                                    <span className="text-[9.5pt] italic">{edu.location}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.skills.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <div className="font-bold border-b-2 border-black pb-1.5 text-[11pt] uppercase tracking-wide">Skills</div>
                                    <p className="text-[10pt] leading-snug text-gray-900">
                                        <span className="font-semibold">Technical Skills: </span>
                                        {data.skills.join(", ")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
