import { clearStaleInteraction } from './clearStaleInteraction'
import { getLoginRequest, getMsalInstance } from './msalConfig'

// Starts the MSAL redirect login. Stale interaction state is cleared first so a
// previously interrupted redirect cannot block this one.
export function signIn(): void {
  clearStaleInteraction()
  void getMsalInstance().loginRedirect(getLoginRequest())
}
