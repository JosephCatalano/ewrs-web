import { AlertHost } from '../shared/alerts'
import { LoaderOverlay } from '../shared/loader'
import { AppRoutes } from './AppRoutes'
import { AppShell } from './AppShell'

function App() {
  return (
    <>
      <LoaderOverlay />
      <AlertHost />
      <AppShell>
        <AppRoutes />
      </AppShell>
    </>
  )
}

export default App
