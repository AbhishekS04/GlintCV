import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Plus, Trash2 } from 'lucide-react'
import type { PersonalDetails, ExternalLink } from '../types/resume'

interface PersonalFormProps {
    data: PersonalDetails;
    onChange: (data: PersonalDetails) => void;
}

export function PersonalForm({ data, onChange }: PersonalFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    const handleLinkChange = (index: number, field: keyof ExternalLink, value: string) => {
        const newLinks = [...data.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        onChange({ ...data, links: newLinks });
    };

    const addLink = () => {
        onChange({
            ...data,
            links: [...data.links, { label: '', url: '' }]
        });
    };

    const removeLink = (index: number) => {
        onChange({
            ...data,
            links: data.links.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input name="firstName" value={data.firstName} onChange={handleChange} placeholder="John" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input name="lastName" value={data.lastName} onChange={handleChange} placeholder="Doe" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" type="email" value={data.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input name="phone" value={data.phone} onChange={handleChange} placeholder="+1 234 567 890" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input name="location" value={data.location} onChange={handleChange} placeholder="New York, USA" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Professional Links</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addLink} className="h-8 gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        Add Link
                    </Button>
                </div>

                <div className="space-y-3">
                    {data.links.map((link, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1 md:flex-initial md:w-1/3 space-y-1">
                                <Input
                                    value={link.label}
                                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                                    placeholder="LinkedIn, Portfolio, etc."
                                    className="h-9 text-sm"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <Input
                                    value={link.url}
                                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                    placeholder="https://..."
                                    className="h-9 text-sm"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeLink(index)}
                                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {data.links.length === 0 && (
                        <p className="text-xs text-center text-muted-foreground py-2 border border-dashed rounded-lg">
                            No links added yet. Add LinkedIn, GitHub, or Portfolio.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
