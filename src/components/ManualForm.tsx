import type { ResumeData } from '../types/resume'
import { PersonalForm } from './PersonalForm'
import { ExperienceForm } from './ExperienceForm'
import { EducationForm } from './EducationForm'
import { SkillsForm } from './SkillsForm'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { User, Briefcase, GraduationCap, Code, FileText, Award } from 'lucide-react'

interface ManualFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export function ManualForm({ data, onChange }: ManualFormProps) {
    const updateSection = (section: keyof ResumeData, value: any) => {
        onChange({ ...data, [section]: value });
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Personal Details */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PersonalForm
                        data={data.personalDetails}
                        onChange={(val) => updateSection('personalDetails', val)}
                    />
                </CardContent>
            </Card>

            {/* Professional Summary */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={data.summary}
                        onChange={(e) => updateSection('summary', e.target.value)}
                        placeholder="A brief overview of your professional background and key strengths..."
                    />
                </CardContent>
            </Card>

            {/* Experience */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                    <ExperienceForm
                        data={data.experience}
                        onChange={(val) => updateSection('experience', val)}
                    />
                </CardContent>
            </Card>

            {/* Education */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                    <EducationForm
                        data={data.education}
                        onChange={(val) => updateSection('education', val)}
                    />
                </CardContent>
            </Card>

            {/* Skills */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                    <Code className="h-5 w-5 text-primary" />
                    <CardTitle>Skills & Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                    <SkillsForm
                        data={data.skills}
                        onChange={(val) => updateSection('skills', val)}
                    />
                </CardContent>
            </Card>

            {/* Certifications & Awards */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <CardTitle>Certifications & Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                    <SkillsForm
                        data={data.certifications}
                        onChange={(val) => updateSection('certifications', val)}
                        label="Certifications"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
