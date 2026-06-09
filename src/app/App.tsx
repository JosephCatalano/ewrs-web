import './App.css'
import { AlertHost } from '../shared/alerts'
import { LoaderOverlay } from '../shared/loader'
import { AppShell } from './AppShell'

function App() {
  return (
    <>
      <LoaderOverlay />
      <AlertHost />
      <AppShell>
        <main className="app-shell" aria-labelledby="app-title">
          <div className="app-shell__content">
            <p className="app-shell__eyebrow">EWRS React migration</p>
            <h1 id="app-title">React shell ready</h1>
            <p className="app-shell__summary">
              The Vite React shell is ready for Phase 2 foundations with typed
              config, copied static files, and verified build/test tooling.
            </p>
          </div>
        </main>
      </AppShell>
    </>
  )
}

export default App
