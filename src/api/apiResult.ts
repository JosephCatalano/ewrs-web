// The ASP.NET Core API wraps most responses in an `ApiResult`-style envelope
// with `value` and `message`. Swagger does not describe these envelopes, so this
// type is defined by hand and verified against the live API. Keep mapping logic
// thin: read `value` and treat it as the typed payload.
export interface ApiResult<T> {
  value?: T | null
  message?: string | null
}

export async function readApiResult<T>(response: Response): Promise<T | null> {
  const body = (await response.json()) as ApiResult<T>

  return body?.value ?? null
}
