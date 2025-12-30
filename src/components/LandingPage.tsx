import { Button } from './ui/Button'
import { CheckCircle2, Zap, Sparkles, Shield, Layout, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export function LandingPage({ onStart }: { onStart: () => void }) {
    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative px-6 pt-20 pb-16 text-center lg:pt-32">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(var(--primary),0.1)_0%,transparent_100%)]" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto max-w-[800px] flex flex-col gap-6"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm self-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>AI-Powered ATS Optimization</span>
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                        Build <span className="text-primary italic">ATS-Perfect</span> Resumes with AI
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Generate professional resumes in seconds using AI. Manual or AI-assisted.
                        No images. No clutter. Just pure career impact.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                        <Button size="lg" className="rounded-full px-8" onClick={onStart}>
                            Create Resume
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8" onClick={onStart}>
                            Try AI Mode
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Stats/Features Section */}
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Layout,
                            title: "ATS 100/100 Optimized",
                            desc: "Engineered to pass every Applicant Tracking System filter with ease."
                        },
                        {
                            icon: Zap,
                            title: "Manual + AI Modes",
                            desc: "Full manual control or intelligent AI-assisted generation from raw notes."
                        },
                        {
                            icon: Shield,
                            title: "Secure & Encrypted",
                            desc: "Your data stays yours. End-to-end encrypted API usage. No server logs."
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col gap-3 p-6 rounded-2xl border bg-card/50 backdrop-blur-sm"
                        >
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Export Section Info */}
            <section className="container mx-auto px-6">
                <div className="rounded-3xl border bg-primary/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="flex flex-col gap-4 max-w-xl">
                        <h2 className="text-3xl font-bold">Production-Ready Exports</h2>
                        <p className="text-muted-foreground text-lg">
                            Export your resume in recruiter-friendly PDF or DOCX formats.
                            Customize font sizes, spacing, and optional profile images.
                        </p>
                        <div className="flex flex-col gap-2 mt-2">
                            {[
                                "Standard A4 & Letter page sizes",
                                "ATS-safe fonts (Inter, Roboto, Arial)",
                                "No watermarks or hidden branding",
                                "Perfectly structured DOCX headers"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="w-64 h-80 rounded-xl border bg-background shadow-2xl transform transition-transform group-hover:-translate-y-2 duration-500 flex flex-col p-4 gap-2">
                            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                            <div className="h-2 w-full bg-muted/50 rounded" />
                            <div className="h-2 w-full bg-muted/50 rounded" />
                            <div className="mt-4 h-3 w-1/3 bg-muted rounded" />
                            <div className="h-2 w-full bg-muted/50 rounded" />
                            <div className="h-2 w-full bg-muted/50 rounded" />
                            <div className="h-2 w-full bg-muted/50 rounded" />
                            <div className="mt-4 h-3 w-1/3 bg-muted rounded" />
                            <div className="h-2 w-full bg-muted/50 rounded" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 p-4 glass rounded-xl shadow-lg">
                            <FileText className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
