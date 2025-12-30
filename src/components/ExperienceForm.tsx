import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Plus, Trash2, Calendar, MapPin, Building2 } from 'lucide-react'
import type { Experience } from '../types/resume'
import { v4 as uuidv4 } from 'uuid'

interface ExperienceFormProps {
    data: Experience[];
    onChange: (data: Experience[]) => void;
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
    const addExperience = () => {
        onChange([
            ...data,
            {
                id: uuidv4(),
                company: "",
                position: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
            },
        ]);
    };

    const removeExperience = (id: string) => {
        onChange(data.filter((e) => e.id !== id));
    };

    const updateExperience = (id: string, field: keyof Experience, value: any) => {
        onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    };

    return (
        <div className="space-y-6">
            {data.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl border bg-card/50 space-y-4 relative group">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExperience(exp.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Building2 className="h-4 w-4" />
                                <span>Company</span>
                            </div>
                            <Input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Position</label>
                            <Input value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} placeholder="Software Engineer" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <MapPin className="h-4 w-4" />
                                <span>Location</span>
                            </div>
                            <Input value={exp.location} onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} placeholder="City, Country" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Calendar className="h-4 w-4" />
                                    <span>Start Date</span>
                                </div>
                                <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="MM/YYYY" />
                            </div>
                            {!exp.current && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">End Date</label>
                                    <Input value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="MM/YYYY" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            placeholder="Responsibilities and achievements..."
                        />
                    </div>
                </div>
            ))}

            <Button variant="outline" className="w-full gap-2 border-dashed h-12" onClick={addExperience}>
                <Plus className="h-4 w-4" />
                Add Experience
            </Button>
        </div>
    )
}
