import { useState } from 'react'
import { Button } from './ui/Button'
import { Eye, ArrowLeft, LayoutGrid, Sparkles, Settings, Link as LinkIcon } from 'lucide-react'
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
                    <div className="resume-preview-wrapper p-4 md:p-8 bg-muted/20">
                        <div id="resume-preview" className="w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl p-[0.7in] flex flex-col gap-6 font-sans-premium mx-auto break-words overflow-hidden">
                            {/* Header: Compact Executive Style */}
                            <div className="text-center flex flex-col gap-2 items-center border-b pb-4">
                                <h1 className="font-bold text-[20pt] tracking-tight uppercase font-sans-premium leading-none mb-1">
                                    {data.personalDetails.firstName || "FIRST"} {data.personalDetails.lastName || "LAST"}
                                </h1>
                                <div className="text-[9pt] text-gray-700 flex flex-wrap justify-center gap-x-2 gap-y-1 max-w-[95%] mx-auto font-medium">
                                    {data.personalDetails.location && <span>{data.personalDetails.location}</span>}
                                    {(data.personalDetails.location && (data.personalDetails.phone || data.personalDetails.email)) && <span className="text-gray-300">|</span>}
                                    {data.personalDetails.phone && <span>{data.personalDetails.phone}</span>}
                                    {(data.personalDetails.phone && data.personalDetails.email) && <span className="text-gray-300">|</span>}
                                    {data.personalDetails.email && <span className="text-black">{data.personalDetails.email}</span>}
                                </div>
                                {data.personalDetails.links.length > 0 && (
                                    <div className="text-[9pt] flex flex-wrap justify-center gap-x-3 gap-y-1 mt-0.5 max-w-[95%] mx-auto lowercase font-medium">
                                        {data.personalDetails.links.map((link, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                {i > 0 && <span className="text-gray-300">•</span>}
                                                {link.url ? (
                                                    <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors underline decoration-blue-200 underline-offset-2">
                                                        {link.label || 'Link'}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-600">{link.label}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Summary Section */}
                            {data.summary && (
                                <div className="flex flex-col gap-2">
                                    <div className="font-bold border-b border-gray-800 pb-1 text-[10pt] uppercase tracking-wider font-sans-premium">Professional Summary</div>
                                    <p className="text-[9pt] leading-normal text-gray-800 font-sans-premium">
                                        {data.summary}
                                    </p>
                                </div>
                            )}

                            {/* Experience Section */}
                            {data.experience.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    <div className="font-bold border-b border-gray-800 pb-1 text-[10pt] uppercase tracking-wider font-sans-premium">Professional Experience</div>
                                    <div className="flex flex-col gap-5">
                                        {data.experience.map((exp) => (
                                            <div key={exp.id} className="flex flex-col gap-1.5">
                                                <div className="flex justify-between items-end">
                                                    <span className="font-bold text-[10.5pt] text-black uppercase tracking-tight">{exp.company}</span>
                                                    <span className="text-[8.5pt] font-semibold text-gray-500 tabular-nums uppercase">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                                                </div>
                                                <div className="flex justify-between items-baseline -mt-1">
                                                    <span className="text-[9.5pt] font-medium italic text-gray-700">{exp.position}</span>
                                                    <span className="text-[8.5pt] text-gray-500">{exp.location}</span>
                                                </div>
                                                <div className="text-[9pt] leading-normal text-gray-800 whitespace-pre-line mt-0.5 pl-1.5 border-l border-gray-100">
                                                    {exp.description}

                                                    {exp.links && exp.links.length > 0 && (
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[8.5pt]">
                                                            {exp.links.map((link, idx) => (
                                                                <a key={idx} href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-blue-100 underline-offset-2 flex items-center gap-1 lowercase">
                                                                    <LinkIcon className="h-3 w-3" />
                                                                    {link.label || 'View Project'}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education Section */}
                            {data.education.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    <div className="font-bold border-b border-gray-800 pb-1 text-[10pt] uppercase tracking-wider font-sans-premium">Education</div>
                                    <div className="flex flex-col gap-4">
                                        {data.education.map((edu) => (
                                            <div key={edu.id} className="flex flex-col gap-0.5">
                                                <div className="flex justify-between items-end">
                                                    <span className="font-bold text-[10pt] text-black">{edu.school}</span>
                                                    <span className="text-[8.5pt] font-semibold text-gray-500 uppercase tabular-nums">{edu.graduationDate}</span>
                                                </div>
                                                <div className="flex justify-between items-baseline">
                                                    <span className="text-[9pt] text-gray-700">{edu.degree} in {edu.field}</span>
                                                    <span className="text-[8.5pt] italic text-gray-500">{edu.location}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills Section */}
                            {data.skills.length > 0 && (
                                <div className="flex flex-col gap-2.5">
                                    <div className="font-bold border-b border-gray-800 pb-1 text-[10pt] uppercase tracking-wider font-sans-premium">Technical Skills</div>
                                    <div className="text-[9pt] leading-normal text-gray-800 flex flex-wrap gap-x-3 gap-y-1">
                                        {data.skills.map((skill, i) => (
                                            <span key={i} className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded border border-gray-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
