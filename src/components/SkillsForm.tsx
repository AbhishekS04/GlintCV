import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { X, Plus } from 'lucide-react'
import { useState } from 'react'

interface SkillsFormProps {
    data: string[];
    onChange: (data: string[]) => void;
    label?: string;
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
    const [input, setInput] = useState("")

    const addSkill = () => {
        if (input.trim() && !data.includes(input.trim())) {
            onChange([...data, input.trim()])
            setInput("")
        }
    }

    const removeSkill = (skill: string) => {
        onChange(data.filter((s) => s !== skill))
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Type a skill and press enter..."
                />
                <Button onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {data.map((skill) => (
                    <div key={skill} className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
                {data.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
                )}
            </div>
        </div>
    )
}
