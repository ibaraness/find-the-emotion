import { AppHeader } from './components/AppHeader'
import { PageStackOutlet, PageStackProvider } from '@/navigation/PageStackContext'
import { FindEmotionProvider } from './state/provider'

function App() {
  return (
    <PageStackProvider>
      <FindEmotionProvider>
        <div className="flex min-h-screen flex-col bg-background text-text-primary">
          <AppHeader />
          <main className="flex min-h-0 flex-1 flex-col">
            <PageStackOutlet />
          </main>
        </div>
      </FindEmotionProvider>
    </PageStackProvider>
  )
}

export default App
