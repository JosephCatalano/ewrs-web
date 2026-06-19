import './PagePlaceholder.css'

interface PagePlaceholderProps {
  title: string
}

// Temporary stand-in for routes whose feature pages are not migrated yet. It
// proves routing, the shell, and auth transitions without real feature state.
export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <section className="page-placeholder">
      <p className="page-placeholder__eyebrow">EWRS React migration</p>
      <h1>{title}</h1>
      <p className="page-placeholder__note">
        This page is not migrated yet. Routing and the app shell are in place.
      </p>
    </section>
  )
}
