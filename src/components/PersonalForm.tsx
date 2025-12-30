import { Input } from './ui/Input'
import type { PersonalDetails } from '../types/resume'

interface PersonalFormProps {
    data: PersonalDetails;
    onChange: (data: PersonalDetails) => void;
}

export function PersonalForm({ data, onChange }: PersonalFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    return (
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
            <div className="space-y-2">
                <label className="text-sm font-medium">Portfolio</label>
                <Input name="portfolio" value={data.portfolio} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn</label>
                <Input name="linkedin" value={data.linkedin} onChange={handleChange} placeholder="https://..." />
            </div>
        </div>
    )
}
