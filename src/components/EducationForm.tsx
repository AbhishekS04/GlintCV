import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Plus, Trash2, GraduationCap } from 'lucide-react'
import type { Education } from '../types/resume'
import { v4 as uuidv4 } from 'uuid'

interface EducationFormProps {
    data: Education[];
    onChange: (data: Education[]) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
    const addEducation = () => {
        onChange([
            ...data,
            {
                id: uuidv4(),
                school: "",
                degree: "",
                field: "",
                location: "",
                graduationDate: "",
            },
        ]);
    };

    const removeEducation = (id: string) => {
        onChange(data.filter((e) => e.id !== id));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    };

    return (
        <div className="space-y-6">
            {data.map((edu) => (
                <div key={edu.id} className="p-4 rounded-xl border bg-card/50 space-y-4 relative group">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeEducation(edu.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <GraduationCap className="h-4 w-4" />
                                <span>School / University</span>
                            </div>
                            <Input value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} placeholder="Stanford University" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Degree</label>
                            <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor of Science" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Field of Study</label>
                            <Input value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} placeholder="Computer Science" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Input value={edu.location} onChange={(e) => updateEducation(edu.id, 'location', e.target.value)} placeholder="Palo Alto, CA" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Graduation Date</label>
                            <Input value={edu.graduationDate} onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)} placeholder="MM/YYYY" />
                        </div>
                    </div>
                </div>
            ))}

            <Button variant="outline" className="w-full gap-2 border-dashed h-12" onClick={addEducation}>
                <Plus className="h-4 w-4" />
                Add Education
            </Button>
        </div>
    )
}
