import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { LandingPage } from './components/LandingPage'
import { ResumeBuilder } from './components/ResumeBuilder'

function App() {
  const [showBuilder, setShowBuilder] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {showBuilder ? (
          <ResumeBuilder onBack={() => setShowBuilder(false)} />
        ) : (
          <LandingPage onStart={() => setShowBuilder(true)} />
        )}
      </main>

      <footer className="border-t py-8 px-6 bg-card/50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-muted-foreground text-sm gap-4">
          <p>© 2025 AI Resume Builder. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
