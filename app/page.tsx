import { AiModels } from '@/components/ai-models'
import { ProfilePanel } from '@/components/profile-panel'
import { Projects } from '@/components/projects'
import { Skills } from '@/components/skills'
import { Stats } from '@/components/stats'

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1400px] flex-col justify-center px-5 py-8 lg:h-svh lg:overflow-hidden lg:px-10 lg:py-0">
      <div className="grid gap-10 lg:h-full lg:grid-cols-[35%_1fr] lg:items-center lg:gap-12">
        <ProfilePanel />
        <div className="flex flex-col gap-5">
          <Stats />
          <AiModels />
          <Skills />
          <Projects />
        </div>
      </div>
    </main>
  )
}
