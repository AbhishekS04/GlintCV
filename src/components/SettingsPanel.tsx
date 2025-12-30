import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Key, Shield, HelpCircle, Save, Trash2 } from 'lucide-react'

export function SettingsPanel() {
    const [apiKey, setApiKey] = useState(localStorage.getItem('resume_api_key') || "")
    const [vendor, setVendor] = useState(localStorage.getItem('resume_api_vendor') || "openai")

    const handleSave = () => {
        localStorage.setItem('resume_api_key', apiKey)
        localStorage.setItem('resume_api_vendor', vendor)
        alert("Settings saved locally.")
    }

    const handleClear = () => {
        localStorage.removeItem('resume_api_key')
        setApiKey("")
        alert("API key cleared.")
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                    <Key className="h-5 w-5 text-primary" />
                    <CardTitle>API Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Provider</label>
                        <select
                            value={vendor}
                            onChange={(e) => setVendor(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="openai">OpenAI (GPT-4o)</option>
                            <option value="google">Google Gemini</option>
                            <option value="openrouter">OpenRouter (Any Model)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">API Key</label>
                            <a href="#" className="text-xs text-primary flex items-center gap-1">
                                <HelpCircle className="h-3 w-3" />
                                Where to find?
                            </a>
                        </div>
                        <Input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                        />
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Stored locally on your device. Never sent to our servers.
                        </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button className="flex-1 gap-2" onClick={handleSave}>
                            <Save className="h-4 w-4" />
                            Save Settings
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleClear} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
