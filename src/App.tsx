import { AppHeader } from './components/AppHeader'
import { PageStackOutlet, PageStackProvider } from '@/navigation/PageStackContext'
import { PassSessionInvalidProvider } from '@/state/PassSessionInvalidContext'
import { FindEmotionProvider } from './state/provider'
import backgroundImage from './assets/background.webp'

function App() {
  return (
    <FindEmotionProvider>
      <PassSessionInvalidProvider>
      <PageStackProvider>
        <div
          className="flex min-h-screen flex-col bg-background bg-cover bg-center text-text-primary"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <AppHeader />
          <main className="flex min-h-0 flex-1 flex-col">
            <PageStackOutlet />
          </main>
        </div>
      </PageStackProvider>
      </PassSessionInvalidProvider>
    </FindEmotionProvider>
  )
}

export default App
